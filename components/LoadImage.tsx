async function LoadImage({ Url, Css }: { Url: string; Css: string }) {
  const res = await fetch(`${process.env.URL}/api/image/${Url}`);
  const { image } = await res.json();

  return <img src={image} className={Css} alt="..." />;
}

export default LoadImage;
