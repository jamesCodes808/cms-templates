import * as Yup from "yup";

let ValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Must contain at least 2 characters")
    .max(100, "Must be shorter than 100 characters"),
  description: Yup.string()
    .min(2, "Must contain at least 2 characters")
    .max(200, "Must be shorter than 200 characters")
    .required("Must enter a description"),
  primaryImage: Yup.string()
    .url("Must be an actual image")
    .min(2, "Must contain at least 2 characters")
    .max(255, "Must be shorter than 255 characters")
    .required("Must enter a primary image")
});

export { ValidationSchema };
