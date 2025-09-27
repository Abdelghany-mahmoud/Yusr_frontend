import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../../components";
import { useGetData } from "../../../../hooks/useGetData";
import { IoEyeOutline } from "react-icons/io5";
import { ClientDocuments } from "./ClientDocs/ClientDocuments";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { useRecoilValue } from "recoil";

function ShowClient({ client }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const token = useRecoilValue(tokenAtom);
  const isLegalSupervisor = token?.user?.roles.map((role) => role.name).includes("legal_supervisor");
  const { data, isLoading, isError, error } = useGetData({
    endpoint: `clients/${client?.id}`,
    queryKey: ["show-client", client?.id],
    enabledKey: isOpen,
  });
  const { data: clientDocs, isLoading: isClientDocsLoading } = useGetData({
    endpoint: `documents?client_id=${client?.id}?page=${page}`,
    queryKey: ["documents-client", client?.id, page],
    enabledKey: isOpen,
  });

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top"
          data-tip={isLegalSupervisor ? t("documents") : t("show_client")}
        >
          <IoEyeOutline />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[850px] w-full p-6"
      title={isLegalSupervisor ? t("documents") : t("client_details")}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center">{error?.message}</div>
      ) : (
        <div className="space-y-6">
          {!isLegalSupervisor && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t("personal_info")}
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">{t("name")}:</span>{" "}
                    {data?.data?.user?.name}
                  </p>
                  <p>
                    <span className="font-medium">{t("email")}:</span>{" "}
                    {data?.data?.user?.email}
                  </p>
                  <p>
                    <span className="font-medium">{t("phone")}:</span>{" "}
                    {data?.data?.user?.country_code}
                    {data?.data?.user?.phone}
                  </p>

                  <p>
                    <span className="font-medium">{t("national_id")}:</span>{" "}
                    {data?.data?.national_id}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t("financial_info")}
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">{t("job")}:</span>{" "}
                    {data?.data?.job}
                  </p>
                  <p>
                    <span className="font-medium">{t("work_nature")}:</span>{" "}
                    {data?.data?.work_nature}
                  </p>
                  <p>
                    <span className="font-medium">{t("salary")}:</span>{" "}
                    {data?.data?.salary}
                  </p>
                  <p>
                    <span className="font-medium">{t("financing_type")}:</span>{" "}
                    {t(data?.data?.financing_type)}
                  </p>
                  <p>
                    <span className="font-medium">{t("other_income")}:</span>{" "}
                    {data?.data?.other_income_sources}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("has_previous_loan")}:
                    </span>{" "}
                    {data?.data?.has_previous_loan ? t("yes") : t("no")}
                  </p>
                  {data?.data?.has_previous_loan && (
                    <>
                      <p>
                        <span className="font-medium">
                          {t("previous_loan_name")}:
                        </span>{" "}
                        {data?.data?.previous_loan_name}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t("previous_loan_value")}:
                        </span>{" "}
                        {data?.data?.previous_loan_value}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {data?.data?.user?.status_history?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {t("status_history")}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table w-full border">
                      <thead>
                        <tr className="text-sm bg-[var(--secondary-color)]  text-[var(--main-text-color)]">
                          <th className="px-4 py-2 text-left">{t("status")}</th>
                          <th className="px-4 py-2 text-left">
                            {t("changed_at")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.user.status_history.map((entry, idx) => (
                          <tr key={idx} className="text-sm border-t ">
                            <td className="px-4 py-2">{entry.status}</td>
                            <td className="px-4 py-2">
                              {new Date(entry.changed_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <ClientDocuments
            clientDocs={clientDocs}
            isClientDocsLoading={isClientDocsLoading}
            page={page}
            setPage={setPage}
            t={t}
          />
        </div>
      )}
    </Modal>
  );
}

export default ShowClient;

ShowClient.propTypes = {
  client: PropTypes.object,
};