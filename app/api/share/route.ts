import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const SHARED_DIR = join(process.cwd(), '.shared-snippets');

// Ensure directory exists
if (!existsSync(SHARED_DIR)) {
  mkdirSync(SHARED_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const snippet = await request.json();
    const id = Math.random().toString(36).substring(2, 15);
    const filePath = join(SHARED_DIR, `${id}.json`);
    
    writeFileSync(filePath, JSON.stringify(snippet, null, 2));
    
    return NextResponse.json({ id, url: `/share/${id}` });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to share snippet' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    const filePath = join(SHARED_DIR, `${id}.json`);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }
    
    const snippet = JSON.parse(readFileSync(filePath, 'utf-8'));
    return NextResponse.json(snippet);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load snippet' },
      { status: 500 }
    );
  }
}
