import * as DocumentPicker from '@react-native-documents/picker';
import { Formik } from "formik";
import { LinkIcon, UploadIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useColorScheme } from "../../lib/useColorScheme";

interface IProps {
  handleFirstStep: (data: any) => void;
}

export const ContentFormFirstStep = ({ handleFirstStep }: IProps) => {
  const { colorScheme } = useColorScheme();
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    url: Yup.string()
      .url(t('contentForm.validation.urlInvalid'))
      .test('not-video-platforms', t('contentForm.validation.urlNotAllowed'), function (value) {
        if (!value) return true;
        const blockedDomains = [
          { domain: 'youtube.com', name: 'YouTube' },
          { domain: 'youtu.be', name: 'YouTube' },
          { domain: 'vimeo.com', name: 'Vimeo' },
          { domain: 'dailymotion.com', name: 'Dailymotion' },
          { domain: 'twitch.tv', name: 'Twitch' },
          { domain: 'facebook.com/watch', name: 'Facebook Watch' },
          { domain: 'instagram.com/reel', name: 'Instagram Reels' },
          { domain: 'tiktok.com', name: 'TikTok' }
        ];

        const matchedDomain = blockedDomains.find(({ domain }) => value.toLowerCase().includes(domain));
        if (matchedDomain) {
          return this.createError({
            message: t('contentForm.validation.urlNotAllowed')
          });
        }
        return true;
      })
      .required(t('contentForm.validation.urlRequired')),
  });

  const handleSubmit = async (values: { url: string }, { setSubmitting }: any) => {
    handleFirstStep({
      url: values.url,
      banner: "",
      title: "",
      description: "",
    });

    setSubmitting(false);
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: ['audio/*'],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory'
      });

      const file = result[0];
      handleFirstStep({
        url: file.uri,
        banner: "",
        title: file.name?.split(".")[0] || "",
        description: "",
      });
    } catch (error: any) {
      // Ignore cancellation errors
      if (error.code === 'CANCELLED') {
        return;
      }

      console.error('Error picking file:', error);
    }
  };

  return (
    <Formik
      initialValues={{ url: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View>
          <CardContent className="flex flex-col px-5">
            <View className="bg-primary/5 p-4 rounded-xl border border-primary/10">
              <Text className="text-sm text-muted-foreground leading-relaxed">
                {t('contentForm.audioLinkDescription')}
              </Text>
            </View>

            <View className="mt-5">
              <RadioGroup
                value={inputType}
                onValueChange={(value) => setInputType(value as 'url' | 'file')}
                className="flex-row gap-4"
              >
                <Pressable
                  className={`flex-1 flex-row items-center space-x-2 border rounded-lg p-3 ${inputType === 'url' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'}`}
                  onPress={() => setInputType('url')}
                >
                  <View className="flex-row items-center gap-3">
                    <RadioGroupItem value="url" id="url" />
                    <Label htmlFor="url" className="flex-row items-center gap-2">
                      <View className="flex-row items-center gap-2">
                        <LinkIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                        <Text className="text-muted-foreground dark:text-muted-foreground-dark">{t('contentForm.url')}</Text>
                      </View>
                    </Label>
                  </View>
                </Pressable>

                <Pressable
                  className={`flex-1 flex-row items-center space-x-2 border rounded-lg p-3 ${inputType === 'file' ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'}`}
                  onPress={() => setInputType('file')}
                >
                  <View className="flex-row items-center gap-3">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file">
                      <View className="flex-row items-center gap-2">
                        <UploadIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                        <Text className="text-muted-foreground dark:text-muted-foreground-dark">{t('contentForm.file')}</Text>
                      </View>
                    </Label>
                  </View>
                </Pressable>
              </RadioGroup>
            </View>

            {inputType === 'url' ? (
              <View className="flex flex-col gap-1 mt-5">
                <Label htmlFor="url">
                  <View className="text-sm font-medium flex flex-row items-center gap-2">
                    <LinkIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                    <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">{t('contentForm.audioLink')}</Text>
                  </View>
                </Label>

                <View className="relative">
                  <Input
                    id="url"
                    placeholder={t('contentForm.audioLinkPlaceholder')}
                    value={values.url}
                    onChangeText={handleChange("url")}
                    onBlur={handleBlur("url")}
                    className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit()}
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="url"
                    accessibilityLabel={t('contentForm.audioLink')}
                    accessibilityHint={t('contentForm.audioLinkDescription')}
                    accessibilityRole="none"
                  />
                </View>

                {touched.url && errors.url && (
                  <Text className="text-red-500 text-sm mt-1" accessibilityRole="alert">{errors.url}</Text>
                )}

                <Button
                  className="w-full h-12 rounded-xl mt-5"
                  disabled={isSubmitting || (inputType === 'url' && !values.url)}
                  onPress={() => inputType === 'url' ? handleSubmit() : handleFilePick()}
                  accessibilityLabel={t('contentForm.continue')}
                  accessibilityHint={t('contentForm.audioLinkDescription')}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isSubmitting || (inputType === 'url' && !values.url) }}
                >
                  {isSubmitting ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator color="white" size="small" />
                      <Text className="text-white font-medium">{t('contentForm.processing')}</Text>
                    </View>
                  ) : (
                    t('contentForm.continue')
                  )}
                </Button>
              </View>
            ) : (
              <Pressable
                onPress={handleFilePick}
                className="mt-5 border-2 border-dashed border-primary/20 dark:border-primary-dark/20 rounded-xl p-6 bg-primary/5 dark:bg-primary-dark/5"
              >
                <View className="flex items-center justify-center gap-3">
                  <View className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center">
                    <UploadIcon size={24} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  </View>
                  <View className="flex items-center gap-1">
                    <Text className="text-base font-medium text-foreground dark:text-foreground-dark">
                      {t('contentForm.chooseAudioFile')}
                    </Text>
                    <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark text-center">
                      {t('contentForm.chooseFileDescription')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          </CardContent>
        </View>
      )}
    </Formik>
  );
};
