import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/site.config';
import BlogCard from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Blog',
  description: `All articles from ${siteConfig.name}`,
};

const POSTS_PER_PAGE = 12;

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10));
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-600">
        {allPosts.length} article{allPosts.length !== 1 ? 's' : ''} published
      </p>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-gray-500">No posts yet. Check back soon.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <a
              href={`/blog?page=${currentPage - 1}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Previous
            </a>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={`/blog?page=${page}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </a>
          ))}

          {currentPage < totalPages && (
            <a
              href={`/blog?page=${currentPage + 1}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Next
            </a>
          )}
        </nav>
      )}
    </section>
  );
}
