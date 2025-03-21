"use client";
import { FaGoogle } from "react-icons/fa";
import { useFormik } from "formik";
import { LoginSchema } from "@Schemas/UerSchema";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { FaUser } from "react-icons/fa";

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
      if (result?.error) {
        setSubmitting(false);
        const error = JSON.parse(result.error);
        setErrors(error);
        return;
      }
      replace("/");
    },
  });

  return (
    <main className="md:w-[25rem] w-full p-6 bg-primary-1 rounded-lg ">
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="text-xl font-bold">Log in</h2>
        <h3 className="text-gray-400 text-sm font-semibold">
          Please enter your details
        </h3>
        <label className="block text-sm text-gray-300">Email</label>
        <input
          className={`p-3 border border-[#979aa8] rounded-md text-black w-full 
            ${
              touched.email && errors.email
                ? "outline outline-2 outline-red-500"
                : "focus:outline-none"
            }
            `}
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
               touched.password && errors.password
                 ? "outline outline-2 outline-red-500"
                 : "focus:outline-none"
             }
          `}
          type="password"
          id="password"
          {...getFieldProps("password")}
        />
        <p
          className={`text-xs text-red-400 ${
            touched.password && errors.password ? "visible" : "invisible"
          }`}
        >
          {errors.password} !
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`p-3 flex items-center justify-center gap-2 rounded-md w-full mt-2 text-sm font-medium transition-colors duration-200 ${
            isSubmitting ? "bg-gray-400" : "bg-secondary-2 hover:bg-secondary-3"
          }`}
        >
          {isSubmitting ? <MoonLoader size={18} color="#fff" /> : "Log in"}
        </button>
      </form>

      <div className="relative flex justify-center mt-4">
        <p className="bg-primary-1 px-2 absolute top-1/2 -translate-y-1/2">
          or
        </p>
        <div className="w-full bg-gray-400 h-0.5 my-4" />
      </div>

      <button
        className="mb-2 p-3 rounded-md w-full bg-gray-600 hover:bg-gray-800 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200"
        onClick={async () => {
          const result = await signIn("credentials", {
            redirect: false,
            email: "guest@gmail.com",
            password: "guestPassword",
          });
          if (!result?.error) replace("/");
        }}
      >
        <FaUser /> Guest
      </button>
      <button
        className="p-3 rounded-md w-full bg-gray-600 hover:bg-gray-800 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-200"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <FaGoogle /> Log in with Google
      </button>

      <div className="text-sm text-gray-300 mt-4 text-center">
        {"Don't have an account? "}
        <Link href="/signup" className="text-white font-semibold underline">
          Sign up
        </Link>
      </div>
    </main>
  );
}

export default Login;
