"use client";
import { FaGoogle } from "react-icons/fa";
import { useFormik } from "formik";
import { SignupSchema } from "@Schemas/UerSchema";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { signIn } from "next-auth/react";

function Signup() {
  const { replace } = useRouter();
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
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();

      setErrors({ ...data });
      setSubmitting(false);
      if (res.ok) {
        setValidation((prev) => ({ ...prev, userId: data.userId }));
        return;
      }
    },
  });

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
    setValidation((prev) => ({ ...prev, isSubmitting: false }));

    return replace("/login");
  };

  const HandleResetCode = async () => {
    setValidation((prev) => ({ ...prev, isSubmittingResend: true }));
    const res = await fetch("/api/auth/emailValidation", {
      method: "PATCH",
      body: JSON.stringify({ userId: validation.userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setValidation((prev) => ({
        ...prev,
        errors: data.error,
        isSubmittingResend: false,
      }));
      return;
    }

    setValidation((prev) => ({
      ...prev,
      isSubmittingResend: false,
      errors: undefined,
    }));
    return;
  };

  return (
    <main className="md:w-[25rem] w-full p-6 bg-primary-1 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-1">
        <h2 className="text-xl font-bold">Sign up</h2>
        <h3 className="text-gray-400 text-sm font-semibold">
          Please enter your details
        </h3>

        <label className="block text-sm text-gray-300">Name</label>
        <input
          className={`p-3 border border-[#979aa8] rounded-md text-black w-full
            ${
              touched.name && errors.name
                ? "outline outline-2 outline-red-500"
                : "focus:outline-none"
            }`}
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

        <label className="block text-sm text-gray-300">Email</label>
        <input
          className={`p-3 border border-[#979aa8] rounded-md text-black w-full  
            ${
              touched.email && errors.email
                ? "outline outline-2 outline-red-500"
                : "focus:outline-none"
            }`}
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

        <label className="block text-sm text-gray-300">Password</label>
        <input
          className={`p-3 border border-[#979aa8] rounded-md text-black w-full
            ${
              touched.email && errors.email
                ? "outline outline-2 outline-red-500"
                : "focus:outline-none"
            }`}
          type="password"
          id="password"
          {...getFieldProps("password")}
        />
        <p
          className={`text-xs text-red-400 ${
            touched.password && errors.password ? "visible" : "invisible"
          }`}
        >
          Required {errors.password} !
        </p>

        {!validation.userId && (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`p-3 flex items-center justify-center gap-2 rounded-md w-full mt-2 text-sm font-medium transition-colors duration-200 ${
              isSubmitting
                ? "bg-gray-400"
                : "bg-secondary-2 hover:bg-secondary-3"
            }`}
          >
            {isSubmitting ? <MoonLoader size={18} color="#fff" /> : "Sign up"}
          </button>
        )}
      </form>

      {validation.userId && (
        <>
          <div className="w-full h-[1px] mb-4 bg-gray-600" />
          <h4 className="block text-sm text-gray-300">Validation Code</h4>
          <input
            className={`p-3 border border-[#979aa8] rounded-md text-black w-full text-center ${
              validation.errors
                ? "outline outline-2 outline-red-500"
                : "focus:outline-none"
            }`}
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
          <div className="flex justify-between gap-2">
            <button
              disabled={validation.isSubmitting}
              className="p-3 flex justify-center rounded-md w-full mt-2 text-sm font-medium bg-secondary-2"
              onClick={HandleValid}
            >
              {validation.isSubmitting ? (
                <MoonLoader size={18} color="#fff" />
              ) : (
                "Valid"
              )}
            </button>
            <button
              disabled={validation.isSubmittingResend}
              className="p-3 flex justify-center rounded-md w-full mt-2 text-sm font-medium bg-gray-400"
              onClick={HandleResetCode}
            >
              {validation.isSubmittingResend ? (
                <MoonLoader size={18} color="#000" />
              ) : (
                "Resend"
              )}
            </button>
          </div>
        </>
      )}

      <div className="relative flex justify-center mt-4">
        <p className="bg-primary-1 px-2 absolute top-1/2 -translate-y-1/2">
          or
        </p>
        <div className="w-full bg-gray-400 h-0.5 my-4" />
      </div>

      <button
        className="p-3 rounded-md w-full bg-gray-600 hover:bg-gray-800 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <FaGoogle /> Sign up with Google
      </button>

      <div className="text-sm text-gray-300 mt-4 text-center">
        {"Already have an account? "}
        <Link href="/login" className="text-white font-semibold underline">
          Log in
        </Link>
      </div>
    </main>
  );
}

export default Signup;
