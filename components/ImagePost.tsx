import { useState } from "react";
import { toast } from "sonner";
import { LuImagePlus, LuImageMinus } from "react-icons/lu";
import { MoonLoader } from "react-spinners";
import LoadImageClient from "./LoadImageClient";
import { GoStarFill, GoStar } from "react-icons/go";

function ImagePost({
  title,
  image,
  HandleIsDone,
  HandleIsRemoved,
  HandleMakeFirst,
  isMain,
}: {
  title?: string;
  image?: { image: string; id: string };
  HandleIsDone: (image: string, id: string) => void;
  HandleIsRemoved?: (id: string) => void;
  HandleMakeFirst?: (image: { image: string; id: string }) => void;
  isMain?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const convertToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    if (!file) return Promise.reject("No file provided");
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const HandlePicture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const file = event.target.files?.[0];
    if (!file) {
      setLoading(false);
      return toast.error("No file selected");
    }

    const UploadedImage = (await convertToBase64(file)) as string;
    const response = await fetch(`/api/image${image ? `/${image.id}` : ""}`, {
      method: image ? "PATCH" : "POST",
      body: JSON.stringify({ image: UploadedImage }),
    });
    setLoading(false);
    if (response.ok) {
      const { imageId } = await response.json();
      return HandleIsDone(UploadedImage, imageId);
    }
    return toast.error("Failed to upload image");
  };

  const HandleRemove = async () => {
    if (!image || !HandleIsRemoved) return;
    setLoading(true);

    const res = await fetch(`/api/image/${image.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (res.ok) {
      return HandleIsRemoved(image.id);
    }
    return toast.error("Failed to Remove image");
  };

  return (
    <div className="flex-1">
      {title && (
        <h3 className="text-xl text-center font-semibold mt-10 mb-4">
          {title}
        </h3>
      )}
      <div className="h-72 border border-gray-800 rounded-[1.5rem] overflow-hidden relative">
        {image &&
          (isMain ? (
            <GoStarFill className="top-3 left-3 absolute z-10 hover:scale-125 duration-200 text-yellow-500" />
          ) : (
            <GoStar
              className="top-3 left-3 absolute z-10 hover:scale-125 duration-200 text-yellow-500"
              onClick={(e) => {
                e.stopPropagation();
                HandleMakeFirst && HandleMakeFirst(image);
              }}
            />
          ))}
        {image && (
          <LuImageMinus
            className="top-3 right-3 absolute z-10 hover:scale-125 duration-200"
            onClick={(e) => {
              e.stopPropagation();
              HandleRemove();
            }}
          />
        )}
        <label
          htmlFor={image ? image.id : "file-upload"}
          className="h-full w-full flex items-center justify-center absolute top-0 left-0 cursor-pointer"
        >
          {loading ? (
            <MoonLoader size={50} />
          ) : image?.id ? (
            image.image ? (
              <img
                src={image.image}
                alt="Uploaded"
                className="h-full w-full object-cover"
              />
            ) : (
              <LoadImageClient
                Css="h-full w-full object-cover"
                Url={image.id}
              />
            )
          ) : (
            <LuImagePlus className="text-3xl" />
          )}
        </label>
        <input
          className="h-full w-full hidden"
          type="file"
          name={image ? image.id : "file-upload"}
          id={image ? image.id : "file-upload"}
          accept=".jpeg, .png, .jpg"
          onChange={HandlePicture}
        />
      </div>
    </div>
  );
}

export default ImagePost;
