interface BlogPostContentProps {
  html: string;
}

export default function BlogPostContent({ html }: BlogPostContentProps) {
  return (
    <div
      className="blog-content min-w-0 max-w-full text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
