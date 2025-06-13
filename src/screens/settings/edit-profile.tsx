import { Formik } from "formik";
import { ArrowLeft, MailIcon, PhoneIcon, UserIcon } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useColorScheme } from "../../lib/useColorScheme";
import { useAuth } from "../../hooks/useAuth";
import { AuthService } from "../../services/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export const EditProfileScreen = () => {
  const { colorScheme } = useColorScheme();
  const { user, editProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phone: Yup.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .matches(/^[0-9]+$/, 'Phone number must contain only digits'),
  });

  const handleSubmit = async (values: { name: string; email: string; phone: string }) => {
    try {
      setIsSubmitting(true);
      await editProfile({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      navigation.goBack();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error editing profile',
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
                Edit Profile
              </CardTitle>
              <View className="w-10" />
            </View>
            <CardDescription className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              Update your profile information. All fields are required.
            </CardDescription>
          </CardHeader>

          <Formik
            initialValues={{
              name: user?.name || "",
              email: user?.email || "",
              phone: user?.phone || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View className="flex-1 bg-background dark:bg-background-dark">
                <CardContent className="flex flex-col px-5">
                  <View className="flex flex-col gap-4 mt-5">
                    <View className="flex flex-col gap-1">
                      <Label htmlFor="name">
                        <View className="text-sm font-medium flex flex-row items-center gap-2">
                          <UserIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                          <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">
                            Name
                          </Text>
                        </View>
                      </Label>

                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={values.name}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                      />

                      {touched.name && errors.name && (
                        <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
                      )}
                    </View>

                    <View className="flex flex-col gap-1">
                      <Label htmlFor="email">
                        <View className="text-sm font-medium flex flex-row items-center gap-2">
                          <MailIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                          <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">
                            Email
                          </Text>
                        </View>
                      </Label>

                      <Input
                        id="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />

                      {touched.email && errors.email && (
                        <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                      )}
                    </View>

                    <View className="flex flex-col gap-1">
                      <Label htmlFor="phone">
                        <View className="text-sm font-medium flex flex-row items-center gap-2">
                          <PhoneIcon size={16} color={colorScheme === 'dark' ? '#d2d2d2' : '#000'} />
                          <Text className="text-muted-foreground dark:text-muted-foreground-dark font-bold">
                            Phone
                          </Text>
                        </View>
                      </Label>

                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={values.phone}
                        onChangeText={handleChange("phone")}
                        onBlur={handleBlur("phone")}
                        className="bg-muted/30 dark:bg-muted-dark/30 border-primary/20 dark:border-primary-dark/20 focus:border-primary dark:focus:border-primary-dark h-12"
                        keyboardType="phone-pad"
                      />

                      {touched.phone && errors.phone && (
                        <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>
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
                        "Save Changes"
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