import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fieldName = formData.get('fieldName') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!fieldName) {
      return NextResponse.json({ error: 'No field name provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed. Allowed: images, videos, audio.` },
        { status: 400 }
      );
    }

    // Max file size: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 50MB.` },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(ext, '');
    const filename = `${fieldName}_${timestamp}_${safeName}${ext}`;

    // Write file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
