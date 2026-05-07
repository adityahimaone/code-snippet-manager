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
  
  if (!snippet) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display mb-2">{snippet.title}</h1>
          <p className="text-gray-400">{snippet.description}</p>
          <div className="flex gap-2 mt-4">
            {snippet.tags?.map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-1 bg-gray-800 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{snippet.code}</code>
          </pre>
        </div>
        
        <div className="mt-6 text-center">
          <a href="/" className="text-orange-500 hover:underline">
            Create your own snippets →
          </a>
        </div>
      </div>
    </div>
  );
}
