import { Content } from "../useContent/types";

export interface PlayerState {
  isPlaying: boolean;
  currentTrack: {
    url: string;
    title: string;
    artist: string;
  } | null;
  currentContent: Content | null;
  progress: number;
  duration: number;
  currentTime: number;
  downloadingContent: string[];
  downloadedContent: string[];
}

export interface PlayerContextType extends PlayerState {
  play: (content: Content) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  download: (content: Content) => Promise<void>;
  isDownloaded: (contentId: string) => Promise<boolean>;
  isDownloading: (contentId: string) => boolean;
}
