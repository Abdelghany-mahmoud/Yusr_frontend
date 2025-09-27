// utils/validation/createClientValidation.ts
import * as Yup from "yup";

export const createClientValidation = (lang = "ar") =>
  Yup.object().shape({
    name: Yup.string()
      .min(
        3,
        lang === "ar"
          ? "اسم المستخدم يجب أن يكون على الأقل 3 أحرف"
          : "Name must be at least 3 characters"
      )
      .required(lang === "ar" ? "اسم المستخدم مطلوب" : "Name is required"),

    email: Yup.string()
      .email(
        lang === "ar" ? "البريد الإلكتروني غير صالح" : "Invalid email format"
      )
      .required(
        lang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required"
      ),

    phone: Yup.string()
      .matches(
        /^5\d{8}$/,
        lang === "ar"
          ? "رقم الجوال السعودي يجب أن يبدأ بـ 5 ويتكون من 9 أرقام"
          : "Saudi phone must start with 5 and be 9 digits long"
      )
      .required(lang === "ar" ? "رقم الهاتف مطلوب" : "Phone is required"),

    city: Yup.string().required(
      lang === "ar" ? "المحافظة مطلوبة" : "Governorate is required"
    ),

    gender: Yup.string()
      .oneOf(
        ["male", "female"],
        lang === "ar" ? "الرجاء تحديد الجنس" : "Gender is required"
      )
      .required(lang === "ar" ? "الجنس مطلوب" : "Gender is required"),

    client_type: Yup.string().required(
      lang === "ar" ? "نوع العميل مطلوب" : "Client type is required"
    ),

    notes: Yup.string()
      .max(
        500,
        lang === "ar"
          ? "الملاحظات لا يمكن أن تتجاوز 500 حرف"
          : "Notes cannot exceed 500 characters"
      )
      .nullable(),
  });
