import { LogOut, Moon, Sun, Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Text } from "../../components/ui/text";
import { useAuth } from "../../hooks/useAuth";
import { useColorScheme } from "../../lib/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import { Select } from "../../components/ui/select";
import { languageList } from "../../i18n";

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = async () => {
    await logout();
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <View className="flex-1 flex flex-col gap-3 p-6 bg-background dark:bg-background-dark">
        <Card className="p-6 flex">
          <View className="gap-3 flex flex-col">
            <View className="flex flex-col gap-1">
              <Text className="text-2xl font-medium text-foreground dark:text-foreground-dark">{t('settings.profile.title')}</Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{t('settings.profile.description')}</Text>
            </View>

            <View className="flex flex-col gap-4">
              <View className="flex flex-col gap-2">
                <View className="flex flex-col gap-1">
                  <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{t('auth.name')}</Text>
                  <Text className="font-medium text-foreground dark:text-foreground-dark">{user?.name}</Text>
                </View>

                <View className="flex flex-col gap-1">
                  <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{t('auth.email')}</Text>
                  <Text className="font-medium text-foreground dark:text-foreground-dark">{user?.email}</Text>
                </View>

                <View className="flex flex-col gap-1">
                  <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{t('settings.profile.phone')}</Text>
                  <Text className="font-medium text-foreground dark:text-foreground-dark">{user?.phone}</Text>
                </View>
              </View>

              <View className="flex flex-row gap-3">
                <Button variant="outline" className="flex-1" onPress={() => navigation.navigate(`ContentFormStack`, { screen: 'EditProfile' })}>
                  {t('settings.profile.editProfile')}
                </Button>
                <Button variant="outline" className="flex-1" onPress={() => navigation.navigate(`ContentFormStack`, { screen: 'ChangePassword' })}>
                  {t('settings.profile.changePassword')}
                </Button>
              </View>
            </View>
          </View>
        </Card>

        <Card className="p-6 flex">
          <View className="flex flex-col gap-6">
            <View className="flex flex-col gap-1">
              <Text className="text-2xl font-medium text-foreground dark:text-foreground-dark">{t('settings.preferences.title')}</Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{t('settings.preferences.description')}</Text>
            </View>

            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-col gap-0.5">
                <View className="flex flex-row items-center gap-2">
                  {isDarkColorScheme ? <Moon size={16} color={isDarkColorScheme ? "#94a3b8" : "#5c5d8d"} /> : <Sun size={16} color={isDarkColorScheme ? "#94a3b8" : "#5c5d8d"} />}
                  <Text className="text-foreground dark:text-foreground-dark">
                    {t('settings.preferences.theme')} {isDarkColorScheme ? t('settings.preferences.dark') : t('settings.preferences.light')}
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{t('settings.preferences.themeDescription')}</Text>
              </View>
              <Switch
                checked={isDarkColorScheme}
                onCheckedChange={toggleColorScheme}
              />
            </View>

            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-col gap-0.5">
                <View className="flex flex-row items-center gap-2">
                  <Globe size={16} color={isDarkColorScheme ? "#94a3b8" : "#5c5d8d"} />
                  <Text className="text-foreground dark:text-foreground-dark">
                    {t('settings.preferences.language')}
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{t('settings.preferences.languageDescription')}</Text>
              </View>
              <View className="w-[140px]">
                <Select
                  value={i18n.language}
                  onValueChange={handleLanguageChange}
                  options={languageList.map(lang => ({
                    label: `${lang.icon} ${lang.label}`,
                    value: lang.value
                  }))}
                  placeholder={t('settings.preferences.selectLanguage')}
                />
              </View>
            </View>
          </View>
        </Card>

        <View className="flex pt-3">
          <Button
            variant="destructive"
            className="w-full"
            onPress={handleLogout}
          >
            <View className="flex relative flex-row items-center justify-center gap-2">
              <LogOut size={16} color="#fff" />
              <Text className="text-white">{t('settings.logout')}</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView >
  );
}
