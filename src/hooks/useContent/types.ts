import { ReactNode } from 'react';

export interface IContentProviderProps {
  children: ReactNode;
}

export type Content = {
  id: string;
  url: string;
  title: string;
  description: string;
  banner?: string;
  author?: string
  created_at: string
  isPublic: boolean,
  tags: string[]
};

export type ContentInfo = {
  videoUrl: string;
  thumbnails: {
    height: number;
    width: number;
    url: string;
  }[];
  category: string;
  uploadDate: string;
  lengthSeconds: string;
  title: string;
  description: string;
}

export type ContentContextData = {
  contents: Content[];
  createContent: (content: Omit<Content, 'id'>) => void;
  getAllPurchases: () => void;
  isLoading: boolean;
};
