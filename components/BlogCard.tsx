import Link from 'next/link';
import type { Post } from '@/lib/posts';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { slug, frontmatter, readingTime } = post;
  const primaryKeyword = frontmatter.keywords?.[0];

  return (
    <article className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg">
      {primaryKeyword && (
        <span className="mb-3 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
          {primaryKeyword}
        </span>
      )}

      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
        <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
          {frontmatter.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 flex-1 text-sm text-gray-600">
        {frontmatter.description}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
        <time dateTime={frontmatter.date}>
          {new Date(frontmatter.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </time>
        <span aria-hidden="true">&middot;</span>
        <span>{readingTime} min read</span>
      </div>
    </article>
  );
}
