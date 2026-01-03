import axios from "axios";
import { UnsplashImage } from "./types";

export const fetchImages = async ({ pageParam = 1 }): Promise<UnsplashImage[]> => {

  const response = await axios.get<UnsplashImage[]>(`https://api.unsplash.com/photos`, {
    
    params: { page: pageParam, per_page: 12 },
    headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` },
  });

  return response.data;
}