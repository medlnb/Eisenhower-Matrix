"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { ClipLoader, MoonLoader } from "react-spinners";
import { toast } from "sonner";

interface User {
  name: string;
  phoneNumber: string;
  image: string;
}

function Page() {
  const { update } = useSession();
  const [user, setUser] = useState<User>();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingSubmitImage, setLoadingSubmitImage] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const res = await fetch("/api/auth/user");
      if (!res.ok) return toast.error("Error fetching user data");
      const userData = await res.json();
      setUser(userData.user);
    };
    fetchUserInfo();
  }, []);

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const res = await fetch("/api/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...user }),
    });

    if (!res.ok) {
      toast.error("Error updating user data");
      setLoadingSubmit(false);
      return;
    }
    update({
      name: user?.name,
      phoneNumber: user?.phoneNumber,
      image: user?.image,
    });

    toast.success("User information updated successfully");
    setLoadingSubmit(false);
  };

  const convertToBase64 = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    if (!file) return Promise.reject("No image provided");
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

  const HandleChangeImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoadingSubmitImage(true);
    const file = event.target.files?.[0];
    if (!file) {
      setLoadingSubmitImage(false);
      return toast.error("No image provided");
    }
    const UploadedImage = (await convertToBase64(file)) as string;

    const res = await fetch(`/api/image`, {
      method: "POST",
      body: JSON.stringify({ image: UploadedImage }),
    });
    const { imageId } = await res.json();
    await fetch("/api/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: `https://eisenhower--matrix.vercel.app/api/image/${imageId}`,
      }),
    });
    setUser((prev) => ({
      ...prev!,
      image: `https://eisenhower--matrix.vercel.app/api/image/${imageId}`,
    }));
    update({
      image: `https://eisenhower--matrix.vercel.app/api/image/${imageId}`,
    });

    setLoadingSubmitImage(false);
  };

  return (
    <form onSubmit={HandleSubmit}>
      <div className="shadow-1 rounded-xl p-4 sm:p-8.5 relative ">
        {user ? (
          <div className="mb-6 h-40 w-40 rounded-full mx-auto flex items-center justify-center bg-gray-4">
            <label htmlFor={"image-upload"} className="cursor-pointer ">
              {loadingSubmitImage ? (
                <MoonLoader size={50} color="blue" />
              ) : (
                <div className="relative">
                  <Image
                    height={400}
                    width={400}
                    src={user.image}
                    alt={user.name}
                    className="h-40 w-40 rounded-full mx-auto object-contain"
                  />
                  <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 bg-gray-1 hover:opacity-50 opacity-0 duration-150 w-full h-full rounded-full" />
                  <div className="absolute right-0 bottom-0">
                    <FaRegEdit className="text-4xl text-gray-7" />
                  </div>
                </div>
              )}
            </label>
            <input
              className="h-full w-full hidden"
              type="file"
              name={"image-upload"}
              id={"image-upload"}
              accept=".jpeg, .png, .jpg"
              onChange={HandleChangeImage}
            />
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full mx-auto mb-6 loading--background" />
        )}
        {!user && (
          <div className="absolute top-5 right-5">
            <ClipLoader size={20} />
          </div>
        )}
        <div className="w-full mb-5">
          <label htmlFor="name" className="block mb-2.5">
            {/* {t("name")} <span className="text-red">*</span> */}
          </label>

          <input
            type="text"
            name="name"
            id="name"
            placeholder="Mohamed Ben____"
            value={user?.name ?? ""}
            disabled={!user}
            onChange={(e) =>
              setUser((prev) => ({ ...prev!, name: e.target.value }))
            }
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <button
          type="submit"
          className="w-40 inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ClipLoader size={23} className="mx-auto" color="white" />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </form>
  );
}

export default Page;
