import { useTranslation } from "react-i18next";
import { useGetURLParam } from "../../hooks/useGetURLParam";
import { useGetData } from "../../hooks/useGetData";
import {
  Error,
  IsEmpty,
  Loading,
  PageTitle,
  Pagination,
  Table,
} from "../../components";
import { TransactionList } from "../DashboardModules/Customer/Components/transactionlist";

export const ArchiveTransactions = () => {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `transactions/showArchive?page=${currentPage}`,
    queryKey: ["archive-transactions", "transactions", currentPage],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  const tableHead = [
    "#",
    t("transaction_id"),
    t("status"),
    t("created_at"),
    t("frontline_liaison_officer"),
    t("main_case_handler"),
    t("financial_officer"),
    t("executive_director"),
    t("legal_supervisor"),
    t("quality_assurance_officer"),
    t("bank_liaison_officer"),
    t("actions"),
  ];

  return (
    <div>
      <div className="flex justify-between items-center flex-col gap-6 md:flex-row">
        <PageTitle title={t("ArchiveTransactions")} />
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data[0]?.data?.length == 0 ? (
            <IsEmpty text={t("ArchiveTransactions")} />
          ) : (
            <div className="section-padding">
              <Table
                tableHead={tableHead}
                body={
                  <TransactionList
                    transactions={data[0]?.data}
                    page={currentPage}
                  />
                }
              />
              <Pagination totalPages={data[0]?.last_page} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
