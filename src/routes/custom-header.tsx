import { useNetInfo } from "@react-native-community/netinfo";
import { t } from "i18next";
import { Moon, Plus, Sun } from "lucide-react-native";
import React from "react";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Logo } from "../components/logo";
import { useColorScheme } from "../lib/useColorScheme";

export const CustomHeader = ({ navigation }: any) => {
  const { setColorScheme, isDarkColorScheme } = useColorScheme();
  const { isConnected } = useNetInfo();

  return (
    <SafeAreaView className="dark:bg-background-dark bg-background">
      <View
        className={`flex flex-row w-full justify-between items-center p-4 px-5 bg-primary dark:bg-primary-dark`}
        style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
      >
        <Logo
          isWhite
          width={30}
          height={30}
          withText
        />

        <View className="flex flex-row items-center gap-3">
          <TouchableOpacity
            className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            onPress={() => setColorScheme(isDarkColorScheme ? "light" : "dark")}
          >
            {!isDarkColorScheme ? <Moon size={20} color={"#fff"} /> : <Sun size={20} color={"#fff"} />}
          </TouchableOpacity>

          <TouchableOpacity
            className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            onPress={() => {
              if (isConnected) {
                navigation.navigate("ContentFormStack")
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('toast.offline.title'),
                  text2: t('toast.offline.message'),
                });
              }
            }}
            activeOpacity={isConnected ? 1 : 0.2}
          >
            <Plus size={20} color={isConnected ? "#fff" : "#d7d7d7"} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
