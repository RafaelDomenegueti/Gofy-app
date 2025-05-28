import { CommonActions, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { ArrowLeft, Lock, Mail, User } from "lucide-react-native";
import { useRef } from 'react';
import { TextInput, View } from "react-native";
import * as yup from 'yup';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Text } from "../../components/ui/text";
import { useAuth } from "../../hooks/useAuth";
import { useColorScheme } from "../../lib/useColorScheme";

type LoginFormProps = {
  onToggleForm: () => void;
};

export function RegisterForm({ onToggleForm }: LoginFormProps) {
  const { register, isLoading } = useAuth();
  const navigation = useNavigation()
  const { colorScheme } = useColorScheme()
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const initialValues = { name: '', email: '', password: '', confirmPassword: '' }

  const registerSchema = yup.object().shape({
    name: yup
      .string()
      .required('O nome é obrigatório')
      .min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: yup
      .string()
      .email('Digite um e-mail válido')
      .required('O e-mail é obrigatório'),
    password: yup
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .required('A senha é obrigatória'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'As senhas não coincidem')
      .required('Confirme a senha'),
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
        <CardTitle className="text-2xl font-bold text-center dark:text-foreground-dark">Criar Conta</CardTitle>
        <CardDescription className="text-center dark:text-muted-dark-foreground">
          Preencha os dados abaixo para começar
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={handleRegister}
        validationSchema={registerSchema}
      >
        {({ setFieldValue, handleSubmit, values, errors, touched }) => (
          <View>
            <CardContent className="flex flex-col gap-5">
              <View className="flex flex-col gap-2">
                <Label className="text-sm font-medium dark:text-foreground-dark">
                  Nome
                </Label>
                <View className="relative">
                  <Input
                    placeholder="Seu Nome"
                    value={values.name}
                    onChangeText={(v) => setFieldValue("name", v)}
                    className={`pl-11 ${touched.name && errors.name ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="next"
                    onSubmitEditing={() => emailRef.current?.focus()}
                    autoCapitalize="words"
                    autoComplete="name"
                    accessibilityLabel="Campo de nome"
                    accessibilityHint="Digite seu nome completo"
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
                  Email
                </Label>
                <View className="relative">
                  <Input
                    ref={emailRef}
                    placeholder="seu@email.com"
                    value={values.email}
                    onChangeText={(v) => setFieldValue("email", v)}
                    className={`pl-11 ${touched.email && errors.email ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="next"
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    accessibilityLabel="Campo de email"
                    accessibilityHint="Digite seu endereço de email"
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
                  Senha
                </Label>
                <View className="relative">
                  <Input
                    ref={passwordRef}
                    placeholder="••••••••"
                    value={values.password}
                    onChangeText={(v) => setFieldValue("password", v)}
                    secureTextEntry
                    className={`pl-11 ${touched.password && errors.password ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    autoComplete="password-new"
                    accessibilityLabel="Campo de senha"
                    accessibilityHint="Digite sua senha"
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
                  Confirme sua Senha
                </Label>
                <View className="relative">
                  <Input
                    ref={confirmPasswordRef}
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    onChangeText={(v) => setFieldValue("confirmPassword", v)}
                    secureTextEntry
                    className={`pl-11 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-input'}`}
                    returnKeyType="done"
                    onSubmitEditing={() => handleSubmit()}
                    autoComplete="password-new"
                    accessibilityLabel="Campo de confirmação de senha"
                    accessibilityHint="Digite novamente sua senha para confirmar"
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
                disabled={isLoading}
                onPress={() => handleSubmit()}
              >
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
              <Button
                variant="link"
                className="w-full flex items-center flex-row justify-center gap-2"
                onPress={onToggleForm}
              >
                <View className="flex-row items-center gap-2">
                  <ArrowLeft size={16} color={colorScheme === 'dark' ? "#fff" : "#5c5d8d"} />
                  <Text className="text-primary dark:text-white font-medium">Já tenho uma conta</Text>
                </View>
              </Button>
            </CardFooter>
          </View>
        )}
      </Formik>
    </Card>
  )
}
