import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { siteConfig } from '@/site.config';
import BlogCard from './BlogCard';
import ReadingProgressBar from './ReadingProgressBar';

interface BlogPostProps {
  post: Post;
  relatedPosts: Post[];
}

function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { text: string; slug: string; depth: number }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({ text, slug, depth: match[1].length });
  }

  return headings;
}

/**
 * Transform inline CTA text patterns into styled HTML blocks.
 * Detects patterns like:
 *   "Join 285+ Amazon sellers... → skool.com/..."
 *   "Try Selluna AI free → selluna.ai | Use code RAZ30..."
 *   "Book your free discovery call → https://go.horisonmarketing.com/offer"
 */
function transformCTAs(content: string): string {
  // Skool CTA pattern
  content = content.replace(
    /^.*?(?:Join|join)\s+\d+\+?\s+.*?(?:community|sellers|members).*?→\s*((?:https?:\/\/)?skool\.com\/[^\s)]+).*$/gm,
    (_, url) => {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      return `<div class="cta-block cta-skool">
<div class="cta-logo"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#7C3AED"/><path d="M14 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6zm-2 14c0-3.3 4-6 8-6s8 2.7 8 6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div>
<div class="cta-body">
<p class="cta-heading">Join the Free Community</p>
<p class="cta-desc">Connect with hundreds of Amazon sellers sharing strategies, wins, and lessons learned.</p>
<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="cta-button cta-button-skool">Join Free Community</a>
</div>
</div>`;
    }
  );

  // Selluna CTA pattern
  content = content.replace(
    /^.*?(?:Selluna|selluna).*?→\s*((?:https?:\/\/)?selluna\.ai[^\s|)]*).*?(?:RAZ30|raz30).*$/gm,
    (_, url) => {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      return `<div class="cta-block cta-selluna">
<div class="cta-logo"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#0D9488"/><path d="M12 20l4 4 12-12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 32c6.6 0 12-5.4 12-12S26.6 8 20 8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg></div>
<div class="cta-body">
<p class="cta-heading">Generate Amazon Listings with AI</p>
<p class="cta-desc">Create scroll-stopping product images, titles, and bullet points in minutes. Use code RAZ30 for 30% off.</p>
<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="cta-button cta-button-selluna">Try Selluna AI Free</a>
</div>
</div>`;
    }
  );

  // Horison Discovery Call CTA pattern
  content = content.replace(
    /^.*?(?:Book|book|Want us to|Discovery|discovery).*?(?:call|implement).*?→\s*(https?:\/\/[^\s)]+).*$/gm,
    (_, url) => {
      return `<div class="cta-block cta-horison">
<div class="cta-logo"><svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#FF5200"/><path d="M12 28V12h4v6h8v-6h4v16h-4v-6h-8v6h-4z" fill="white"/></svg></div>
<div class="cta-body">
<p class="cta-heading">Ready to Scale Your Amazon Brand?</p>
<p class="cta-desc">86% average YoY growth. $1B+ managed revenue. 200+ brands served. Book a free strategy call with our team.</p>
<a href="${url}" target="_blank" rel="noopener noreferrer" class="cta-button cta-button-horison">Book Free Discovery Call</a>
</div>
</div>`;
    }
  );

  // Generic fallback: any remaining "→ URL" patterns
  content = content.replace(
    /^(.+?)\s*→\s*(https?:\/\/[^\s)]+)\s*$/gm,
    (full, text, url) => {
      // Skip if already transformed
      if (full.includes('cta-block')) return full;
      return `<div class="cta-block cta-generic">
<div class="cta-body">
<p class="cta-desc">${text.trim()}</p>
<a href="${url}" target="_blank" rel="noopener noreferrer" class="cta-button">${url.includes('skool') ? 'Join Free →' : url.includes('selluna') ? 'Try Free →' : 'Learn More →'}</a>
</div>
</div>`;
    }
  );

  return content;
}

