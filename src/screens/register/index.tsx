import { useNavigation } from "@react-navigation/native"
import { Headphones } from "lucide-react-native"
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"
import { H1, P } from "../../components/ui/typography"
import { useColorScheme } from '../../lib/useColorScheme'
import { RegisterForm } from "./form"

export const RegisterScreen = () => {
  const navigation = useNavigation()
  const { colorScheme } = useColorScheme()

  const toggleForm = () => {
    navigation.goBack()
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
              <View className="w-20 h-20 mb-4 rounded-2xl bg-primary/10 dark:bg-primary-dark/10 items-center justify-center flex flex-row gap-3">
                <Headphones size={40} color={colorScheme === 'dark' ? '#fff' : '#000'} />

                <H1 className="text-4xl font-bold text-center text-primary dark:text-white">
                  Gofy
                </H1>
              </View>
              <P className="text-center text-muted-foreground dark:text-muted-dark-foreground text-base max-w-[280px]">
                Transforme seus vídeos favoritos em uma experiência de áudio imersiva
              </P>
            </View>
          </View>

          <RegisterForm onToggleForm={toggleForm} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
