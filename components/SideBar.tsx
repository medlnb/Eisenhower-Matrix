"use client";
import { usePathname } from "next/navigation";
import favicon from "@public/favicon.png";
import { FaNoteSticky, FaTable } from "react-icons/fa6";
import { FiCheckSquare } from "react-icons/fi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CiLogout } from "react-icons/ci";
import Image from "@node_modules/next/image";
import { useState } from "react";
import { Box, Button, Modal, ModalDialog } from "@node_modules/@mui/joy";
import { toast } from "sonner";
import { MoonLoader } from "@node_modules/react-spinners";
import { FaRegEdit } from "@node_modules/react-icons/fa";
import { useFormik } from "@node_modules/formik/dist";
import { UserSchema } from "@Schemas/UerSchema";

const navs = [
  { href: "/", ico: <FaTable size={25} /> },
  { href: "/notes", ico: <FaNoteSticky size={25} /> },
  { href: "/tasks", ico: <FiCheckSquare size={25} /> },
]; // Navigation links

function SideBar() {
  const pathname = usePathname();
  const { data: session, update } = useSession();
  const [dialog, setDialog] = useState(false);
  const [loadingSubmitImage, setLoadingSubmitImage] = useState(false);
  const [loadingUserInfoFtch, setLoadingUserInfoFtch] = useState(false);

  const {
    errors,
    getFieldProps,
    touched,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    setErrors,
    setValues,
    values,
  } = useFormik({
    initialValues: {
      isLoaded: false,
      image: "",
      name: "",
      defaultName: "",
      newPassword: "",
      password: "",
    },
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      const res = await fetch("/api/auth/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          newPassword: values.newPassword,
          password: values.password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        setErrors(error);
        setSubmitting(false);
        return;
      }
      setValues((prev) => ({
        isLoaded: false,
        image: "",
        name: "",
        defaultName: "",
        newPassword: "",
        password: "",
      }));

      update({
        name: values?.name,
      });
      setSubmitting(false);
      setDialog(false);
      toast.success("User information updated successfully");
    },
  });

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
    setValues((prev) => ({
      ...prev!,
      image: `https://eisenhower--matrix.vercel.app/api/image/${imageId}`,
    }));
    update({
      image: `https://eisenhower--matrix.vercel.app/api/image/${imageId}`,
    });

    setLoadingSubmitImage(false);
  };

  const openDialog = async () => {
    if (values.isLoaded) return setDialog(true);
    setLoadingUserInfoFtch(true);
    const res = await fetch("/api/auth/user");
    setLoadingUserInfoFtch(false);
    if (!res.ok) return toast.error("Error fetching user data");
    const userData = await res.json();
    setValues({
      password: "",
      newPassword: "",
      isLoaded: true,
      defaultName: userData.user.name,
      ...userData.user,
    });
    setDialog(true);
  };

  const closeDialog = () => {
    setValues((prev) => ({
      ...prev!,
      name: prev!.defaultName,
      password: "",
      newPassword: "",
    }));
    setDialog(false);
  };

  return (
    <>
      <aside className="bg-primary-1 fixed left-0 h-svh md:flex hidden flex-col justify-between py-4 duration-300 w-24">
        <div>
          <Image
            src={favicon.src}
            alt="logo"
            height={300}
            width={300}
            className="w-12 h-12 mx-auto"
          />
          <nav className="mt-20 px-2 py-1 bg-primary-2 w-10 mx-auto rounded-full">
            {navs.map((nav, index) => (
              <Link
                key={nav.href}
                href={nav.href}
                className={`flex hover:gap-5 justify-center items-center gap-3 rounded-full duration-150 ${
                  pathname === nav.href ? "scale-125" : ""
                } ${index ? "mt-4" : ""}`}
              >
                <div
                  className={`rounded-full p-2 ${
                    pathname === nav.href
                      ? "bg-secondary-2 text-white"
                      : "text-gray-400"
                  }`}
                >
                  {nav.ico}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3  items-center bg-primary-2 w-10 mx-auto rounded-full py-2">
          <CiLogout
            size={25}
            className="text-white cursor-pointer hover:scale-105 duration-200"
            onClick={() => signOut()}
          />

          {!session?.user || loadingUserInfoFtch ? (
            <div className="h-8 w-8 rounded-full loading--background" />
          ) : (
            <Image
              onClick={() => {
                openDialog();
              }}
              height={100}
              width={100}
              alt="User Image"
              src={session?.user?.image}
              className="h-8 w-8 rounded-full cursor-pointer hover:scale-125 duration-200"
            />
          )}
        </div>
      </aside>
      <nav className="fixed md:hidden bottom-2 w-11/12 left-1/2 -translate-x-1/2 rounded-xl overflow-hidden z-30 shadow-lg shadow-black">
        <div className="absolute w-full h-full top-0 left-0  z-10 opacity-80 bg-primary-2"></div>
        <div className="flex justify-around items-center py-2 relative z-20 text-white">
          {navs.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className={`p-2 text-xs duration-300 ${
                pathname === nav.href
                  ? "scale-105 bg-secondary-2  rounded-full"
                  : ""
              }`}
            >
              {nav.ico}
            </Link>
          ))}
          {!session?.user || loadingUserInfoFtch ? (
            <div className="h-8 w-8 rounded-full loading--background" />
          ) : (
            <Image
              onClick={() => {
                openDialog();
              }}
              height={100}
              width={100}
              alt="User Image"
              src={session?.user?.image}
              className="h-8 w-8 rounded-full"
            />
          )}
        </div>
      </nav>
      <Modal open={dialog} onClose={closeDialog}>
        <ModalDialog
          aria-labelledby="nested-modal-title"
          aria-describedby="nested-modal-description"
          sx={(theme) => ({
            [theme.breakpoints.only("xs")]: {
              top: "unset",
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
              transform: "none",
              maxWidth: "100%", //
            },
            width: "600px",
          })}
        >
          {values.isLoaded && (
            <div>
              <div className="my-6 h-40 w-40 rounded-full mx-auto flex items-center justify-center bg-gray-4">
                <label htmlFor={"image-upload"} className="cursor-pointer ">
                  {loadingSubmitImage ? (
                    <MoonLoader size={50} color="blue" />
                  ) : (
                    <div className="relative">
                      <Image
                        height={400}
                        width={400}
                        src={values.image}
                        alt={values.name}
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
                  disabled={loadingSubmitImage || isSubmitting}
                />
              </div>
              <div className="w-full mb-5">
                <label htmlFor="name" className="block text-gray-500 mb-2.5">
                  Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name..."
                  {...getFieldProps("name")}
                  className={`rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20
                    ${
                      touched.name && errors.name
                        ? "outline outline-2 outline-red-500"
                        : "outline-none"
                    }`}
                />
              </div>
              <div className="w-full mb-5 border-t pt-5">
                <label
                  htmlFor="password"
                  className="block text-gray-500 mb-2.5"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password..."
                  {...getFieldProps("password")}
                  className={`rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20
                    ${
                      touched.password && errors.password
                        ? "outline outline-2 outline-red-500"
                        : "outline-none"
                    }`}
                />
                <p
                  className={`text-xs text-red-400 ${
                    touched.password && errors.password
                      ? "visible"
                      : "invisible"
                  }`}
                >
                  {errors.password} !
                </p>
                <label
                  htmlFor="newPassword"
                  className="block text-gray-500 my-2.5"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="New password..."
                  value={values.newPassword}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev!,
                      newPassword: e.target.value,
                    }))
                  }
                  className={`rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20
                    ${
                      errors.newPassword
                        ? "outline outline-2 outline-red-500"
                        : "outline-none"
                    }`}
                />
              </div>
            </div>
          )}
          <Box
            sx={{
              mt: 1,
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column", sm: "row-reverse" },
            }}
          >
            <Button
              variant="solid"
              sx={{ backgroundColor: "#fcb37b", color: "white" }}
              onClick={() => handleSubmit()}
              loading={isSubmitting}
              disabled={
                isSubmitting ||
                loadingSubmitImage ||
                !!errors.name ||
                !!errors.password ||
                !!errors.newPassword ||
                !values.isLoaded ||
                (values.name === values.defaultName && !values.password)
              }
            >
              Save
            </Button>

            <Button variant="outlined" color="neutral" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              sx={{ display: { xs: "block", sm: "none" } }}
              variant="solid"
              color="neutral"
              onClick={() => {
                signOut();
              }}
            >
              Log out
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default SideBar;
