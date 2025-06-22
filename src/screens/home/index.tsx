import { Coffee } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Linking, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { P } from "../../components/ui/typography";
import { useContent } from "../../hooks/useContent";
import { usePlayer } from "../../hooks/usePlayer";
import { useColorScheme } from "../../lib/useColorScheme";
import { BUY_COFFEE_URL } from "../../utils/constants";
import { ContentList } from "./content-list";
import { EmptyState } from "./empty-state";

export const HomeScreen = () => {
  const { contents, isLoading, getAllPurchases } = useContent();
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const { isPlaying } = usePlayer();

  useEffect(() => {
    getAllPurchases();
  }, []);

  const handleRefresh = () => {
    getAllPurchases();
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} colors={['#5c5d8d']} progressBackgroundColor={colorScheme === 'dark' ? '#000' : '#fff'} />
      }
      contentContainerStyle={{ paddingBottom: isPlaying ? 100 : 0 }}
    >
      {isLoading ? (
        <View className="flex justify-center items-center py-20">
          <View className="animate-pulse flex items-center">
            <P className="text-muted-foreground dark:text-muted-dark-foreground text-center">{t('home.loading')}</P>
          </View>
        </View>
      ) : contents.length === 0 ? (
        <EmptyState />
      ) : (
        <View key={contents.length + 1} className="p-4 flex flex-col gap-3">
          <Animated.View
            entering={FadeInUp.springify()}
            className="bg-primary/10 dark:bg-primary-dark/40 rounded-lg p-4 mb-4"
          >
            <View className="flex-row items-center gap-3">
              <Animated.View
                className="bg-primary/20 dark:bg-primary-dark/20 p-2 rounded-full"
                entering={FadeInUp.delay(200).springify()}
              >
                <Animated.View
                  entering={FadeInUp.delay(300).springify()}
                >
                  <Coffee size={24} color="#6b7280" className="dark:text-gray-400" />
                </Animated.View>
              </Animated.View>
              <View className="flex-1">
                <P className="font-medium text-foreground dark:text-foreground-dark">{t('home.helpKeepGofy')}</P>
                <P className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
                  {t('home.helpKeepGofyDescription')}
                </P>
              </View>
            </View>
            <TouchableOpacity
              className="mt-3 bg-primary dark:bg-primary-dark rounded-lg py-2 px-4 w-full items-center"
              onPress={() => Linking.openURL(BUY_COFFEE_URL)}
            >
              <P className="text-white font-medium">{t('home.buyCoffee')}</P>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            className="mb-2"
          >
            <P className="text-muted-foreground dark:text-muted-dark-foreground mt-1">
              {t(contents.length === 1 ? 'home.contentAvailable' : 'home.contentsAvailable', { count: contents.length })}
            </P>
          </Animated.View>

          <ContentList />
        </View>
      )}
    </ScrollView>
  );
};
