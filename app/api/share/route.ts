import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { db } from '@/lib/db';
import { snippets } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const snippet = await request.json();
    const shareId = nanoid(10);
    
    await db.insert(snippets).values({
      id: shareId,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      tags: snippet.tags ? JSON.stringify(snippet.tags) : null,
      sharedAt: new Date(),
    });
    
    // Use relative URL to avoid localhost hardcoding
    return NextResponse.json({ 
      shareId,
      url: `/share/${shareId}`
    });
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.json({ error: 'Failed to share snippet' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Share ID required' }, { status: 400 });
  }
  
  try {
    const snippet = await db.query.snippets.findFirst({
      where: (snippets, { eq }) => eq(snippets.id, id),
    });
    
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      ...snippet,
      tags: snippet.tags ? JSON.parse(snippet.tags) : [],
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch snippet' }, { status: 500 });
  }
}
