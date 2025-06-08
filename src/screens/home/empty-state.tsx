import { useNavigation } from "@react-navigation/native";
import { Headphones, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button } from "../../components/ui/button";
import { Text } from "../../components/ui/text";
import { H2, P } from "../../components/ui/typography";

export function EmptyState() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  return (
    <View className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-8"
      >
        <View className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
          <Headphones className="h-12 w-12" color="#fff" />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400).springify()} className="flex flex-col items-center justify-center">
        <H2 className="text-3xl font-bold mb-4 text-primary text-center">
          {t('home.noContent')}
        </H2>

        <P className="text-muted-foreground mb-8 max-w-xs text-center leading-relaxed text-base">
          {t('home.noContentDescription')}
        </P>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600).springify()}>
        <Button
          className="gap-3 py-6 px-8 rounded-xl shadow-lg shadow-primary/20 bg-primary"
          onPress={() => navigation.navigate("ContentFormStack")}
        >
          <View className="flex flex-row items-center justify-center gap-2">
            <Plus size={20} color={"#fff"} />
            <Text className="text-white font-semibold text-base">{t('home.addNewContent')}</Text>
          </View>
        </Button>
      </Animated.View>
    </View>
  );
}
