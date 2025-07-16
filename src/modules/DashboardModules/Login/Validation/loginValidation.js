import * as Yup from "yup";

export const loginValidationSchema = (lang = "ar") =>
  Yup.object().shape({
    phone: Yup.string()
      .required(lang === "ar" ? "رقم الجوال مطلوب" : "Phone number is required")
      .matches(
        /^5\d{8}$/,
        lang === "ar"
          ? "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"
          : "Phone must start with 5 and be 9 digits"
      ),
    password: Yup.string().required(
      lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required"
    ),
  });