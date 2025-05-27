import Slider from '@react-native-community/slider';
import { Pause, Play } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { usePlayer } from "../hooks/usePlayer";
import { useColorScheme } from '../lib/useColorScheme';

export const PlayerControls = () => {
  const {
    isPlaying,
    currentContent,
    progress,
    duration,
    pause,
    resume,
    seekTo
  } = usePlayer();
  const { isDarkColorScheme } = useColorScheme()

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
    <View className="fixed bottom-0 left-0 right-0 px-4 py-3 pb-6 bg-gray-100/90 dark:bg-background-dark/95 backdrop-blur-xl shadow-2xl border-t border-white/5">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary-dark/70 flex items-center justify-center mr-3">
          <Text className="text-base font-bold text-primary dark:text-white">
            {currentContent.title.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1 mr-3">
          <Text className="font-medium text-sm text-foreground dark:text-foreground-dark line-clamp-1">
            {currentContent.title}
          </Text>
          <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
            {currentContent.author}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlayPause}
          className="w-10 h-10 rounded-full bg-primary dark:bg-primary-dark flex items-center justify-center shadow-lg shadow-primary/20"
        >
          {isPlaying ? (
            <Pause size={18} color="white" />
          ) : (
            <Play size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mt-3">
        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground mr-2">
          {formatTime(progress)}
        </Text>

        <View className="flex-1">
          <Slider
            style={{ width: '100%', height: 24 }}
            minimumValue={0}
            maximumValue={duration}
            value={progress}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor={isDarkColorScheme ? "#f9fafb" : "#5c5d8d"}
            maximumTrackTintColor={isDarkColorScheme ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}
            thumbTintColor={isDarkColorScheme ? "#f9fafb" : "#5c5d8d"}
            tapToSeek={true}
          />
        </View>

        <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground ml-2">
          {formatTime(duration)}
        </Text>
      </View>
    </View>
  );
};
