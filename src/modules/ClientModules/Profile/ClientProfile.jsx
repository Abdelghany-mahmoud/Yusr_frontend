import { useTranslation } from "react-i18next";
import { Loading, PageTitle } from "../../../components";
import { useGetData } from "../../../hooks/useGetData";

function ClientProfile() {
  const { t } = useTranslation("layout");
  const { data: profile, isLoading } = useGetData({
    endpoint: "users/profile",
    queryKey: ["client-profile"],
  });

  if (isLoading) {
    return <Loading height={"100vh"} />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title={t("profile")} />
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("personal_information")}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm text-gray-500">{t("name")}</label>
                <p className="font-medium">{profile?.data?.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("email")}</label>
                <p className="font-medium">{profile?.data?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("phone")}</label>
                <p className="font-medium">
                  {profile?.data?.country_code} {profile?.data?.phone}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("gender")}</label>
                <p className="font-medium capitalize">
                  {profile?.data?.gender}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">{t("status")}</label>
                <p className="font-medium">
                  {profile?.data?.status_id === 1 ? t("active") : t("inactive")}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">
                  {t("created_at")}
                </label>
                <p className="font-medium">
                  {new Date(profile?.data?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
