export interface AppConfig {
  recipientName: string;
  normalPassword: string;
  adminShortcut: string;
  cakeHeading: string;
  cakeSubheading: string;
  romancePrompt: string;
  letterHeading: string;
  cameraPhotoUrl: string;
  cameraPhotoCaption: string;
  videoUrl: string;
  videoCaption: string;
  giftPhotoUrl: string;
  giftPhotoCaption: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    ambientGlow: string;
  };
  musicEnabled: boolean;
  backgroundTrackUrl?: string;
}

export interface BirthdayLetter {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  sessionToken?: string;
  read?: boolean;
}