/**
 * Insert inline images into the content after the 2nd and 4th H2 headings.
 */
function insertInlineImages(content: string, images: string[]): string {
  if (!images || images.length <= 1) return content;

  const inlineImages = images.slice(1); // skip hero
  const h2Regex = /^## .+$/gm;
  let h2Count = 0;
  let insertAfterH2 = [2, 4]; // insert after 2nd and 4th H2

  const lines = content.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    result.push(line);
    if (/^## .+$/.test(line)) {
      h2Count++;
      const imageIndex = insertAfterH2.indexOf(h2Count);
      if (imageIndex !== -1 && inlineImages[imageIndex]) {
        result.push('');
        result.push(`<div class="blog-inline-image">
<img src="${inlineImages[imageIndex]}" alt="Diagram illustrating key concepts" loading="lazy" />
</div>`);
        result.push('');
      }
    }
  }

  return result.join('\n');
}

export default function BlogPost({ post, relatedPosts }: BlogPostProps) {
  const { frontmatter, content, readingTime } = post;
  const headings = extractHeadings(content);
  const author = frontmatter.author ?? siteConfig.author;

  // Get images from frontmatter
  const heroImage = frontmatter.heroImage || (frontmatter as any).images?.[0];
  const allImages: string[] = (frontmatter as any).images || [];

  // Transform content: CTAs → styled blocks, add inline images
  let processedContent = transformCTAs(content);
  processedContent = insertInlineImages(processedContent, allImages);

  return (
    <>
      <ReadingProgressBar />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">
          {/* Main content */}
          <article className="min-w-0">
            {/* Post header */}
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span aria-hidden="true">&middot;</span>
                <span>{readingTime} min read</span>
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {frontmatter.title}
              </h1>

              <p className="mt-4 text-lg text-gray-600" data-description="">
                {frontmatter.description}
              </p>

              {frontmatter.keywords && frontmatter.keywords.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {frontmatter.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Hero image */}
            {heroImage && (
              <div className="mb-10 overflow-hidden rounded-xl shadow-lg">
                <img
                  src={heroImage}
                  alt={frontmatter.title}
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* MDX content */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote
                source={processedContent}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, rehypeHighlight],
                  },
                }}
              />
            </div>

            {/* Author section */}
            <div className="mt-12 flex items-center gap-5 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <img
                src="/images/raz-dita.png"
                alt="Raz Dita"
                className="h-20 w-20 rounded-full object-cover object-top ring-2 ring-gray-200"
              />
              <div>
                <p className="text-sm font-medium text-gray-500">Written by</p>
                <p className="text-lg font-semibold text-gray-900">{author}</p>
                <p className="text-sm text-gray-500">
                  Co-founder of Horison Marketing. Helping Amazon brands scale with data-driven PPC and AI.
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-12">
              <div className="cta-block cta-horison">
                <div className="cta-logo">
                  <svg viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" fill="#FF5200"/>
                    <path d="M12 28V12h4v6h8v-6h4v16h-4v-6h-8v6h-4z" fill="white"/>
                  </svg>
                </div>
                <div className="cta-body">
                  <p className="cta-heading">Ready to Scale Your Amazon Brand?</p>
                  <p className="cta-desc">86% average YoY growth. $1B+ managed revenue. 200+ brands served.</p>
                  <a
                    href={siteConfig.cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button cta-button-horison"
                  >
                    {siteConfig.cta.text}
                  </a>
                </div>
              </div>
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900">
                  Related Articles
                </h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((related) => (
                    <BlogCard key={related.slug} post={related} />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Table of Contents sidebar */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  On this page
                </p>
                <nav className="mt-3">
                  {headings.map((heading) => (
                    <a
                      key={heading.slug}
                      href={`#${heading.slug}`}
                      className={`toc-link ${heading.depth === 3 ? 'depth-3' : ''}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <Link
                    href="/blog"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    &larr; Back to all posts
                  </Link>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
