import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"
import { Logo } from "../../components/logo"
import { P } from "../../components/ui/typography"
import { useColorScheme } from '../../lib/useColorScheme'
import { RootStackParamList } from "../../types/navigation"
import { LoginForm } from "./form"

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>()
  const { colorScheme } = useColorScheme()

  const toggleForm = () => {
    navigation.navigate('Register')
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 flex flex-col items-center justify-center p-4">
          <View className="w-full max-w-md mb-8 space-y-6">
            <View className="flex items-center justify-center">
              <View className="mb-5 rounded-2xl items-center justify-center flex flex-row gap-3">
                <Logo
                  width={80}
                  height={80}
                  withText
                  textStyle="text-6xl text-primary dark:text-muted-dark-foreground"
                />
              </View>
              <P className="text-center text-muted-foreground dark:text-muted-dark-foreground text-base max-w-[280px]">
                Transforme seus áudios favoritos em uma experiência de áudio imersiva
              </P>
            </View>
          </View>

          <LoginForm onToggleForm={toggleForm} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
