import * as Yup from "yup";

export const loginValidationSchema = (lang = "ar") =>
  Yup.object().shape({
    phone: Yup.string()
      .required(lang === "ar" ? "رقم الهاتف مطلوب" : "Phone is required")
      .matches(
        /^[0-9]+$/,
        lang === "ar"
          ? "رقم الهاتف يجب أن يحتوي على أرقام فقط"
          : "Phone must be only digits"
      )
      .min(
        10,
        lang === "ar"
          ? "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"
          : "Phone must be at least 10 digits"
      )
      .max(
        15,
        lang === "ar"
          ? "رقم الهاتف يجب ألا يتجاوز 15 رقمًا"
          : "Phone must be at most 15 digits"
      ),
    password: Yup.string().required(
      lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
    ),
  });
