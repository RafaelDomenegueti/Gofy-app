import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View } from "react-native";
import { PlayerControls } from "../components/PlayerControls";
import { usePlayer } from "../hooks/usePlayer";
import { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function CustomTabBar() {
  const navigation = useNavigation<NavigationProp>();
  const { isPlaying, currentContent } = usePlayer();

  return (
    <View className="absolute bottom-0 w-full p-4">
      <View className="flex flex-row items-center justify-between w-full relative mb-3">
        {currentContent && <PlayerControls />}
      </View>

      {/* <View className="flex flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.navigate("HomeStack")}
          className="flex items-center justify-center gap-1"
        >
          <Home size={24} color="#3b82f6" />
          <Text className="text-xs text-primary">Início</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ContentFormStack")}
          className="flex items-center justify-center -mt-12"
        >
          <View className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Plus size={24} color="#fff" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          className="flex items-center justify-center gap-1"
        >
          <Settings size={24} color="#3b82f6" />
          <Text className="text-xs text-primary">Configurações</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
