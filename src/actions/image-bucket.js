import { storage } from "@/lib/supabase.js";

export async function uploadImageRequest({ file }) {
  const filePath = `uploads/${Date.now()}_${file.name}`; // Unique file name
  const { error } = await storage.upload(filePath, file);


  if (error) {
    return [error, null];
  }

  // Get public URL
  const { data: publicUrlData } = storage.getPublicUrl(filePath);
  return [null, publicUrlData];
}
