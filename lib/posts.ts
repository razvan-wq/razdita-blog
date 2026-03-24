import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  keywords: string[];
  author?: string;
  image?: string;
  heroImage?: string;
  images?: string[];
  faqs?: string;
  schemas?: string;
  businessId?: string;
  published?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: number;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 230;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function getMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'));
}

export async function getAllPosts(): Promise<Post[]> {
  const files = getMdxFiles();

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const frontmatter = data as PostFrontmatter;

      if (frontmatter.published === false) {
        return null;
      }

      return {
        slug,
        frontmatter,
        content,
        readingTime: calculateReadingTime(content),
      };
    })
    .filter((post): post is Post => post !== null);

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    frontmatter,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export async function getRelatedPosts(
  keywords: string[],
  currentSlug: string,
  limit: number = 3
): Promise<Post[]> {
  const allPosts = await getAllPosts();

  const scored = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const overlap = post.frontmatter.keywords?.filter((kw) =>
        keywords.map((k) => k.toLowerCase()).includes(kw.toLowerCase())
      ).length ?? 0;
      return { post, score: overlap };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ post }) => post);
}
