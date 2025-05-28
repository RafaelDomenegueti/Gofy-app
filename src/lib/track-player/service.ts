import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, { Event, State } from 'react-native-track-player';

const PROGRESS_KEY = '@gofy/progress';

const saveProgress = async (contentId: string, position: number) => {
  try {
    const progressData = await AsyncStorage.getItem(PROGRESS_KEY);
    const progress = progressData ? JSON.parse(progressData) : {};

    progress[contentId] = position;

    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn("Failed to save progress:", error);
  }
};

module.exports = async function() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => TrackPlayer.seekTo(event.position));

  TrackPlayer.addEventListener(Event.PlaybackState, async (event) => {
    if (event.state === State.Paused || event.state === State.Stopped) {
      const trackIndex = await TrackPlayer.getCurrentTrack();
      if (trackIndex !== null) {
        const track = await TrackPlayer.getTrack(trackIndex);
        if (track) {
          const position = await TrackPlayer.getPosition();
          const contentId = track.id?.toString();
          if (contentId) {
            await saveProgress(contentId, position);
          }
        }
      }
    }
  });

  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
    if (event.nextTrack) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      if (track) {
        const contentId = track.id?.toString();
        if (contentId) {
          const position = await TrackPlayer.getPosition();
          await saveProgress(contentId, position);
        }
      }
    }
  });
};
