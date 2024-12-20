import { useEffect, useState } from "react";

function LoadImageClient({ Url, Css }: { Url: string; Css: string }) {
  const [image, setImage] = useState();
  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetch(`/api/image/${Url}`);
      const data = await res.json();
      setImage(data.image);
    };
    fetchImage();
  }, []);

  return image ? (
    <img src={image} className={Css} />
  ) : (
    <div className={`loading--background ${Css}`} />
  );
}

export default LoadImageClient;
