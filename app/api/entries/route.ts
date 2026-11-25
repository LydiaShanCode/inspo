import { NextRequest, NextResponse } from 'next/server';
import { getAllEntries, createEntry, searchEntries, filterEntries } from '@/lib/storage';
import { CreateEntryInput } from '@/lib/types';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    
    let entries;
    
    if (query) {
      entries = await searchEntries(query);
    } else if (type || category || tag) {
      entries = await filterEntries(
        type || undefined,
        category || undefined,
        tag || undefined
      );
    } else {
      entries = await getAllEntries();
    }
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateEntryInput;
    
    // Validate required fields
    if (!body.title || !body.type || !body.category || !body.images || body.images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const entry = await createEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    );
  }
}
