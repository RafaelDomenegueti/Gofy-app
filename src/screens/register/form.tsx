import { CommonActions, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { ArrowLeft, Lock, Mail, User } from "lucide-react-native";
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from "react-native";
import * as yup from 'yup';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Text } from "../../components/ui/text";
import { useAuth } from "../../hooks/useAuth";
import { useColorScheme } from "../../lib/useColorScheme";
import { PasswordInput } from "../../components/password-input";

type LoginFormProps = {
  onToggleForm: () => void;
};

export function RegisterForm({ onToggleForm }: LoginFormProps) {
  const { register } = useAuth();
  const navigation = useNavigation()
  const { colorScheme } = useColorScheme()
  const { t } = useTranslation()
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const initialValues = { name: '', email: '', password: '', confirmPassword: '' }

  const registerSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('validation.nameRequired'))
      .min(2, t('validation.nameMinLength')),
    email: yup
      .string()
      .email(t('validation.emailInvalid'))
      .required(t('validation.emailRequired')),
    password: yup
      .string()
      .min(8, t('validation.passwordMinLength'))
      .required(t('validation.passwordRequired')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('validation.passwordsDoNotMatch'))
      .required(t('validation.confirmPasswordRequired')),
  });

  const handleRegister = async (data: typeof initialValues) => {
    const isSigned = await register(data)

    if (!isSigned) {
      return;
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in dark:bg-card-dark/50">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold text-center dark:text-foreground-dark">
          {t('auth.createAccountTitle')}
        </CardTitle>
        <CardDescription className="text-center dark:text-muted-dark-foreground">
          {t('auth.fillDataToStart')}
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={handleRegister}
        validationSchema={registerSchema}
      >
        {({ setFieldValue, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View>
            <CardContent className="flex flex-col gap-5">
              <View className="flex flex-col gap-2">
                <Label className="text-sm font-medium dark:text-foreground-dark">
                  {t('auth.name')}
                </Label>
                <View className="relative">
                  <Input
                    placeholder={t('auth.namePlaceholder')}
                    value={values.name}
                    onChangeText={(v) => setFieldValue("name", v)}
                    className={`pl-11 ${touched.name && errors.name ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    autoCapitalize="words"
                    autoComplete="name"
                    accessibilityLabel={t('auth.name')}
                    accessibilityHint={t('auth.namePlaceholder')}
                  />
                  <View className="absolute left-3 top-3.5">
                    <User size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                </View>
                {touched.name && errors.name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
                )}
              </View>
              <View className="flex flex-col gap-2">
                <Label className="text-sm font-medium dark:text-foreground-dark">
                  {t('auth.email')}
                </Label>
                <View className="relative">
                  <Input
                    ref={emailRef}
                    placeholder={t('auth.emailPlaceholder')}
                    value={values.email}
                    onChangeText={(v) => setFieldValue("email", v)}
                    className={`pl-11 ${touched.email && errors.email ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    accessibilityLabel={t('auth.email')}
                    accessibilityHint={t('auth.emailPlaceholder')}
                  />
                  <View className="absolute left-3 top-3.5">
                    <Mail size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                </View>
                {touched.email && errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                )}
              </View>
              <View className="flex flex-col gap-2">
                <Label className="text-sm font-medium dark:text-foreground-dark">
                  {t('auth.password')}
                </Label>
                <View className="relative">
                  <PasswordInput
                    ref={passwordRef}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={values.password}
                    onChangeText={(v) => setFieldValue("password", v)}
                    className={`pl-11 ${touched.password && errors.password ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    autoComplete="password-new"
                    accessibilityLabel={t('auth.password')}
                    accessibilityHint={t('auth.passwordPlaceholder')}
                  />
                  <View className="absolute left-3 top-3.5">
                    <Lock size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                </View>
                {touched.password && errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>
              <View className="flex flex-col gap-2">
                <Label className="text-sm font-medium dark:text-foreground-dark">
                  {t('auth.confirmPassword')}
                </Label>
                <View className="relative">
                  <PasswordInput
                    ref={confirmPasswordRef}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    value={values.confirmPassword}
                    onChangeText={(v) => setFieldValue("confirmPassword", v)}
                    className={`pl-11 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit()}
                    autoComplete="password-new"
                    accessibilityLabel={t('auth.confirmPassword')}
                    accessibilityHint={t('auth.confirmPasswordPlaceholder')}
                  />
                  <View className="absolute left-3 top-3.5">
                    <Lock size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
                )}
              </View>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                className="w-full bg-primary dark:bg-primary-dark py-3"
                disabled={isSubmitting}
                onPress={() => handleSubmit()}
              >
                {isSubmitting ? t('auth.creatingAccount') : t('auth.createAccount')}
              </Button>
              <Button
                variant="link"
                className="w-full flex items-center flex-row justify-center gap-2"
                onPress={onToggleForm}
              >
                <View className="flex-row items-center gap-2">
                  <ArrowLeft size={16} color={colorScheme === 'dark' ? "#fff" : "#5c5d8d"} />
                  <Text className="text-primary dark:text-white font-medium">{t('auth.alreadyHaveAccount')}</Text>
                </View>
              </Button>
            </CardFooter>
          </View>
        )}
      </Formik>
    </Card>
  )
}
