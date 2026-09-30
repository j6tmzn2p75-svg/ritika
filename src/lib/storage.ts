import fs from 'fs';
import path from 'path';
import { AppConfig, BirthdayLetter } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const LETTERS_FILE = path.join(DATA_DIR, 'letters.json');

export const DEFAULT_CONFIG: AppConfig = {
  recipientName: 'Ritika',
  normalPassword: '0210',
  adminShortcut: '7410',
  cakeHeading: 'HAPPY BIRTHDAY',
  cakeSubheading: 'RITIKA',
  romancePrompt: 'I have made something special for you! Wanna see?',
  letterHeading: 'Write something for Ritika ❤️',
  cameraPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
  cameraPhotoCaption: 'Radiant smile on an enchanted evening ✨',
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-flying-fireflies-and-stars-41551-large.mp4',
  videoCaption: 'Our endless magical memories under the stars 🎥',
  giftPhotoUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80',
  giftPhotoCaption: 'A treasured gift wrapped in eternal love 🎁',
  theme: {
    primaryColor: '#ff2e93',
    accentColor: '#ffb3d9',
    ambientGlow: '#800020',
  },
  musicEnabled: true,
  backgroundTrackUrl: '',
};

export const DEFAULT_LETTERS: BirthdayLetter[] = [
  {
    id: 'sample-1',
    author: 'Someone who adores you',
    message: 'To the most radiant, wonderful person in the universe: Happy Birthday Ritika! May this new chapter bring you endless joy, love, magic, and every dream you have ever wished upon a lantern.',
    timestamp: new Date().toISOString(),
    read: true,
  },
  {
    id: 'sample-2',
    author: 'A secret admirer',
    message: 'Happy Birthday Ritika! Seeing your smile lights up even the darkest skies like a thousand floating lanterns. Stay as beautiful, kind, and inspiring as you are.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getConfig(): AppConfig {
  ensureDataDir();
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
      return DEFAULT_CONFIG;
    }
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (error) {
    console.error('Error reading config:', error);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: Partial<AppConfig>): AppConfig {
  ensureDataDir();
  try {
    const current = getConfig();
    const updated = { ...current, ...config };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
}

export function getLetters(): BirthdayLetter[] {
  ensureDataDir();
  try {
    if (!fs.existsSync(LETTERS_FILE)) {
      fs.writeFileSync(LETTERS_FILE, JSON.stringify(DEFAULT_LETTERS, null, 2), 'utf-8');
      return DEFAULT_LETTERS;
    }
    const data = fs.readFileSync(LETTERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading letters:', error);
    return DEFAULT_LETTERS;
  }
}

export function saveLetter(letter: Omit<BirthdayLetter, 'id' | 'timestamp'>): BirthdayLetter {
  ensureDataDir();
  try {
    const letters = getLetters();
    const newLetter: BirthdayLetter = {
      ...letter,
      id: 'letter-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
    };
    letters.unshift(newLetter);
    fs.writeFileSync(LETTERS_FILE, JSON.stringify(letters, null, 2), 'utf-8');
    return newLetter;
  } catch (error) {
    console.error('Error saving letter:', error);
    throw error;
  }
}

export function deleteLetter(id: string): boolean {
  ensureDataDir();
  try {
    const letters = getLetters();
    const filtered = letters.filter(l => l.id !== id);
    fs.writeFileSync(LETTERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error deleting letter:', error);
    return false;
  }
}
