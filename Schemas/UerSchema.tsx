import * as yup from "yup";

export const SignupSchema = yup.object().shape({
  username: yup.string().min(5).required("Required"),

  email: yup.string().email("Please enter a valid email").required("Required"),

  password: yup.string().min(8).required("Required"),
});
export const LoginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),

  password: yup.string().min(8).required("Required"),
});
