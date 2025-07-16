// export const base_url = import.meta.env.VITE_API_URL;
export const base_url =  import.meta.env.VITE_API_URL || window?.ENV?.VITE_API_URL ;
console.log("🚀 ~ window?.ENV?.VITE_API_URL:", window?.ENV?.VITE_API_URL)
console.log("🚀 ~ import.meta.env.VITE_API_UR:", import.meta.env.VITE_API_URL)
console.log("🚀 ~ base_url:", base_url)
