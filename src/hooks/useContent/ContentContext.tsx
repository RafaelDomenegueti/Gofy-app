import { createContext, useState } from 'react';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { ContentService } from '../../services/content';
import { usePlayer } from '../usePlayer';
import { Content, ContentContextData, IContentProviderProps } from './types';

export const ContentContext = createContext({} as ContentContextData);

export function ContentProvider({ children }: IContentProviderProps) {
  const { setDownloadedContent, getGofyDownloadsDir } = usePlayer();
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

      let currentUrl = content.url;

      if (!content.url?.startsWith("http")) {
        currentUrl = null;
      }

      const { data: createdContent } = await ContentService.create({
        ...content,
        url: currentUrl
      })
      setContents(data => [...data, createdContent])

      if (!content.url?.startsWith("http")) {
        try {
          const dir = getGofyDownloadsDir();
          if (!(await RNFS.exists(dir))) {
            await RNFS.mkdir(dir);
          }

          const fileName = `content_${createdContent.id}.mp3`;
          const destinationPath = `${dir}${fileName}`;

          const sourcePath = decodeURIComponent(content.url!);
          if (!(await RNFS.exists(sourcePath))) {
            throw new Error(`Source file not found: ${sourcePath}`);
          }

          await RNFS.copyFile(sourcePath, destinationPath);
          setDownloadedContent(createdContent.id);
        } catch (fileError: any) {
          Toast.show({
            autoHide: true,
            text1: "Error processing local file",
            text2: fileError.message,
            swipeable: true,
            type: "error"
          });
        }
      }

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
