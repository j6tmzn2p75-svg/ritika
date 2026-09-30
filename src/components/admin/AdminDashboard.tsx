'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Save,
  Trash2,
  Download,
  Music,
  ImageIcon,
  Video,
  FileText,
  User,
  Key,
  Sparkles,
  CheckCircle2,
  Upload,
  Loader2,
  Camera,
  Film,
  Gift,
} from 'lucide-react';
import { AppConfig, BirthdayLetter } from '@/types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onConfigUpdated: (newConfig: AppConfig) => void;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'media' | 'letters'>('content');
  const [formConfig, setFormConfig] = useState<AppConfig>(config);
  const [letters, setLetters] = useState<BirthdayLetter[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Upload states for each media field
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});

  // File input refs
  const cameraPhotoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const giftPhotoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormConfig(config);
  }, [config]);

  // Load letters from API
  useEffect(() => {
    if (isOpen) {
      fetch('/api/letters')
        .then((res) => res.json())
        .then((data) => {
          if (data.letters) setLetters(data.letters);
        })
        .catch((err) => console.error('Error fetching letters:', err));
    }
  }, [isOpen]);

  // File upload handler
  const handleFileUpload = async (
    file: File,
    fieldName: string,
    configKey: keyof AppConfig
  ) => {
    setUploadStates((prev) => ({
      ...prev,
      [fieldName]: { isUploading: true, progress: 0, error: null },
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldName', fieldName);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      // Update config with the new URL
      setFormConfig((prev) => ({
        ...prev,
        [configKey]: data.url,
      }));

      setUploadStates((prev) => ({
        ...prev,
        [fieldName]: { isUploading: false, progress: 100, error: null },
      }));

      // Clear success state after 3s
      setTimeout(() => {
        setUploadStates((prev) => ({
          ...prev,
          [fieldName]: { isUploading: false, progress: 0, error: null },
        }));
      }, 3000);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Upload failed';
      setUploadStates((prev) => ({
        ...prev,
        [fieldName]: { isUploading: false, progress: 0, error: errorMsg },
      }));
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formConfig),
      });
      const data = await res.json();
      if (data.success && data.config) {
        onConfigUpdated(data.config);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error('Failed to save config:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLetter = async (id: string) => {
    try {
      const res = await fetch(`/api/letters?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setLetters((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete letter:', e);
    }
  };

  const handleExportLetters = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(letters, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(formConfig.recipientName || 'ritika').toLowerCase()}-birthday-letters-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reusable media upload section component
  const MediaUploadField = ({
    label,
    icon: Icon,
    fieldName,
    configKey,
    captionKey,
    urlValue,
    captionValue,
    accept,
    inputRef,
    previewType = 'image',
  }: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    fieldName: string;
    configKey: keyof AppConfig;
    captionKey: keyof AppConfig;
    urlValue: string;
    captionValue: string;
    accept: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    previewType?: 'image' | 'video' | 'audio';
  }) => {
    const uploadState = uploadStates[fieldName] || { isUploading: false, progress: 0, error: null };

    return (
      <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-4 h-4 text-amber-400" />
          <label className="text-xs font-semibold text-pink-200 uppercase tracking-wider">
            {label}
          </label>
        </div>

        {/* Preview */}
        {urlValue && (
          <div className="relative mb-3 rounded-xl overflow-hidden border border-pink-500/30 bg-black/40">
            {previewType === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlValue}
                alt={label}
                className="w-full h-32 object-cover"
              />
            )}
            {previewType === 'video' && (
              <video
                src={urlValue}
                className="w-full h-32 object-cover"
                muted
                playsInline
              />
            )}
            {previewType === 'audio' && (
              <div className="flex items-center justify-center h-16 bg-pink-950/50">
                <Music className="w-6 h-6 text-pink-300" />
                <span className="ml-2 text-xs text-pink-200">Audio loaded</span>
              </div>
            )}
          </div>
        )}

        {/* Upload Button + URL Input */}
        <div className="flex items-center gap-2 mb-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file, fieldName, configKey);
              // Reset input so same file can be re-selected
              if (inputRef.current) inputRef.current.value = '';
            }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploadState.isUploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-400/40 text-amber-200 text-xs font-serif-display uppercase tracking-wider hover:from-amber-500/30 hover:to-pink-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait shrink-0"
          >
            {uploadState.isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : uploadState.progress === 100 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uploaded!</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </>
            )}
          </button>
          <span className="text-[10px] text-pink-300/50">or paste URL below</span>
        </div>

        {/* Upload Error */}
        {uploadState.error && (
          <p className="text-[11px] text-rose-400 mb-2 flex items-center gap-1">
            <X className="w-3 h-3" />
            {uploadState.error}
          </p>
        )}

        {/* URL Input */}
        <input
          type="text"
          placeholder={`Paste ${label.toLowerCase()} URL...`}
          value={urlValue}
          onChange={(e) => setFormConfig({ ...formConfig, [configKey]: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
        />

        {/* Caption Input */}
        <input
          type="text"
          placeholder="Caption..."
          value={captionValue}
          onChange={(e) => setFormConfig({ ...formConfig, [captionKey]: e.target.value })}
          className="w-full mt-2 px-4 py-2 rounded-xl bg-black/40 border border-pink-500/20 text-xs text-pink-200 focus:outline-none focus:border-pink-400"
        />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl h-[90vh] glass-panel-gold rounded-3xl border-2 border-amber-300/50 shadow-[0_0_60px_rgba(255,209,102,0.3)] flex flex-col overflow-hidden text-slate-100"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-300/30 bg-[#1f0a17]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-amber-300">
              <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <h2 className="font-serif-display text-lg sm:text-xl font-bold text-amber-100 tracking-wide flex items-center gap-2">
                Secret Admin Command Center
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-900/60 border border-pink-400/40 text-pink-300">
                  CODE: 7410
                </span>
              </h2>
              <p className="text-xs text-amber-200/60">
                Customize {formConfig.recipientName || 'Ritika'}&apos;s fairytale birthday experience in real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-pink-950/60 border border-pink-400/30 text-pink-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-pink-900/40 bg-[#160410]/50">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-serif-display uppercase tracking-wider transition-colors border-t border-x ${
              activeTab === 'content'
                ? 'bg-[#290a1f] border-pink-400/60 text-pink-100 font-semibold'
                : 'border-transparent text-pink-300/60 hover:text-pink-200'
            }`}
          >
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Content & Text</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-serif-display uppercase tracking-wider transition-colors border-t border-x ${
              activeTab === 'media'
                ? 'bg-[#290a1f] border-pink-400/60 text-pink-100 font-semibold'
                : 'border-transparent text-pink-300/60 hover:text-pink-200'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Media Upload</span>
          </button>

          <button
            onClick={() => setActiveTab('letters')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-serif-display uppercase tracking-wider transition-colors border-t border-x ${
              activeTab === 'letters'
                ? 'bg-[#290a1f] border-pink-400/60 text-pink-100 font-semibold'
                : 'border-transparent text-pink-300/60 hover:text-pink-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Received Letters ({letters.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    value={formConfig.recipientName}
                    onChange={(e) => setFormConfig({ ...formConfig, recipientName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
                    Normal Password (Default: 0210)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formConfig.normalPassword}
                    onChange={(e) => setFormConfig({ ...formConfig, normalPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm font-mono tracking-widest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
                  Fairytale Romance Prompt
                </label>
                <input
                  type="text"
                  value={formConfig.romancePrompt}
                  onChange={(e) => setFormConfig({ ...formConfig, romancePrompt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
                    Birthday Heading Line 1
                  </label>
                  <input
                    type="text"
                    value={formConfig.cakeHeading}
                    onChange={(e) => setFormConfig({ ...formConfig, cakeHeading: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
                    Birthday Heading Line 2
                  </label>
                  <input
                    type="text"
                    value={formConfig.cakeSubheading}
                    onChange={(e) => setFormConfig({ ...formConfig, cakeSubheading: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 uppercase tracking-wider mb-1">
                  Letter Pad Header Text
                </label>
                <input
                  type="text"
                  value={formConfig.letterHeading}
                  onChange={(e) => setFormConfig({ ...formConfig, letterHeading: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA UPLOAD */}
          {activeTab === 'media' && (
            <div className="space-y-5 max-w-2xl">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-amber-500/20">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-serif-display font-semibold text-amber-100 uppercase tracking-wider">
                    Media & File Upload Center
                  </h3>
                  <p className="text-[11px] text-amber-200/50">
                    Upload photos, videos, and audio directly. Files are saved to the server.
                  </p>
                </div>
              </div>

              {/* Camera Photo */}
              <MediaUploadField
                label="Vintage Camera Photo"
                icon={Camera}
                fieldName="cameraPhoto"
                configKey="cameraPhotoUrl"
                captionKey="cameraPhotoCaption"
                urlValue={formConfig.cameraPhotoUrl}
                captionValue={formConfig.cameraPhotoCaption}
                accept="image/*"
                inputRef={cameraPhotoInputRef}
                previewType="image"
              />

              {/* Cinema Video */}
              <MediaUploadField
                label="Cinema Video (MP4 / WebM)"
                icon={Film}
                fieldName="cinemaVideo"
                configKey="videoUrl"
                captionKey="videoCaption"
                urlValue={formConfig.videoUrl}
                captionValue={formConfig.videoCaption}
                accept="video/mp4,video/webm,video/quicktime"
                inputRef={videoInputRef}
                previewType="video"
              />

              {/* Gift Photo */}
              <MediaUploadField
                label="Secret Gift Framed Picture"
                icon={Gift}
                fieldName="giftPhoto"
                configKey="giftPhotoUrl"
                captionKey="giftPhotoCaption"
                urlValue={formConfig.giftPhotoUrl}
                captionValue={formConfig.giftPhotoCaption}
                accept="image/*"
                inputRef={giftPhotoInputRef}
                previewType="image"
              />

              {/* Background Audio */}
              <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Music className="w-4 h-4 text-amber-400" />
                  <label className="text-xs font-semibold text-pink-200 uppercase tracking-wider">
                    Custom Background Audio (Optional)
                  </label>
                </div>

                {formConfig.backgroundTrackUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden border border-pink-500/30 bg-black/40 p-3">
                    <audio controls className="w-full h-8" style={{ filter: 'invert(0.85) hue-rotate(180deg)' }}>
                      <source src={formConfig.backgroundTrackUrl} />
                    </audio>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'backgroundAudio', 'backgroundTrackUrl' as keyof AppConfig);
                      if (audioInputRef.current) audioInputRef.current.value = '';
                    }}
                  />
                  <button
                    onClick={() => audioInputRef.current?.click()}
                    disabled={uploadStates['backgroundAudio']?.isUploading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-400/40 text-amber-200 text-xs font-serif-display uppercase tracking-wider hover:from-amber-500/30 hover:to-pink-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait shrink-0"
                  >
                    {uploadStates['backgroundAudio']?.isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : uploadStates['backgroundAudio']?.progress === 100 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Uploaded!</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Audio</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-pink-300/50">or paste URL below</span>
                </div>

                <input
                  type="text"
                  placeholder="https://example.com/fairytale-theme.mp3"
                  value={formConfig.backgroundTrackUrl || ''}
                  onChange={(e) => setFormConfig({ ...formConfig, backgroundTrackUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 3: LETTERS */}
          {activeTab === 'letters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pink-900/40">
                <span className="text-xs text-pink-300 font-serif-display uppercase tracking-widest">
                  Total Saved Letters: {letters.length}
                </span>

                <button
                  onClick={handleExportLetters}
                  className="px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs flex items-center gap-1.5 hover:bg-amber-400/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {letters.map((letter) => (
                  <div
                    key={letter.id}
                    className="p-4 rounded-xl glass-panel border border-pink-500/30 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif-display font-bold text-pink-200 text-sm">
                          {letter.author || 'Anonymous'}
                        </span>
                        <span className="text-[10px] text-pink-400/60 font-mono">
                          {new Date(letter.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-handwriting text-xl text-pink-100/90 leading-relaxed whitespace-pre-wrap">
                        {letter.message}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteLetter(letter.id)}
                      className="p-2 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors cursor-pointer"
                      title="Delete letter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {letters.length === 0 && (
                  <p className="text-center py-10 text-pink-300/60 text-sm">
                    No letters submitted yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-amber-300/30 bg-[#1a0715]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-pink-500/30 text-xs font-serif-display uppercase tracking-widest text-pink-300 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-pink-600 text-white font-serif-display font-semibold uppercase tracking-wider text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50 hover:scale-105 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
