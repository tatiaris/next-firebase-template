import { APIMethods } from "@hooks/useAPI";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUploadedFileUrl = async (api: APIMethods, file: unknown): Promise<string> => {
  if (!(file instanceof File)) return file as string;
  const fileUpload = await api.uploadFile(file, file.name.split(".")[0]);
  if (!fileUpload || !fileUpload.data?.downloadURL) throw new Error("Error uploading file");
  return fileUpload.data?.downloadURL;
}

export const getUploadedFileUrls = async (api: APIMethods, files: File[]): Promise<(string)[]> => {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map(file => getUploadedFileUrl(api, file)));
};

export const replaceFile = async (api: APIMethods, oldPath: string | undefined, newFile: unknown): Promise<string> => {
  if (!(newFile instanceof File)) return oldPath || "";
  await api.deleteFile(oldPath || "");
  return getUploadedFileUrl(api, newFile);
}

export const replaceFiles = async (api: APIMethods, oldPaths: string[], newFiles: File[]): Promise<(string)[]> => {
  await Promise.all(oldPaths.map(path => api.deleteFile(path || "")));
  return getUploadedFileUrls(api, newFiles);
}
