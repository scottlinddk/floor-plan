import { useEffect, useState } from "react";

/** Loads an HTMLImageElement for a given URL, for use as a Konva image source. */
export function useHtmlImage(url: string | undefined): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!url) {
      setImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => setImage(img);
    img.src = url;

    return () => {
      img.onload = null;
    };
  }, [url]);

  return image;
}
