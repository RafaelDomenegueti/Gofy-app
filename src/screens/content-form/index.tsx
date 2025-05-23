import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button } from "../../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useContent } from "../../hooks/useContent";
import { Content } from "../../hooks/useContent/types";
import { useColorScheme } from "../../lib/useColorScheme";
import { ContentFormFirstStep } from "./first-step";
import { ContentFormSecondStep } from "./second-step";

export const ContentFormScreen = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const { createContent } = useContent();
  const navigation = useNavigation<NavigationProp>();
  const [dataForm, setDataForm] = useState<Partial<Content>>({});
  const { colorScheme } = useColorScheme();

  const handleFirstStep = async (currentData: any) => {
    setStep(2);
    setDataForm(d => ({
      ...d,
      ...currentData
    }))
  };

  const handleSubmit = async (currentData: any) => {
    createContent({
      ...dataForm,
      ...currentData,
      isPublic: false,
    });

    // Navigate back to home and reset navigation history
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeStack' }],
    });
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigation.goBack();
    }
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
                {step === 1 ? "Adicionar conteúdo" : "Detalhes do conteúdo"}
              </CardTitle>
              <View className="w-10" />
            </View>
            <CardDescription className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              {step === 1
                ? "Insira o link do vídeo que deseja transformar em áudio."
                : "Verifique e personalize os detalhes do conteúdo."
              }
            </CardDescription>

            <View className="flex-row justify-center mt-4 space-x-2">
              <View className={`h-2 rounded-full w-12 ${step === 1 ? "bg-primary" : "bg-muted"}`} />
              <View className={`h-2 rounded-full w-12 ${step === 2 ? "bg-primary" : "bg-muted"}`} />
            </View>
          </CardHeader>

          {step === 1 || !dataForm?.url ? (
            <ContentFormFirstStep handleFirstStep={handleFirstStep} />
          ) : (
            <ContentFormSecondStep dataForm={dataForm} handleSubmit={handleSubmit} />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
