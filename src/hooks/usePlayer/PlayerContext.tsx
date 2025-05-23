import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import RNFS from 'react-native-fs';
import TrackPlayer, { Event, State, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { Content } from "../useContent/types";
import { PlayerContextType, PlayerState } from "./types";

// Constants for file management
const GOFY_DOWNLOADS_KEY = '@gofy/downloads';

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTrack: null,
    currentContent: null,
    progress: 0,
    duration: 0,
    currentTime: 0,
    downloadingContent: [],
    downloadedContent: []
  });

  const activeDownloads = useRef<Record<string, RNFS.DownloadProgressCallbackResult>>({});
  const downloadJobIds = useRef<Record<string, number>>({});

  const { position, duration } = useProgress();

  useEffect(() => {
    setPlayerState(prev => ({
      ...prev,
      progress: position,
      duration,
      currentTime: position
    }));
  }, [position, duration]);

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      setPlayerState(prev => ({
        ...prev,
        isPlaying: state === State.Playing,
      }));
    }
  });

  const safeUpdateStorage = useCallback(async (key: string, value: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to update ${key}:`, error);
    }
  }, []);

  const getGofyDownloadsDir = useCallback(() => {
    return Platform.OS === 'ios'
      ? `${RNFS.DocumentDirectoryPath}/gofy_downloads/`
      : `${RNFS.DownloadDirectoryPath}/gofy_downloads/`;
  }, []);

  useEffect(() => {
    const loadDownloadedContent = async () => {
      try {
        const dir = getGofyDownloadsDir();
        const exists = await RNFS.exists(dir);
        if (!exists) {
          await RNFS.mkdir(dir);
        }

        const downloadedContent = await AsyncStorage.getItem(GOFY_DOWNLOADS_KEY);

        setPlayerState(prev => ({
          ...prev,
          downloadedContent: downloadedContent ? JSON.parse(downloadedContent) : []
        }));

        if (downloadedContent) {
          const contentIds = JSON.parse(downloadedContent) as string[];
          await verifyDownloadedFiles(contentIds);
        }
      } catch (error) {
        console.error("Failed to load downloaded content", error);
      }
    };

    loadDownloadedContent();
  }, [getGofyDownloadsDir]);

  const verifyDownloadedFiles = async (contentIds: string[]) => {
    try {
      const dir = getGofyDownloadsDir();
      const files = await RNFS.readDir(dir);
      const fileNames = files.map(file => file.name);

      const validDownloadedContent = contentIds.filter(id =>
        fileNames.some((filename: string) => filename.includes(`content_${id}`))
      );

      if (validDownloadedContent.length !== contentIds.length) {
        setPlayerState(prev => ({
          ...prev,
          downloadedContent: validDownloadedContent
        }));

        await AsyncStorage.setItem(GOFY_DOWNLOADS_KEY, JSON.stringify(validDownloadedContent));
      }
    } catch (error) {
      console.warn("Error verifying downloaded files:", error);
    }
  };

  const isDownloaded = useCallback(async (contentId: string): Promise<boolean> => {
    if (!contentId) return false;

    try {
      const isTracked = playerState.downloadedContent.includes(contentId);
      if (!isTracked) return false;

      const filepath = `${getGofyDownloadsDir()}content_${contentId}.mp3`;
      const exists = await RNFS.exists(filepath);

      if (!exists) {
        const updatedDownloadedContent = playerState.downloadedContent.filter(id => id !== contentId);
        await safeUpdateStorage(GOFY_DOWNLOADS_KEY, updatedDownloadedContent);
        setPlayerState(prev => ({
          ...prev,
          downloadedContent: updatedDownloadedContent
        }));
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, [playerState.downloadedContent, getGofyDownloadsDir, safeUpdateStorage]);

  const isDownloading = useCallback((contentId: string): boolean => {
    return playerState.downloadingContent.includes(contentId);
  }, [playerState.downloadingContent]);

  const play = useCallback(async (content: Content): Promise<void> => {
    if (!content?.id) {
      throw new Error("Invalid content for playback");
    }

    try {
      const isContentDownloaded = await isDownloaded(content.id);
      if (!isContentDownloaded) {
        throw new Error("Content not downloaded yet. Please download first.");
      }

      const state = await TrackPlayer.getState();
      if (state !== State.Stopped) {
        await TrackPlayer.reset();
      }

      const filePath = `${getGofyDownloadsDir()}content_${content.id}.mp3`;

      if (!(await RNFS.exists(filePath))) {
        throw new Error(`File not found at path: ${filePath}`);
      }

      const fileInfo = await RNFS.stat(filePath);
      if (fileInfo.size === 0) {
        throw new Error("File is empty");
      }

      const track = {
        url: filePath,
        title: content.title || "Unknown Title",
        artist: content.author || "Unknown Artist",
      };

      await TrackPlayer.add(track);
      await TrackPlayer.play();

      setPlayerState(prev => ({
        ...prev,
        currentTrack: track,
        currentContent: content,
        isPlaying: true,
      }));
    } catch (error) {
      throw error;
    }
  }, [isDownloaded, getGofyDownloadsDir]);

  const pause = useCallback(async (): Promise<void> => {
    try {
      await TrackPlayer.pause();
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  }, []);

  const resume = useCallback(async (): Promise<void> => {
    try {
      await TrackPlayer.play();
      setPlayerState(prev => ({
        ...prev,
        isPlaying: true,
      }));
    } catch (error) {
      console.error("Error resuming track:", error);
    }
  }, []);

  const stop = useCallback(async (): Promise<void> => {
    try {
      await TrackPlayer.reset();
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false,
        currentTrack: null,
        currentContent: null,
        progress: 0,
        duration: 0,
        currentTime: 0,
      }));
    } catch (error) {
      console.error("Error stopping track:", error);
    }
  }, []);

  const seekTo = useCallback(async (position: number): Promise<void> => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error("Error seeking track:", error);
    }
  }, []);

  const cancelDownload = useCallback(async (contentId: string): Promise<void> => {
    try {
      const jobId = downloadJobIds.current[contentId];
      if (jobId) {
        await RNFS.stopDownload(jobId);
        delete downloadJobIds.current[contentId];
        delete activeDownloads.current[contentId];

        setPlayerState(prev => ({
          ...prev,
          downloadingContent: prev.downloadingContent.filter(id => id !== contentId)
        }));
      }
    } catch (error) {
      console.warn("Error canceling download:", error);
    }
  }, []);

  const download = useCallback(async (content: Content): Promise<void> => {
    if (!content?.id || !content?.url) {
      throw new Error("Invalid content for download");
    }

    const contentId = content.id;
    const downloadUrl = content.url;
    const localFilePath = `${getGofyDownloadsDir()}content_${contentId}.mp3`;

    try {
      if (downloadJobIds.current[contentId]) {
        await cancelDownload(contentId);
      }

      // Ensure download directory exists
      const dir = getGofyDownloadsDir();
      if (!(await RNFS.exists(dir))) {
        await RNFS.mkdir(dir);
      }

      // Clean up existing file if any
      if (await RNFS.exists(localFilePath)) {
        await RNFS.unlink(localFilePath);
      }

      // Set downloading state
      setPlayerState(prev => ({
        ...prev,
        downloadingContent: [...prev.downloadingContent, contentId]
      }));

      const options = {
        fromUrl: downloadUrl,
        toFile: localFilePath,
        background: true,
        discretionary: true,
        headers: {
          'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'identity',
          'Range': 'bytes=0-',
        },
      };

      const downloadResult = RNFS.downloadFile(options);
      downloadJobIds.current[contentId] = downloadResult.jobId;

      const result = await downloadResult.promise;
      delete downloadJobIds.current[contentId];
      delete activeDownloads.current[contentId];

      if (result.statusCode !== 200 && result.statusCode !== 206) {
        throw new Error(`Download failed with status code: ${result.statusCode}`);
      }

      // Verify downloaded file
      if (!(await RNFS.exists(localFilePath))) {
        throw new Error("Download completed but file not found");
      }

      const fileInfo = await RNFS.stat(localFilePath);
      if (fileInfo.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      // Update state and storage
      const updatedDownloadedContent = [...playerState.downloadedContent, contentId];
      await safeUpdateStorage(GOFY_DOWNLOADS_KEY, updatedDownloadedContent);

      setPlayerState(prev => ({
        ...prev,
        downloadedContent: updatedDownloadedContent,
        downloadingContent: prev.downloadingContent.filter(id => id !== contentId)
      }));

    } catch (error) {
      // Cleanup on error
      try {
        if (await RNFS.exists(localFilePath)) {
          await RNFS.unlink(localFilePath);
        }
      } catch {
        // Ignore cleanup errors
      }

      delete downloadJobIds.current[contentId];
      delete activeDownloads.current[contentId];

      setPlayerState(prev => ({
        ...prev,
        downloadingContent: prev.downloadingContent.filter(id => id !== contentId)
      }));

      throw error;
    }
  }, [getGofyDownloadsDir, playerState.downloadedContent, safeUpdateStorage, cancelDownload]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...playerState,
    play,
    pause,
    resume,
    stop,
    seekTo,
    download,
    isDownloaded,
    isDownloading
  }), [
    playerState,
    play,
    pause,
    resume,
    stop,
    seekTo,
    download,
    isDownloaded,
    isDownloading
  ]);

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};
