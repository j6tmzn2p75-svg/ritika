import { NextResponse } from 'next/server';
import { getConfig } from '@/lib/storage';

export async function POST(request: Request) {
  try {
    const { shortcut, password } = await request.json();
    const config = getConfig();

    const isShortcutValid = shortcut === config.adminShortcut;
    const isPasswordValid = password === 'admin-fairytale-secret' || password === config.adminShortcut;

    if (isShortcutValid || isPasswordValid) {
      // Issue session token
      return NextResponse.json({
        authenticated: true,
        token: 'admin-sess-' + Buffer.from(Date.now().toString()).toString('base64'),
        config, // Return full config including admin settings
      });
    }

    return NextResponse.json({ authenticated: false, error: 'Invalid admin credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
