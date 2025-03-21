import * as yup from "yup";

export const SignupSchema = yup.object().shape({
  name: yup.string().min(5).required("Required"),

  email: yup.string().email("Please enter a valid email").required("Required"),

  password: yup.string().min(8).required("Required"),
});

export const LoginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),

  password: yup.string().min(8).required("Required"),
});

export const UserSchema = yup.object().shape({
  name: yup.string().min(5).required("Required"),
  password: yup.string().min(8),
  newPassword: yup
    .string()
    .min(8)
    .when("password", (password, schema) =>
      password && password[0]
        ? schema.required("New password is required if password is provided")
        : // .oneOf([yup.ref("password")], "New password must match password")
          schema.notRequired()
    ),
});
