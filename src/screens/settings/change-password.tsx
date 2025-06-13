import { Formik } from "formik";
import { ArrowLeft, LockIcon } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useColorScheme } from "../../lib/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import Toast from "react-native-toast-message";

export const ChangePasswordScreen = () => {
  const { colorScheme } = useColorScheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  const { changePassword } = useAuth();

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const handleSubmit = async (values: { currentPassword: string; newPassword: string }) => {
    try {
      setIsSubmitting(true);
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      navigation.goBack();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password changed successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error changing password',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1 bg-background dark:bg-background-dark p-4">
        <Card className="w-full mx-auto overflow-hidden mt-10 mb-12">
          <View className="absolute w-full h-1 bg-gradient-to-r from-primary to-blue-400 top-0 left-0" />

          <CardHeader className="pb-6">
            <View className="flex items-center justify-between mb-2 flex-row">
              <Button size="icon" variant="ghost" onPress={goBack} className="rounded-full h-10 w-10">
                <ArrowLeft size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
              </Button>
              <CardTitle className={`text-xl font-bold text-foreground dark:text-foreground-dark`}>
                Change Password
              </CardTitle>
              <View className="w-10" />
            </View>
            <CardDescription className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              Enter your current password and choose a new password to update your account security.
            </CardDescription>
          </CardHeader>

          <Formik
            initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View className="flex-1 bg-background dark:bg-background-dark">
                <CardContent className="flex flex-col px-5">
                  <View className="flex flex-col gap-4 mt-5">
                    <View className="flex flex-col gap-1">
                      <Label htmlFor="currentPassword">
                        <View className="text-sm font-medium flex flex-row items-center gap-2">
                          <LockIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                          <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">
                            Current Password
                          </Text>
                        </View>
                      </Label>

                      <Input
                        id="currentPassword"
                        placeholder="Enter your current password"
                        value={values.currentPassword}
                        onChangeText={handleChange("currentPassword")}
                        onBlur={handleBlur("currentPassword")}
                        className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                        secureTextEntry
                      />

                      {touched.currentPassword && errors.currentPassword && (
                        <Text className="text-red-500 text-sm mt-1">{errors.currentPassword}</Text>
                      )}
                    </View>

                    <View className="flex flex-col gap-1">
                      <Label htmlFor="newPassword">
                        <View className="text-sm font-medium flex flex-row items-center gap-2">
                          <LockIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                          <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">
                            New Password
                          </Text>
                        </View>
                      </Label>

                      <Input
                        id="newPassword"
                        placeholder="Enter your new password"
                        value={values.newPassword}
                        onChangeText={handleChange("newPassword")}
                        onBlur={handleBlur("newPassword")}
                        className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                        secureTextEntry
                      />

                      {touched.newPassword && errors.newPassword && (
                        <Text className="text-red-500 text-sm mt-1">{errors.newPassword}</Text>
                      )}
                    </View>

                    <View className="flex flex-col gap-1">
                      <Label htmlFor="confirmPassword">
                        <View className="text-sm font-medium flex flex-row items-center gap-2">
                          <LockIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                          <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">
                            Confirm Password
                          </Text>
                        </View>
                      </Label>

                      <Input
                        id="confirmPassword"
                        placeholder="Confirm your new password"
                        value={values.confirmPassword}
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                        secureTextEntry
                      />

                      {touched.confirmPassword && errors.confirmPassword && (
                        <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
                      )}
                    </View>

                    <Button
                      className="w-full h-12 rounded-xl mt-5"
                      disabled={isSubmitting}
                      onPress={() => handleSubmit()}
                    >
                      {isSubmitting ? (
                        <View className="flex-row items-center gap-2">
                          <ActivityIndicator color="white" size="small" />
                          <Text className="text-white font-medium">Processing...</Text>
                        </View>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </View>
                </CardContent>
              </View>
            )}
          </Formik>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}; 