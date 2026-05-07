import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

// In-memory store (replace with DB in production)
const sharedSnippets = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const snippet = await request.json();
    const shareId = nanoid(10);
    
    sharedSnippets.set(shareId, {
      ...snippet,
      sharedAt: new Date().toISOString(),
    });
    
    return NextResponse.json({ 
      shareId,
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${shareId}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to share snippet' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Share ID required' }, { status: 400 });
  }
  
  const snippet = sharedSnippets.get(id);
  
  if (!snippet) {
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
  }
  
  return NextResponse.json(snippet);
}
