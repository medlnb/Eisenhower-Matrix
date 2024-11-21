"use client";
import { FaGoogle } from "react-icons/fa";
import { useFormik } from "formik";
import { LoginSchema } from "@Schemas/UerSchema";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";

function Login() {
  const { replace } = useRouter();
  const {
    errors,
    getFieldProps,
    touched,
    handleSubmit,
    isSubmitting,
    setSubmitting,
    setErrors,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      setSubmitting(false);
      if (result?.error) {
        setErrors({ email: result?.error });
        return;
      }

      replace("/");
      return;
    },
  });

  return (
    <main className="md:w-[20rem] w-full">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold">_Log in</h2>
        <h3 className="text-gray-400 text-sm font-semibold ">
          Please enter your details
        </h3>

        <h4 className="pl-1 text-xs mt-4 text-gray-300">Email</h4>

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
          {errors.password} !
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`p-1 flex items-center justify-center gap-2 rounded-md w-full mt-2 text-sm ${
            isSubmitting ? "bg-gray-400" : "bg-secondary-2"
          }`}
        >
          {isSubmitting ? <MoonLoader size={15} color="#fff" /> : "Log in"}
        </button>
      </form>
      <div className="relative flex justify-center">
        <p className="bg-primary-1 px-1 absolute top-1/2 -translate-y-1/2 pb-1">
          or
        </p>
        <div className="w-full bg-gray-400 h-0.5 my-4" />
      </div>
      <button
        className="p-1 rounded-md w-full bg-gray-500 hover:bg-gray-700 flex items-center justify-center gap-2 text-sm"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <FaGoogle />
        Log in with google
      </button>
      <div className="text-sm text-gray-300">
        {"don't have an account?! "}
        <Link href="/signup" className="text-white font-semibold underline">
          Sign up
        </Link>
      </div>
    </main>
  );
}

export default Login;
