import Slider from '@react-native-community/slider';
import { Pause, Play } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { usePlayer } from "../hooks/usePlayer";

export const PlayerControls = () => {
  const {
    isPlaying,
    currentContent,
    progress,
    duration,
    play,
    pause,
    resume,
    seekTo
  } = usePlayer();

  const [isDragging, setIsDragging] = useState(false);

  const handlePlayPause = () => {
    if (!currentContent) return;

    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleSlidingStart = () => {
    setIsDragging(true);
  };

  const handleSlidingComplete = (value: number) => {
    setIsDragging(false);
    seekTo(value);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentContent) {
    return null;
  }

  return (
    <View className="px-4 py-3 bg-secondary dark:bg-secondary-dark backdrop-blur-md w-full rounded-xl shadow-lg">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-1 mr-4">
          <Text className="font-semibold text-sm line-clamp-1 text-white">
            {currentContent.title}
          </Text>
          <Text className="text-xs text-white/80">
            {currentContent.author}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handlePlayPause}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-row shadow-lg shadow-primary/30 mr-2"
        >
          {isPlaying ? (
            <Pause size={20} color="white" />
          ) : (
            <Play size={20} color="white" />
          )}
        </TouchableOpacity>

        <Text className="text-xs text-white/80">
          {formatTime(progress)}
        </Text>

        <View className="flex-1 mx-2">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={progress}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor="#f9fafb"
            maximumTrackTintColor="rgba(255, 255, 255, 0.2)"
            thumbTintColor="#f9fafb"
            tapToSeek={true}
          />
        </View>

        <Text className="text-xs text-white/80">
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};
