import { NextResponse } from 'next/server';
import { getLetters, saveLetter, deleteLetter } from '@/lib/storage';

export async function GET() {
  const letters = getLetters();
  return NextResponse.json({ letters });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.message || typeof body.message !== 'string' || body.message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const saved = saveLetter({
      author: body.author?.trim() || 'Anonymous Admirer',
      message: body.message.trim(),
    });

    return NextResponse.json({ success: true, letter: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Letter ID is required' }, { status: 400 });
    }

    const success = deleteLetter(id);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete letter' }, { status: 500 });
  }
}
