import { Headphones, LogOut, Moon, Plus, Sun } from "lucide-react-native";
import React from "react";
import { Platform, SafeAreaView, StatusBar, TouchableOpacity, View } from "react-native";
import { Text } from "../components/ui/text";
import { useAuth } from "../hooks/useAuth";
import { useColorScheme } from "../lib/useColorScheme";

export const CustomHeader = ({ navigation }: any) => {
  const { setColorScheme, isDarkColorScheme } = useColorScheme();
  const { logout } = useAuth();

  // Calculate status bar height for Android
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

  return (
    <>
      <StatusBar
        barStyle={isDarkColorScheme ? "light-content" : "dark-content"}
        backgroundColor={isDarkColorScheme ? "#121212" : "#ffffff"}
      />
      <SafeAreaView className="dark:bg-background-dark bg-background">
        <View
          className={`flex flex-row w-full justify-between items-center p-4 px-5 bg-primary dark:bg-primary-dark ${Platform.OS === 'android' ? 'pt-10' : ''}`}
          style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
        >
          <View className="flex-row items-center gap-2">
            <Headphones
              size={24}
              color={"#fff"}
              className="mr-1"
            />
            <Text className="font-bold text-3xl text-white">
              Gofy
            </Text>
          </View>

          <View className="flex flex-row items-center gap-3">
            <TouchableOpacity
              className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              onPress={() => navigation.navigate("ContentFormStack")}
            >
              <Plus size={20} color={"#fff"} />
            </TouchableOpacity>

            <TouchableOpacity
              className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              onPress={() => setColorScheme(isDarkColorScheme ? "light" : "dark")}
            >
              {!isDarkColorScheme ? <Moon size={20} color={"#fff"} /> : <Sun size={20} color={"#fff"} />}
            </TouchableOpacity>

            <TouchableOpacity
              className="relative w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"
              onPress={() => logout()}
            >
              <LogOut size={18} color={isDarkColorScheme ? "#ef4444" : "#dc2626"} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
