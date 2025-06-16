import { Content } from "../useContent/types";

export interface PlayerState {
  isPlaying: boolean;
  currentContent: Content | null;
  progress: number;
  duration: number;
  currentTime: number;
  downloadedContent: string[];
  downloadingContent: string[];
  error: string | null;
}

export interface PlayerContextType {
  play: (content: Content) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  download: (content: Content) => Promise<void>;
  cancelDownload: (contentId: string) => Promise<void>;
  deleteDownloadedContent: (contentId: string) => Promise<void>;
  isDownloaded: (contentId: string) => Promise<boolean>;
  isDownloading: (contentId: string) => boolean;
  getGofyDownloadsDir: () => Promise<string>;
  currentContent: Content | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  downloadedContent: string[];
  downloadingContent: string[];
  error: string | null;
  setDownloadedContent: (contentId: string) => void;
}
