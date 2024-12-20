"use client";
import { useFormik } from "formik";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import { useState } from "react";
import { LoginSchema } from "@Schemas/UerSchema";
import { DialogContent, DialogTitle, Link, ModalDialog } from "@mui/joy";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa6";
import { MoonLoader } from "react-spinners";
import { CiUser } from "react-icons/ci";

function AuthForm() {
  const [dialog, setDialog] = useState<"Log in" | "Sign up" | false>(false);

  const [validation, setValidation] = useState<{
    userId?: string;
    code: string;
    isSubmitting: boolean;
    isSubmittingResend: boolean;
    errors?: string;
  }>({ code: "", isSubmitting: false, isSubmittingResend: false });

  const {
    errors,
    getFieldProps,
    touched,
    handleSubmit,
    setErrors,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setSubmitting(true);

      const result =
        dialog === "Log in"
          ? HandleLogin({
              email: values.email,
              password: values.password,
            })
          : HandleSignUp({
              name: values.name,
              email: values.email,
              password: values.password,
            });

      const convertedResult = await result;
      setSubmitting(false);
      if (!convertedResult.ok) setErrors({ email: convertedResult.error });
      if (convertedResult.userId)
        setValidation((prev) => ({ ...prev, userId: convertedResult.userId }));

      if (dialog === "Log in" && convertedResult.ok) {
        setDialog(false);
        resetForm();
        location.reload();
      }
    },
  });

  const HandleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    const loginResult: { error?: string; ok: boolean; userId?: string } = {
      ok: false,
    };
    if (!result) loginResult.error = "Something Went Wrong";
    else {
      loginResult.error = result.error ?? undefined;
      loginResult.ok = result.ok;
    }

    return loginResult;
  };

  const HandleSignUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const data = await res.json();
    const result: { error?: string; ok: boolean; userId?: string } = {
      userId: data.userId,
      ok: data.ok,
    };
    if (!res.ok) result.error = data.err;

    return result;
  };

  const HandleValid = async () => {
    if (validation.code.length !== 6)
      return setValidation((prev) => ({
        ...prev,
        errors: "invalid Code, Please make sure and try again",
      }));

    setValidation((prev) => ({ ...prev, isSubmitting: true }));
    const res = await fetch("/api/auth/emailValidation", {
      method: "POST",
      body: JSON.stringify({
        userId: validation.userId,
        code: validation.code,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setValidation((prev) => ({
        ...prev,
        errors: data.error,
        isSubmitting: false,
      }));
      return;
    }
    setValidation((prev) => ({
      ...prev,
      isSubmitting: false,
      userId: undefined,
    }));
    resetForm();
    return setDialog("Log in");
  };

  const HandleResetCode = async () => {
    setValidation((prev) => ({ ...prev, isSubmittingResend: true }));
    const res = await fetch("/api/auth/emailValidation", {
      method: "PATCH",
      body: JSON.stringify({ userId: validation.userId }),
    });
    const data = await res.json();
    if (!res.ok)
      return setValidation((prev) => ({
        ...prev,
        errors: data.error,
        isSubmittingResend: false,
      }));

    return setValidation((prev) => ({
      ...prev,
      isSubmittingResend: false,
      errors: undefined,
    }));
  };

  return (
    <div>
      <button
        onClick={() => setDialog("Log in")}
        className="w-20 flex items-center justify-center gap-1 hover:gap-2 duration-150 cursor-pointer"
      >
        <CiUser size={20} />
        Log in
      </button>
      <Modal
        open={!!dialog}
        onClose={() => {
          setDialog(false);
          resetForm();
        }}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>__{dialog}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <h3 className="text-gray-400 text-sm font-semibold my-2">
                Please enter your details
              </h3>
              {dialog === "Sign up" && (
                <>
                  <h4 className="pl-1 text-xs mt-4 text-gray-700">
                    Say your name
                  </h4>
                  <input
                    className="p-2 border border-[#979aa8] rounded-md text-black w-full focus:outline-none"
                    id="name"
                    {...getFieldProps("name")}
                  />
                  <p
                    className={`text-xs text-red-400 ${
                      touched.name && errors.name ? "visible" : "invisible"
                    }`}
                  >
                    {errors.name} !
                  </p>
                </>
              )}
              <h4 className="pl-1 text-xs text-gray-700">Email</h4>
              <input
                className="p-2 border border-[#979aa8] rounded-md text-black w-full focus:outline-none"
                id="email"
                {...getFieldProps("email")}
              />
              <p
                className={`text-xs text-red-400 ${
                  touched.email && errors.email ? "visible" : "invisible"
                }`}
              >
                {errors.email} !
              </p>
              <h4 className="pl-1 text-xs text-gray-700">Password</h4>
              <input
                className="p-2 border border-[#979aa8] rounded-md text-black w-full focus:outline-none"
                type="password"
                id="password"
                {...getFieldProps("password")}
              />
              <p
                className={`text-xs text-red-400  ${
                  touched.password && errors.password ? "visible" : "invisible"
                }`}
              >
                {errors.password} !
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`p-1 items-center justify-center gap-2 rounded-md w-full mt-2 text-sm text-white bg-secondary-1 ${
                  validation.userId ? "hidden" : "flex"
                }`}
              >
                {isSubmitting ? <MoonLoader size={15} color="#fff" /> : dialog}
              </button>
            </form>

            {validation.userId ? (
              <>
                <h4 className="pl-1 text-xs mt-4 text-gray-700">
                  Validation Code
                </h4>
                <input
                  className="p-1 border border-[#979aa8] rounded-md text-black w-full focus:outline-none text-center"
                  id="email"
                  value={validation.code}
                  onChange={(e) => {
                    if (e.target.value.length > 6) return;
                    setValidation((prev) => ({
                      ...prev,
                      errors: undefined,
                      code: e.target.value.toUpperCase(),
                    }));
                  }}
                />
                <p
                  className={`text-xs text-red-400 ${
                    validation.errors ? "visible" : "invisible"
                  }`}
                >
                  {validation.errors} !
                </p>
                <div className="flex justify-between gap-2 text-white">
                  <button
                    disabled={validation.isSubmitting}
                    className="p-1 flex justify-center rounded-md w-full mt-2 text-sm bg-secondary-1"
                    onClick={HandleValid}
                  >
                    {validation.isSubmitting ? (
                      <MoonLoader size={15} color="#fff" />
                    ) : (
                      "Valid"
                    )}
                  </button>
                  <button
                    disabled={validation.isSubmittingResend}
                    className="p-1 flex justify-center rounded-md w-full mt-2 text-sm bg-gray-400"
                    onClick={HandleResetCode}
                  >
                    {validation.isSubmittingResend ? (
                      <MoonLoader size={15} color="#000" />
                    ) : (
                      "Resend"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex justify-center">
                  <p className="bg-white px-1 absolute top-1/2 -translate-y-1/2 pb-1">
                    or
                  </p>
                  <div className="w-full bg-gray-400 h-0.5 my-4" />
                </div>
                <button
                  className="p-1 rounded-md text-white w-full bg-gray-500 flex items-center justify-center gap-2 text-sm"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  <FaGoogle />
                  Sign up with google
                </button>
              </>
            )}

            <div className="text-sm text-gray-400">
              {dialog === "Sign up"
                ? "already have an account?! "
                : "don't have an account?! "}
              <button
                className="text-gray-600 underline"
                onClick={() => {
                  resetForm();
                  setDialog((prev) =>
                    prev === "Sign up" ? "Log in" : "Sign up"
                  );
                }}
              >
                {dialog === "Sign up" ? "Log in" : "Sign up"}
              </button>
            </div>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
}

export default AuthForm;
