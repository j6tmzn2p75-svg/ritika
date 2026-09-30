import { NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/storage';

export async function GET() {
  const config = getConfig();
  // Return config without revealing admin shortcut to public
  return NextResponse.json({
    recipientName: config.recipientName,
    normalPassword: config.normalPassword,
    cakeHeading: config.cakeHeading,
    cakeSubheading: config.cakeSubheading,
    romancePrompt: config.romancePrompt,
    letterHeading: config.letterHeading,
    cameraPhotoUrl: config.cameraPhotoUrl,
    cameraPhotoCaption: config.cameraPhotoCaption,
    videoUrl: config.videoUrl,
    videoCaption: config.videoCaption,
    giftPhotoUrl: config.giftPhotoUrl,
    giftPhotoCaption: config.giftPhotoCaption,
    theme: config.theme,
    musicEnabled: config.musicEnabled,
    backgroundTrackUrl: config.backgroundTrackUrl,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = saveConfig(body);
    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
  }
}
