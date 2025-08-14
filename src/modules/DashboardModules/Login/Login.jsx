import { useRecoilState, useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Formik, Form } from "formik";
import { loginValidationSchema } from "./Validation/loginValidation";
import { toast } from "react-toastify";
import { useMutate } from "../../../hooks/useMatute";
import { Button, InputField, PageTitle } from "../../../components";
import logo from "/assets/images/logo/logo.png";
import { FaRegEyeSlash } from "react-icons/fa6";
import { PiEye } from "react-icons/pi";
import { languageState } from "../../../store/langAtom/languageAtom";
import { useTranslation } from "react-i18next";
export const Login = () => {
  const param = useLocation();
  const [token, setToken] = useRecoilState(tokenAtom);
  const [showPassword, setShowPassword] = useState(false);
  const lang = useRecoilValue(languageState);
  const { t } = useTranslation("layout");
  const navigate = useNavigate();
  const { mutate, isPending } = useMutate({
    method: "POST",
    // endpoint: param?.pathname == "/admin" ? "auth/admin-login" : "auth/login",
    endpoint: "auth/login",
    queryKeysToInvalidate: ["login"],
  });

  const loginHandler = async (values) => {
    const formData = new FormData();
    formData.append("phone", values.phone);
    formData.append("password", values.password);
    mutate(formData, {
      onSuccess: async (response) => {
        toast.success(response?.message);
        setToken(response?.data);
        // console.log(response?.data, "response?.data");
        if (response?.data?.token && response?.data?.user?.roles.map((role) => role.name).includes("Client")) {
          navigate("/client");
        } else {
            navigate("/dashboard/customers");
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };

  return (
    <div
      style={{ direction: lang == "ar" ? "rtl" : "ltr" }}
      className="bg-[var(--secondary-color)] relative overflow-hidden"
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-[95%] lg:max-w-4xl bg-white shadow-lg rounded-lg p-4">
          <div className="flex justify-center mb-9">
            <PageTitle
              title={t("login")}
              alignSecondLine={"after:right-1/2 after:translate-x-1/2"}
            />
          </div>
          <div className="flex flex-col-reverse lg:flex-row items-center">
            <div className="w-full">
              <Formik
                initialValues={{ phone: "", password: "", role: "" }}
                validationSchema={loginValidationSchema(lang)}
                onSubmit={loginHandler}
              >
                <Form>
                  <div className="mb-4">
                    <InputField
                      name="phone"
                      label={t("phone")}
                      type="text"
                      placeholder={t("enter_phone")}
                    />
                  </div>

                  <div className="w-full relative mb-4">
                    <InputField
                      name={"password"}
                      label={t("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("enter_password")}
                    />
                    <Button
                      className={`absolute top-9 ${
                        lang == "ar" ? "left-3" : "right-3"
                      } text-lg`}
                      type="button"
                      text={showPassword ? <PiEye /> : <FaRegEyeSlash />}
                      onClick={() => setShowPassword((priv) => !priv)}
                    />
                  </div>

                  <Button
                    text={t("login")}
                    className="w-full rounded bg-[var(--primary-color)] hover:bg-slate-900 text-white text-lg font-semibold flex items-center justify-center py-2"
                    type="submit"
                    loading={isPending}
                    disabled={isPending}
                  />
                </Form>
              </Formik>
            </div>
            <div className="flex items-center justify-center w-full md:max-w-sm">
              <div className="w-60 h-44 sm:h-auto">
                <img className="w-full" src={logo} alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
