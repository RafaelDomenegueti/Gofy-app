import { Coffee } from "lucide-react-native";
import { useEffect } from "react";
import { Linking, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native";
import { P } from "../../components/ui/typography";
import { useContent } from "../../hooks/useContent";
import { useColorScheme } from "../../lib/useColorScheme";
import { ContentList } from "./content-list";
import { EmptyState } from "./empty-state";

export const HomeScreen = () => {
  const { contents, isLoading, getAllPurchases } = useContent();
  const { colorScheme } = useColorScheme();

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
    >
      {isLoading ? (
        <View className="flex justify-center items-center py-20">
          <View className="animate-pulse flex items-center">
            <P className="text-muted-foreground dark:text-muted-dark-foreground text-center">Carregando seus conteúdos...</P>
          </View>
        </View>
      ) : contents.length === 0 ? (
        <EmptyState />
      ) : (
        <View className="p-4 flex flex-col gap-3">
          <View className="bg-primary/10 dark:bg-primary-dark/40 rounded-lg p-4 mb-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/20 dark:bg-primary-dark/20 p-2 rounded-full">
                <Coffee size={24} color="#6b7280" className="dark:text-gray-400" />
              </View>
              <View className="flex-1">
                <P className="font-medium text-foreground dark:text-foreground-dark">Ajude a manter o Gofy!</P>
                <P className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
                  Se você gosta do app, considere pagar um café para manter o desenvolvimento.
                </P>
              </View>
            </View>
            <TouchableOpacity
              className="mt-3 bg-primary dark:bg-primary-dark rounded-lg py-2 px-4 w-full items-center"
              onPress={() => Linking.openURL('https://nubank.com.br/pagar/1xq1r/9c9c9c9c-9c9c-9c9c-9c9c-9c9c9c9c9c9c')}
            >
              <P className="text-white font-medium">Pagar um café ☕</P>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <P className="text-muted-foreground dark:text-muted-dark-foreground mt-1">
              {contents.length} {contents.length === 1 ? 'conteúdo disponível' : 'conteúdos disponíveis'} para ouvir
            </P>
          </View>

          <ContentList />
        </View>
      )}
    </ScrollView>
  );
};
