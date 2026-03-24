import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/site.config';
import BlogCard from '@/components/BlogCard';
import CTABlock from '@/components/CTABlock';

export default async function HomePage() {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/blog"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Read the Blog
            </Link>
            <a
              href={siteConfig.cta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              {siteConfig.cta.text}
            </a>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all posts
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <CTABlock />
    </>
  );
}
