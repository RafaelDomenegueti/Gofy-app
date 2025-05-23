import { createContext, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ContentService } from '../../services/content';
import { Content, ContentContextData, IContentProviderProps } from './types';

export const ContentContext = createContext({} as ContentContextData);

export function ContentProvider({ children }: IContentProviderProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllPurchases = async () => {
    try {
      setIsLoading(true)

      const response = await ContentService.getAllPurchase()

      setContents(response.data.map(purchase => purchase.content))

      setIsLoading(false)
    } catch (error: any) {
      const message = error?.response?.data?.message

      Toast.show({
        autoHide: true,
        text1: "Error searching content",
        text2: message,
        swipeable: true,
        type: "error"
      })
    }

  }

  const createContent = async (content: Omit<Content, 'id'>) => {
    try {
      setIsLoading(true)

      const { data: createdContent } = await ContentService.create(content)
      setContents(data => [...data, createdContent])

      setIsLoading(false)
    } catch (error: any) {
      const message = error?.response?.data?.message

      Toast.show({
        autoHide: true,
        text1: "Error creating content",
        text2: message,
        swipeable: true,
        type: "error"
      })
    }
  };

  const deleteContent = async (contentId: string) => {
    try {
      await ContentService.cancelPurchase(contentId);
      setContents(data => data.filter(content => content.id !== contentId));
    } catch (error: any) {
      const message = error?.response?.data?.message;

      Toast.show({
        autoHide: true,
        text1: "Error deleting content",
        text2: message,
        swipeable: true,
        type: "error"
      });
    }
  };

  return (
    <ContentContext.Provider
      value={{
        contents,
        createContent,
        getAllPurchases,
        deleteContent,
        isLoading,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
