import { ContentInfo } from "../hooks/useContent/types";
import { getStorage, storageKeys } from "../utils/storage";
import { api } from "./api";

async function getInfo(url: string, origin: string) {
  return api.get<ContentInfo>(`audio/info?url=${url}&origin=${origin}`);
}

async function extractAudio(url: string) {
  return api.get<any>(`audio/extract?url=${url}`);
}

export const AudioService = { getInfo, extractAudio }
