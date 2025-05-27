import { LogOut, Moon, Plus, Sun } from "lucide-react-native";
import React from "react";
import { Platform, SafeAreaView, StatusBar, TouchableOpacity, View } from "react-native";
import { Logo } from "../components/logo";
import { useAuth } from "../hooks/useAuth";
import { useColorScheme } from "../lib/useColorScheme";

export const CustomHeader = ({ navigation }: any) => {
  const { setColorScheme, isDarkColorScheme } = useColorScheme();
  const { logout } = useAuth();

  return (
    <>
      <StatusBar
        barStyle={isDarkColorScheme ? "light-content" : "dark-content"}
        backgroundColor={isDarkColorScheme ? "#121212" : "#ffffff"}
      />
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
