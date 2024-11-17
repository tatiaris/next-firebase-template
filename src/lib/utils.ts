import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import FirebaseDB from "./db/firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUploadedFileUrl = async (db: FirebaseDB, file: unknown): Promise<string> => {
  if (!(file instanceof File)) return file as string;
  const fileUpload = await db.uploadFile(file, file.name.split(".")[0]);
  if (!fileUpload || !fileUpload.data?.downloadURL) throw new Error("Error uploading file");
  return fileUpload.data?.downloadURL;
}

export const getUploadedFileUrls = async (db: FirebaseDB, files: File[]): Promise<(string)[]> => {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map(file => getUploadedFileUrl(db, file)));
};

export const replaceFile = async (db: FirebaseDB, oldPath: string | undefined, newFile: unknown): Promise<string> => {
  if (!(newFile instanceof File)) return oldPath || "";
  await db.deleteFile(oldPath || "");
  return getUploadedFileUrl(db, newFile);
}

export const replaceFiles = async (db: FirebaseDB, oldPaths: string[], newFiles: File[]): Promise<(string)[]> => {
  await Promise.all(oldPaths.map(path => db.deleteFile(path || "")));
  return getUploadedFileUrls(db, newFiles);
}
