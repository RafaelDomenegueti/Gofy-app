import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useContent } from "../../hooks/useContent";
import { ContentItem } from "./content";

export function ContentList() {
  const { contents } = useContent();
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = true;
  }, []);

  return (
    <View className="space-y-4">
      {[...contents].map((content, index) => (
        <Animated.View
          key={content.id}
          entering={!hasAnimated.current ? FadeInDown.delay(index * 200).springify() : undefined}
        >
          <ContentItem content={content} />
        </Animated.View>
      ))}
    </View>
  );
}
