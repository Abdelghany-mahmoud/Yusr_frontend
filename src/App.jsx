import { RouterProvider } from "react-router-dom";
import { Routes } from "./Config/routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue } from "recoil";
import { languageState } from "./store/langAtom/languageAtom";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
function App() {
  const lang = useRecoilValue(languageState);
  useEffect(() => {
    if (lang) {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={Routes} />
      <ToastContainer autoClose={3000} />
    </QueryClientProvider>
  );
}

export default App;
