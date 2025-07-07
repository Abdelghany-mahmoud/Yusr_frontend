import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const useGetURLParam = () => {
  const location = useLocation();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1");
    return isNaN(page) ? 1 : page;
  }, [searchParams]);

  return { currentPage };
};
