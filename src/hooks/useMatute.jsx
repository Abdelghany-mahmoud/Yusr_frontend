import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAxios } from "../Config/axiosConfig/axiosConfig";

export const useMutate = ({ method, endpoint, queryKeysToInvalidate = [] }) => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (body) => {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data: body,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeysToInvalidate);
    },
  });

  return mutation;
};
