import React from "react";
import { View } from "react-native";
import { useContent } from "../../hooks/useContent";
import { ContentItem } from "./content";

export function ContentList() {
  const { contents } = useContent();

  return (
    <View className="space-y-4">
      {[...contents].map((content, index) => (
        <ContentItem key={index} content={content} />
      ))}
    </View>
  );
}
