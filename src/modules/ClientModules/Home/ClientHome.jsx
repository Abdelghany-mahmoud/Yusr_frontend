import { useTranslation } from "react-i18next";
import { PageTitle } from "../../../components";
import { useGetData } from "../../../hooks/useGetData";
import TransactionProgress from "./Components/TransactionProgress";
import { dateFormatHandler } from "../../../Helpers/Helpers";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useRecoilValue } from "recoil";

function ClientHome() {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;

  const { data: transactions, isLoading } = useGetData({
    endpoint: `transactions?client_id=${userId}`,
    queryKey: ["client-transactions"],
  });

  return (
    <div className="space-y-6">
      <PageTitle title={t("welcome")} />

      {isLoading ? (
        <div className="animate-pulse bg-white rounded-lg shadow p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      ) : transactions?.data?.data?.length > 0 ? (
        transactions.data.data.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-lg shadow p-6 space-y-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  {t("transaction")} #{transaction.id}
                </h2>
                <p className="text-gray-600">
                  {t("created_at")}: {dateFormatHandler(transaction.created_at)}
                </p>
                <p className="text-gray-600">
                  {t("current_status")}:
                  <span className="font-medium">
                    {t(transaction.current_status)}
                  </span>
                </p>
              </div>
              {transaction.estimation_days && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {t("estimated_days")}:
                  </p>
                  <p className="text-lg font-semibold">
                    {transaction.estimation_days} {t("days")}
                  </p>
                </div>
              )}
            </div>

            <TransactionProgress transaction={transaction} userId={userId} />
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">{t("no_transactions")}</p>
        </div>
      )}
    </div>
  );
}

export default ClientHome;
