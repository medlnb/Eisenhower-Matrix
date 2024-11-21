"use client";
import { FaGoogle } from "react-icons/fa";
import { useFormik } from "formik";
import { LoginSchema } from "@Schemas/UerSchema";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Signup() {
  const { replace } = useRouter();
  const [validation, setValidation] = useState<{
    userId?: string;
    code: string;
    isSubmitting: boolean;
    isSubmittingResend: boolean;
    errors?: string;
  }>({ code: "", isSubmitting: false, isSubmittingResend: false });

  const { errors, getFieldProps, touched, handleSubmit, setErrors } = useFormik(
    {
      initialValues: {
        email: "",
        password: "",
        name: "",
      },
      validationSchema: LoginSchema,
      onSubmit: async (values) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(values),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrors({ email: data.error });
          return;
        }

        setValidation((prev) => ({ ...prev, userId: data.userId }));
        if (data.msg) setErrors({ email: data.msg });
        return;
      },
    }
  );

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
    <main className="md:w-[20rem] w-full">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold">_Sign up</h2>
        <h3 className="text-gray-400 text-sm font-semibold ">
          Please enter your details
        </h3>
        <h4 className="pl-1 text-xs mt-4 text-gray-300">Say your name</h4>
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
        <h4 className="pl-1 text-xs text-gray-300">Email</h4>
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
        <h4 className="pl-1 text-xs text-gray-300">Password</h4>
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
          Required
          {errors.password} !
        </p>

        {!validation.userId && (
          <button
            type="submit"
            disabled={validation.isSubmitting}
            className={`bg-red-400 p-1 rounded-md w-full mt-2 text-sm ${
              validation.isSubmitting ? "bg-gray-400" : "bg-secondary-2"
            }`}
          >
            Sign up
          </button>
        )}
      </form>
      {validation.userId && (
        <>
          <h4 className="pl-1 text-xs mt-4 text-gray-300">Validation Code</h4>
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
          <div className="flex justify-between gap-2">
            <button
              disabled={validation.isSubmitting}
              className={`p-1 rounded-md w-full mt-2 text-sm ${
                validation.isSubmitting ? "bg-gray-400" : "bg-red-400"
              }`}
              onClick={HandleValid}
            >
              Valid
            </button>
            <button
              disabled={validation.isSubmittingResend}
              className={`p-1 rounded-md w-full mt-2 text-sm ${
                validation.isSubmittingResend ? "bg-gray-400" : "bg-gray-600"
              }`}
              onClick={HandleResetCode}
            >
              Resend
            </button>
          </div>
        </>
      )}

      <div className="relative flex justify-center">
        <p className="bg-primary-1 px-1 absolute top-1/2 -translate-y-1/2 pb-1">
          or
        </p>
        <div className="w-full bg-gray-400 h-0.5 my-4" />
      </div>
      <button className="p-1 rounded-md w-full bg-gray-500 flex items-center justify-center gap-2 text-sm">
        <FaGoogle />
        Sign up with google
      </button>
      <div className="text-sm text-gray-300">
        already have an account?!{" "}
        <Link href="/login" className="text-white font-semibold underline">
          Log in
        </Link>
      </div>
    </main>
  );
}

export default Signup;
