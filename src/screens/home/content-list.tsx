import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useContent } from "../../hooks/useContent";
import { ContentItem } from "./content";

export function ContentList() {
  const { contents } = useContent();

  return (
    <View className="space-y-4">
      {[...contents].map((content, index) => (
        <Animated.View
          key={index}
          entering={FadeInDown.delay(index * 100).springify()}
        >
          <ContentItem content={content} />
        </Animated.View>
      ))}
    </View>
  );
}
