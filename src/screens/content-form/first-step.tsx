import { Formik } from "formik";
import { LinkIcon, YoutubeIcon } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { CardContent, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useColorScheme } from "../../lib/useColorScheme";
import { AudioService } from "../../services/audio";

interface IProps {
  handleFirstStep: (data: any) => void;
}

const validationSchema = Yup.object().shape({
  url: Yup.string()
    .url("Insira uma URL válida.")
    .required("O link é obrigatório."),
});

export const ContentFormFirstStep = ({ handleFirstStep }: IProps) => {
  const { colorScheme } = useColorScheme();

  const handleSubmit = async (values: { url: string }, { setSubmitting }: any) => {
    try {
      const response = await AudioService.getInfo(values.url, "youtube");

      handleFirstStep({
        url: values.url,
        banner: response.data.thumbnails[response.data.thumbnails.length - 1].url,
        title: response.data.title.substring(0, 254),
        description: response.data.description.substring(0, 254),
      });
    } catch (error) {
      Toast.show({
        type: "info",
        text1: "Não foi possível pegar dinamicamente as informações do vídeo",
      });

      handleFirstStep({
        url: values.url,
        banner: "",
        title: "",
        description: "",
      });
    } finally {
      setSubmitting(false);
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
          <CardContent className="flex flex-col gap-5 px-5">
            <View className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-2">
              <Text className="text-sm text-muted-foreground leading-relaxed">
                Insira abaixo o link de qualquer vídeo do YouTube para transformá-lo em áudio.
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
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={values.url}
                  onChangeText={handleChange("url")}
                  onBlur={handleBlur("url")}
                  className="pl-11 bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                />
                <View className="absolute left-3 top-3">
                  <YoutubeIcon size={20} color={colorScheme === 'dark' ? '#b91c1c' : '#ef4444'} />
                </View>
              </View>

              {touched.url && errors.url && (
                <Text className="text-red-500 text-sm mt-1">{errors.url}</Text>
              )}
            </View>
          </CardContent>

          <CardFooter className="p-5 pt-0">
            <Button
              className="w-full h-12 rounded-xl"
              disabled={isSubmitting || !values.url}
              onPress={() => handleSubmit()}
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
