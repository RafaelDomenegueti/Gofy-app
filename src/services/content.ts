import { IPurchasesContentDataResponse } from "../hooks/purchase/types";
import { ILoginData, IRegisterData, LoginDataResponse } from "../hooks/useAuth/types";
import { Content } from "../hooks/useContent/types";
import { getStorage, storageKeys } from "../utils/storage";
import { api } from "./api";

async function create(data: Omit<Content, "id">) {
  return api.post<Content>('content', data, {
    headers: {
      Authorization: "Bearer " + await getStorage(storageKeys.token)
    }
  });
}

async function find(id: string) {
  return api.get<Content>(`content/${id}`, {
    headers: {
      Authorization: "Bearer " + await getStorage(storageKeys.token)
    }
  });
}

async function getTags() {
  return api.get<{ id: string, name: string }[]>(`content/tags`, {
    headers: {
      Authorization: "Bearer " + await getStorage(storageKeys.token)
    }
  });
}

async function search(contentName: string) {
  return api.get<Content[]>(`search/${contentName}`, {
    headers: {
      Authorization: "Bearer " + await getStorage(storageKeys.token)
    }
  });
}

async function getAllPurchase() {
  return api.get<IPurchasesContentDataResponse[]>('purchase', {
    headers: {
      Authorization: "Bearer " + await getStorage(storageKeys.token)
    }
  });
}

export const ContentService = { create, find, getTags, search, getAllPurchase }
