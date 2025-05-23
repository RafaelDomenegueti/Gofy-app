import { Formik } from 'formik';
import { ArrowRight, Lock, Mail } from "lucide-react-native";
import { View } from "react-native";
import * as yup from 'yup';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Text } from "../../components/ui/text";
import { useAuth } from "../../hooks/useAuth";
import { useColorScheme } from '../../lib/useColorScheme';

type LoginFormProps = {
  onToggleForm: () => void;
};

export function LoginForm({ onToggleForm }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const { colorScheme } = useColorScheme()
  const initialValues = { email: '', password: '' }

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email('Digite um e-mail válido')
      .required('O e-mail é obrigatório'),
    password: yup
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .required('A senha é obrigatória'),
  });

  const handleLogin = async (data: typeof initialValues) => {
    const isSigned = await login(data)

    if (!isSigned) {
      return;
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in dark:bg-card-dark/50">
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-2xl font-bold text-center dark:text-foreground-dark">Bem-vindo de volta!</CardTitle>
        <CardDescription className="text-center dark:text-muted-dark-foreground">
          Entre com suas credenciais para continuar
        </CardDescription>
      </CardHeader>
      <Formik
        initialValues={initialValues}
        onSubmit={handleLogin}
        validationSchema={loginSchema}
      >
        {({ setFieldValue, handleSubmit, values, errors, touched }) => (
          <View>
            <CardContent className="flex flex-col gap-5">
              <View className="flex flex-col gap-2">
                <Label className="text-sm font-medium dark:text-foreground-dark">
                  Email
                </Label>
                <View className="relative">
                  <Input
                    placeholder="seu@email.com"
                    value={values.email}
                    onChangeText={(v) => setFieldValue("email", v)}
                    className={`pl-11 ${touched.email && errors.email ? 'border-red-500' : 'border-input'}`}
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
                    placeholder="••••••••"
                    value={values.password}
                    onChangeText={(v) => setFieldValue("password", v)}
                    secureTextEntry
                    className={`pl-11 ${touched.password && errors.password ? 'border-red-500' : 'border-input'}`}
                  />
                  <View className="absolute left-3 top-3.5">
                    <Lock size={18} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                </View>
                {touched.password && errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button
                className="w-full bg-primary dark:bg-primary-dark py-3"
                disabled={isLoading}
                onPress={() => handleSubmit()}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <Button
                variant="link"
                className="w-full flex items-center flex-row justify-center gap-2"
                onPress={onToggleForm}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-primary dark:text-white font-medium">Criar uma conta</Text>
                  <ArrowRight color={colorScheme === 'dark' ? "#232336" : "#5c5d8d"} size={16} />
                </View>
              </Button>
            </CardFooter>
          </View>
        )}
      </Formik>
    </Card>
  )
}
