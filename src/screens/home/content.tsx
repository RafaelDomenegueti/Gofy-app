import { Clock, Download, Pause, Play, Tag, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../../components/ui/card";
import { H3 } from "../../components/ui/typography";
import { Content } from "../../hooks/useContent/types";
import { usePlayer } from "../../hooks/usePlayer";
import { useColorScheme } from "../../lib/useColorScheme";

interface IProps {
  content: Content;
}

export const ContentItem = ({ content }: IProps) => {
  const {
    isPlaying,
    currentContent,
    play,
    pause,
    resume,
    download,
    isDownloaded,
    isDownloading
  } = usePlayer();
  const { isDarkColorScheme } = useColorScheme();

  const [downloaded, setDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isCurrentContent = currentContent?.id === content.id;
  const isCurrentlyPlaying = isCurrentContent && isPlaying;
  const downloading = isDownloading(content.id);

  useEffect(() => {
    const checkDownloadStatus = async () => {
      try {
        setIsLoading(true);
        const isContentDownloaded = await isDownloaded(content.id);
        setDownloaded(isContentDownloaded);
      } catch (error) {
        console.error("Error checking download status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDownloadStatus();
  }, [content.id, downloading]);

  const handlePlayClick = async () => {
    if (!downloaded) {
      await download(content);
      return;
    }

    if (isCurrentContent) {
      if (isPlaying) {
        await pause();
      } else {
        await resume();
      }
    } else {
      await play(content);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderButton = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#5c5d8d" />;
    }

    if (downloading) {
      return <ActivityIndicator size="small" color="#5c5d8d" />;
    }

    if (!downloaded) {
      return <Download size={24} color="#5c5d8d" />;
    }

    if (isCurrentlyPlaying) {
      return <Pause size={24} color="white" />;
    }

    return <Play size={24} color={"#5c5d8d"} />;
  };

  return (
    <Card className="overflow-hidden card-gradient animate-fade-in mb-4">
      <View className="flex flex-row items-start p-4 gap-3">
        <TouchableOpacity
          className={`w-16 h-16 rounded ${isCurrentContent ? "border-2 border-primary/60" : "border border-primary/20"} ${isCurrentlyPlaying ? 'bg-primary dark:bg-primary-dark' : downloading ? 'bg-transparent' : 'bg-primary/10 dark:bg-primary-dark/10'} flex-shrink-0 overflow-hidden flex items-center justify-center`}
          onPress={handlePlayClick}
          disabled={downloading || isLoading}
          activeOpacity={0.9}
        >
          {renderButton()}
        </TouchableOpacity>

        <View className="flex-1 min-w-0">
          <H3 className="font-medium mb-1 line-clamp-1 text-foreground dark:text-foreground-dark">{content.title}</H3>

          <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground line-clamp-2 mb-2" numberOfLines={2}>
            {content.description}
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {content.author && (
              <View className="flex-row flex gap-1 items-center bg-muted/50 dark:bg-muted-dark/50 rounded-full px-2 py-1">
                <User size={12} className="mr-1 text-muted-foreground dark:text-muted-dark-foreground" color={isDarkColorScheme ? "#232336" : "#5c5d8d"} />
                <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{content.author}</Text>
              </View>
            )}

            <View className="flex-row flex gap-1 items-center bg-muted/50 dark:bg-muted-dark/50 rounded-full px-2 py-1">
              <Clock size={12} className="mr-1 text-muted-foreground dark:text-muted-dark-foreground" color={isDarkColorScheme ? "#232336" : "#5c5d8d"} />
              <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{formatDate(content.created_at)}</Text>
            </View>

            {content.tags && content.tags.length > 0 && (
              <View className="flex-row flex gap-1 items-center bg-muted/50 dark:bg-muted-dark/50 rounded-full px-2 py-1">
                <Tag size={12} className="mr-1 text-muted-foreground dark:text-muted-dark-foreground" color={isDarkColorScheme ? "#232336" : "#5c5d8d"} />
                <Text className="text-xs text-muted-foreground dark:text-white">{content.tags[0]}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  )
}
