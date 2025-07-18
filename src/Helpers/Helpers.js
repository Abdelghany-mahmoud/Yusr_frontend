import { base_url } from "../constant/base_url";

export function handleImageURL(image) {
  if (!image?.includes("http")) {
    return `${base_url}${image}`.replace("/api/", "");
  } else {
    return image;
  }
}

export function sliceString(string, length, stringGreaterThan = 20) {
  if (string?.length > stringGreaterThan) {
    return `${string?.slice(0, length || 30)}...`;
  } else {
    return `${string}`;
  }
}

export const dateFormatHandler = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${year}-${month}-${day} ${String(hours).padStart(
    2,
    "0"
  )}:${minutes} ${ampm}`;
};

export function snakeToTitleCase(str) {
  return str
    .replace(/_/g, " ") // استبدال كل "_" بمسافة
    .split(" ") // تقسيم النص على المسافات
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // أول حرف كابيتال والباقي سمول
    .join(" "); // إعادة تجميع الكلمات
}
export function processRoleFields(fields) {
  return fields.map((field) => ({
    ...field,
    displayLabel: snakeToTitleCase(field.label),
  }));
}

export const roleNameToFieldId = (roleName) => {
  if (!roleName) return "";
  return (
    roleName
      .toLowerCase()
      .replace(/\s+/g, "_") + "_id"
  );
};

