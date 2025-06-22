import { useNetInfo } from '@react-native-community/netinfo';
import { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { ContentService } from '../../services/content';
import { ensureDirectoryExists } from '../../utils/mediaStore';
import { getStorage, setStorage, storageKeys } from '../../utils/storage';
import { IPurchasesContentDataResponse } from '../purchase/types';
import { usePlayer } from '../usePlayer';
import { Content, ContentContextData, IContentProviderProps } from './types';

export const ContentContext = createContext({} as ContentContextData);

export function ContentProvider({ children }: IContentProviderProps) {
  const { setDownloadedContent, getGofyDownloadsDir } = usePlayer();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingOfflineContents, setIsShowingOfflineContents] = useState(false);
  const { isConnected } = useNetInfo();
  const { t } = useTranslation();

  const getAllPurchases = useCallback(async () => {
    if (!isConnected) {
      setIsLoading(true);
      const lastSearchedContents = JSON.parse(await getStorage(storageKeys.lastSearchedContents) || '[]') as IPurchasesContentDataResponse[] | [];

      if (lastSearchedContents.length === 0) {
        return;
      }

      setContents(lastSearchedContents.map(purchase => purchase.content))
      setIsShowingOfflineContents(true);
      setIsLoading(false);

      Toast.show({
        autoHide: true,
        text1: t('toast.offline.title'),
        text2: t('toast.offline.message'),
        swipeable: true,
        type: "error"
      })
      return;
    }

    try {
      setIsLoading(true)

      const response = await ContentService.getAllPurchase()

      await setStorage(storageKeys.lastSearchedContents, JSON.stringify(response.data));

      setIsShowingOfflineContents(false);
      setContents(response.data.map(purchase => purchase.content))

      setIsLoading(false)
    } catch (error: any) {
      const message = error?.response?.data?.message

      Toast.show({
        autoHide: true,
        text1: t('toast.content.searchError'),
        text2: message,
        swipeable: true,
        type: "error"
      })
    }
  }, [isConnected, t])

  const createContent = async (content: Omit<Content, 'id'>) => {
    if (!isConnected) {
      Toast.show({
        autoHide: true,
        text1: t('toast.offline.title'),
        text2: t('toast.offline.message'),
        swipeable: true,
        type: "error"
      })

      return;
    }

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
          const dir = await getGofyDownloadsDir();
          await ensureDirectoryExists(dir);

          const fileName = `content_${createdContent.id}.mp3`;
          const destinationPath = `${dir}/${fileName}`;

          if (Platform.OS === 'ios') {
            const sourcePath = decodeURIComponent(content.url!);
            if (!(await RNFS.exists(sourcePath))) {
              throw new Error(`Source file not found: ${sourcePath}`);
            }

            await RNFS.copyFile(sourcePath, destinationPath);
          } else {
            await RNFS.copyFile(content.url!, destinationPath);
          }

          setDownloadedContent(createdContent.id);
        } catch (fileError: any) {
          Toast.show({
            autoHide: true,
            text1: t('toast.content.localFileError'),
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
        text1: t('toast.content.createError'),
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
        text1: t('toast.content.deleteError'),
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
        isShowingOfflineContents,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
