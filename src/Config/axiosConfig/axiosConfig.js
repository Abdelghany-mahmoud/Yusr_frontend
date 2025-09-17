// hooks/useAxios.js
import axios from "axios";
import { base_url } from "../../constant/base_url";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export function useAxios() {
  const token = useRecoilValue(tokenAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const navigate = useNavigate();
  const axiosInstance = useRef(null);

  if (!axiosInstance.current) {
    axiosInstance.current = axios.create({
      baseURL: base_url,
      headers: {
        Authorization: `Bearer ${token ? token.token : ""}`,
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
  }

  useEffect(() => {
    const instance = axiosInstance.current;

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("yusr");
          setToken("");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken, navigate]);

  return axiosInstance.current;
}
