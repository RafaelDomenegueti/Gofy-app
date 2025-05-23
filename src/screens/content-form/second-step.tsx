import { Formik } from "formik"
import { BookText, Headphones, Save, Tag as TagIcon, User } from "lucide-react-native"
import { ActivityIndicator, Image, ScrollView, View } from "react-native"
import * as Yup from "yup"
import { Button } from "../../components/ui/button"
import { CardContent, CardFooter } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Text } from "../../components/ui/text"
import { Textarea } from "../../components/ui/textarea"
import { Content } from "../../hooks/useContent/types"
import { useColorScheme } from "../../lib/useColorScheme"
import { tags } from "../../utils/tags"

interface IProps {
  handleSubmit: (data: any) => void;
  dataForm: Partial<Content>;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Título é obrigatório")
    .max(255, "Título não pode ter mais de 255 caracteres"),
  description: Yup.string()
    .max(255, "Descrição não pode ter mais de 255 caracteres"),
  author: Yup.string()
    .required("Autor é obrigatório")
    .max(255, "Nome do autor não pode ter mais de 255 caracteres"),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, "Selecione pelo menos uma tag")
});

export const ContentFormSecondStep = ({ handleSubmit, dataForm }: IProps) => {
  const { colorScheme } = useColorScheme();

  const initialValues = {
    ...dataForm,
    tags: dataForm.tags || [],
  };

  const handleSecondStep = (data: Partial<Content>) => {
    handleSubmit(data)
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSecondStep}
    >
      {({ setFieldValue, handleSubmit, values, errors, isSubmitting }) => (
        <ScrollView>
          <CardContent className="flex flex-col gap-5 px-5">
            {values.banner && (
              <View className="h-48 overflow-hidden rounded-xl mb-2 relative">
                <Image
                  source={{ uri: values.banner }}
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Headphones size={32} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                </View>
              </View>
            )}

            <View className="flex flex-col gap-1">
              <Label htmlFor="title" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <BookText size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">Título</Text>
                </View>
              </Label>

              <Input
                id="title"
                value={values.title}
                placeholder="Digite o título do conteúdo"
                onChangeText={(text) => setFieldValue("title", text)}
                className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                maxLength={255}
              />
              {errors.title && (
                <Text className="text-red-500 text-sm">{errors.title}</Text>
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="author" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <User size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">Autor</Text>
                </View>
              </Label>
              <Input
                id="author"
                value={values.author}
                placeholder="Digite o nome do autor"
                onChangeText={(text) => setFieldValue("author", text)}
                className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                maxLength={255}
              />
              {errors.author && (
                <Text className="text-red-500 text-sm">{errors.author}</Text>
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <BookText size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">Descrição</Text>
                </View>
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva do que se trata este conteúdo..."
                value={values.description}
                onChangeText={(text) => setFieldValue("description", text)}
                className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark min-h-24"
                maxLength={255}
              />
              {errors.description && (
                <Text className="text-red-500 text-sm">{errors.description}</Text>
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <TagIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">Tags</Text>
                </View>
              </Label>

              <View className="flex-row flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={values.tags?.includes(tag.id) ? "default" : "outline"}
                    onPress={() => {
                      const currentTags = values.tags || [];
                      const newTags = currentTags.includes(tag.id)
                        ? currentTags.filter(id => id !== tag.id)
                        : [...currentTags, tag.id];
                      setFieldValue("tags", newTags);
                    }}
                    className={`rounded-full ${values.tags?.includes(tag.id)
                      ? "bg-primary dark:bg-primary-dark"
                      : "bg-transparent border-primary/20 dark:border-primary-dark/20"
                      }`}
                  >
                    <Text
                      className={`${values.tags?.includes(tag.id)
                        ? "text-white"
                        : "text-primary dark:text-primary-dark"
                        }`}
                    >
                      {tag.name}
                    </Text>
                  </Button>
                ))}
              </View>
              {errors.tags && (
                <Text className="text-red-500 text-sm">{errors.tags}</Text>
              )}
            </View>
          </CardContent>

          <CardFooter className="p-5 pt-2 pb-10">
            <Button
              className="w-full h-12 rounded-xl"
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-medium">Salvando...</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Save size={18} color="white" />
                  <Text className="text-white font-medium">Salvar conteúdo</Text>
                </View>
              )}
            </Button>
          </CardFooter>
        </ScrollView>
      )}
    </Formik>
  )
}
