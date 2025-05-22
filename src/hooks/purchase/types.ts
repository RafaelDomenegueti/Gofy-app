import { Content } from "../useContent/types";

export interface IPurchasesContentDataResponse {
  id: string;
  userId: string;
  contentId: string;
  like: boolean;
  content: Content;
}