import * as Yup from "yup";
export const validationNotification = (lang = "ar") =>
  Yup.object().shape({
    title: Yup.string()
      .min(
        3,
        lang === "ar"
          ? "العنوان لازم يكون على الأقل 3 حروف"
          : "Title must be at least 3 characters"
      )
      .max(
        50,
        lang === "ar"
          ? "العنوان لا يمكن أن يتجاوز 50 حرفًا"
          : "Title cannot exceed 50 characters"
      )
      .required(lang === "ar" ? "العنوان مطلوب" : "Title is required"),

    message: Yup.string()
      .min(
        10,
        lang === "ar"
          ? "الرسالة لازم تكون على الأقل 10 حروف"
          : "Message must be at least 10 characters"
      )
      .max(
        500,
        lang === "ar"
          ? "الرسالة لا يمكن أن تتجاوز 500 حرف"
          : "Message cannot exceed 500 characters"
      )
      .required(lang === "ar" ? "الرسالة مطلوبة" : "Message is required"),
  });
