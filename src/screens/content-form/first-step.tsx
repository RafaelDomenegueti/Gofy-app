import { Formik } from "formik";
import { LinkIcon } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useColorScheme } from "../../lib/useColorScheme";

interface IProps {
  handleFirstStep: (data: any) => void;
}

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .url("Insira uma URL válida.")
    .test('not-video-platforms', 'Este provedor não é permitido. Por favor, insira um link direto para um arquivo de áudio.', function (value) {
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
          message: `O ${matchedDomain.name} não é permitido. Por favor, insira um link direto para um arquivo de áudio.`
        });
      }
      return true;
    })
    .required("O link é obrigatório."),
});

export const ContentFormFirstStep = ({ handleFirstStep }: IProps) => {
  const { colorScheme } = useColorScheme();

  const handleSubmit = async (values: { url: string }, { setSubmitting }: any) => {
    handleFirstStep({
      url: values.url,
      banner: "",
      title: "",
      description: "",
    });

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ url: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View>
          <CardContent className="flex flex-col gap-5 px-5">
            <View className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
              <Text className="text-sm text-muted-foreground leading-relaxed">
                Insira abaixo o link do áudio que você deseja adicionar.
                Você poderá ouvi-lo como um podcast, mesmo com o app em segundo plano.
              </Text>
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="url">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <LinkIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">Link do vídeo</Text>
                </View>
              </Label>

              <View className="relative">
                <Input
                  id="url"
                  placeholder="https://exemplo.com/audio.mp3"
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
                  accessibilityLabel="Campo de link do YouTube"
                  accessibilityHint="Digite o link do vídeo do YouTube que você deseja converter em áudio"
                  accessibilityRole="none"
                />
              </View>

              {touched.url && errors.url && (
                <Text className="text-red-500 text-sm mt-1" accessibilityRole="alert">{errors.url}</Text>
              )}
            </View>
          </CardContent>

          <CardFooter className="p-5 pt-0">
            <Button
              className="w-full h-12 rounded-xl"
              disabled={isSubmitting || !values.url}
              onPress={() => handleSubmit()}
              accessibilityLabel="Botão continuar"
              accessibilityHint="Toque para processar o link do vídeo"
              accessibilityRole="button"
              accessibilityState={{ disabled: isSubmitting || !values.url }}
            >
              {isSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-medium">Processando...</Text>
                </View>
              ) : (
                "Continuar"
              )}
            </Button>
          </CardFooter>
        </View>
      )}
    </Formik>
  );
};
