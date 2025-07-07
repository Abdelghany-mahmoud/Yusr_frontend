import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../Config/axiosConfig/axiosConfig";

export const useGetData = ({ endpoint, queryKey, enabledKey = true }) => {
  const axiosInstance = useAxios();

  const query = useQuery({
    queryKey,
    enabled: !!enabledKey,
    queryFn: async () => {
      const response = await axiosInstance.get(endpoint);
      return response.data;
    },
  });

  return { ...query };
};
