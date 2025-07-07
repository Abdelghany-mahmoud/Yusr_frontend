import { useTranslation } from "react-i18next";
import { useGetData } from "../../../hooks/useGetData";
import { Error, IsEmpty, Loading, PageTitle } from "../../../components";
import { RoleList } from "./Components/RoleList/RoleList";
// import { AddRole } from "./Components/AddRole/AddRole";

export const Roles = () => {
  const { t } = useTranslation("layout");
  const { data, isLoading, isError, error } = useGetData({
    endpoint: `roles`,
    queryKey: ["roles"],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-flex flex-col gap-6 md:flex-row">
        <PageTitle title={t("roles")} />
        {/* <AddRole /> */}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data?.data?.length == 0 ? (
            <IsEmpty text={t("quotes")} />
          ) : (
            <div className="section-padding">
              <RoleList roles={data?.data} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
