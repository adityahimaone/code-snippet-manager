import { notFound } from 'next/navigation';

async function getSharedSnippet(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/share?id=${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function SharePage({ params }: { params: { id: string } }) {
  const snippet = await getSharedSnippet(params.id);
  if (!snippet) { notFound(); }

  return (
    <div className="min-h-screen p-6" style={{ background: '#faf9f7', color: '#000' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{snippet.title}</h1>
          <p style={{ color: '#696f7b' }}>{snippet.description}</p>
          <div className="flex gap-2 mt-4">
            {snippet.tags?.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-0.5 rounded-full"
                style={{ border: '1px solid rgba(216,114,60,0.4)', color: '#d8723c' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          className="rounded-lg p-5 overflow-x-auto"
          style={{ background: '#0d1117', border: '1px solid #e6e6e6', color: '#c9d1d9' }}
        >
          <pre className="text-sm font-mono leading-relaxed">
            <code>{snippet.code}</code>
          </pre>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm" style={{ color: '#d8723c' }}>
            Create your own snippets →
          </a>
        </div>
      </div>
    </div>
  );
}
