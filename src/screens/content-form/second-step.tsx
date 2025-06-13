import { Formik } from "formik"
import { BookText, Headphones, Save, Tag as TagIcon, User } from "lucide-react-native"
import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { ActivityIndicator, Image, ScrollView, TextInput, View } from "react-native"
import * as Yup from "yup"
import { Button } from "../../components/ui/button"
import { CardContent, CardFooter } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Text } from "../../components/ui/text"
import { Textarea } from "../../components/ui/textarea"
import { Content } from "../../hooks/useContent/types"
import { useColorScheme } from "../../lib/useColorScheme"
import { getTagName, tags } from "../../utils/tags"

interface IProps {
  handleSubmit: (data: any) => void;
  dataForm: Partial<Content>;
}

export const ContentFormSecondStep = ({ handleSubmit, dataForm }: IProps) => {
  const { colorScheme } = useColorScheme();
  const authorRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required(t('contentForm.validation.titleRequired'))
      .min(3, t('contentForm.validation.titleMinLength'))
      .max(255, t('contentForm.validation.titleMaxLength')),
    description: Yup.string()
      .max(255, t('contentForm.validation.descriptionMaxLength')),
    author: Yup.string()
      .required(t('contentForm.validation.authorRequired'))
      .min(3, t('contentForm.validation.authorMinLength'))
      .max(255, t('contentForm.validation.authorMaxLength')),
    tags: Yup.array()
      .of(Yup.string())
      .min(1, t('contentForm.validation.tagsRequired'))
  });

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
                  accessibilityLabel={t('contentForm.title')}
                  accessibilityRole="image"
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
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">{t('contentForm.title')}</Text>
                </View>
              </Label>

              <Input
                id="title"
                value={values.title}
                placeholder={t('contentForm.titlePlaceholder')}
                onChangeText={(text) => setFieldValue("title", text)}
                className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                maxLength={255}
                returnKeyType="next"
                onSubmitEditing={() => authorRef.current?.focus()}
                autoCapitalize="words"
                accessibilityLabel={t('contentForm.title')}
                accessibilityHint={t('contentForm.titlePlaceholder')}
              />
              {errors.title && (
                <Text className="text-red-500 text-sm" accessibilityRole="alert">{errors.title}</Text>
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="author" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <User size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">{t('contentForm.author')}</Text>
                </View>
              </Label>
              <Input
                id="author"
                ref={authorRef}
                value={values.author}
                placeholder={t('contentForm.authorPlaceholder')}
                onChangeText={(text) => setFieldValue("author", text)}
                className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                maxLength={255}
                returnKeyType="next"
                onSubmitEditing={() => descriptionRef.current?.focus()}
                autoCapitalize="words"
                accessibilityLabel={t('contentForm.author')}
                accessibilityHint={t('contentForm.authorPlaceholder')}
              />
              {errors.author && (
                <Text className="text-red-500 text-sm" accessibilityRole="alert">{errors.author}</Text>
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="description" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <BookText size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">{t('contentForm.description')}</Text>
                </View>
              </Label>
              <Textarea
                id="description"
                ref={descriptionRef}
                placeholder={t('contentForm.descriptionPlaceholder')}
                value={values.description}
                onChangeText={(text) => setFieldValue("description", text)}
                className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark min-h-24"
                maxLength={255}
                returnKeyType="default"
                autoCapitalize="sentences"
                accessibilityLabel={t('contentForm.description')}
                accessibilityHint={t('contentForm.descriptionPlaceholder')}
              />
              {errors.description && (
                <Text className="text-red-500 text-sm" accessibilityRole="alert">{errors.description}</Text>
              )}
            </View>

            <View className="flex flex-col gap-1">
              <Label htmlFor="tags" className="text-sm font-medium flex flex-row items-center gap-2">
                <View className="text-sm font-medium flex flex-row items-center gap-2">
                  <TagIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                  <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">{t('contentForm.tags')}</Text>
                </View>
              </Label>

              <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
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
                      : "bg-transparent border-primary/20 dark:border-gray-500/80"
                      }`}
                    accessibilityLabel={`${t('contentForm.tags')} ${getTagName(tag)}`}
                    accessibilityHint={values.tags?.includes(tag.id) ? t('contentForm.validation.tagsRequired') : t('contentForm.validation.tagsRequired')}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: values.tags?.includes(tag.id) }}
                  >
                    <Text
                      className={`${values.tags?.includes(tag.id)
                        ? "text-white"
                        : "text-primary dark:text-gray-500"
                        }`}
                    >
                      {getTagName(tag)}
                    </Text>
                  </Button>
                ))}
              </View>
              {errors.tags && (
                <Text className="text-red-500 text-sm" accessibilityRole="alert">{errors.tags}</Text>
              )}
            </View>
          </CardContent>

          <CardFooter className="p-5 pt-2 pb-10">
            <Button
              className="w-full h-12 rounded-xl"
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
              accessibilityLabel={t('contentForm.saveContent')}
              accessibilityHint={t('contentForm.saveContent')}
              accessibilityRole="button"
              accessibilityState={{ disabled: isSubmitting }}
            >
              {isSubmitting ? (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-medium">{t('contentForm.saving')}</Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Save size={18} color="white" />
                  <Text className="text-white font-medium">{t('contentForm.saveContent')}</Text>
                </View>
              )}
            </Button>
          </CardFooter>
        </ScrollView>
      )}
    </Formik>
  )
}
