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
  const [dragValue, setDragValue] = useState(0);

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
    setDragValue(progress);
  };

  const handleSlidingComplete = (value: number) => {
    setIsDragging(false);
    seekTo(value);
  };

  const handleValueChange = (value: number) => {
    setDragValue(value);
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
    <View className="absolute bottom-3 left-0 right-0 mx-4 bg-gray-200 dark:bg-gray-900 backdrop-blur-2xl rounded-3xl">
      {/* Tooltip */}
      {isDragging && (
        <View className="relative flex justify-center items-center">
          <View className="absolute -mt-14 bg-gray-800 dark:bg-gray-700 px-3 py-2 rounded-lg shadow-lg">
            <Text className="text-xs font-medium text-white text-center">
              {formatTime(dragValue)} / {formatTime(duration)}
            </Text>
            <View className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 dark:border-t-gray-700" />
          </View>
        </View>
      )}

      <Slider
        style={{ width: '100%', position: 'absolute', top: 0, height: 34, marginTop: -16, zIndex: 1000 }}
        minimumValue={0}
        maximumValue={duration}
        value={progress}
        onSlidingStart={handleSlidingStart}
        onSlidingComplete={handleSlidingComplete}
        onValueChange={handleValueChange}
        minimumTrackTintColor={isDarkColorScheme ? "#94a3b8" : "#5c5d8d"}
        maximumTrackTintColor={isDarkColorScheme ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}
        thumbTintColor={isDragging ? isDarkColorScheme ? "#94a3b8" : "#5c5d8d" : 'transparent'}
        tapToSeek={true}
      />

      <View className="px-4 py-3">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-800 flex items-center justify-center mr-3 shadow-sm shadow-primary/20">
            <Text className="text-lg font-bold text-primary dark:text-white">
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
            className="w-10 h-10 rounded-xl bg-primary dark:bg-primary-dark flex items-center justify-center shadow-lg shadow-primary/20"
          >
            {isPlaying ? (
              <Pause size={18} color={isDarkColorScheme ? "#94a3b8" : "#f9fafb"} />
            ) : (
              <Play size={18} color={isDarkColorScheme ? "#94a3b8" : "#f9fafb"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
