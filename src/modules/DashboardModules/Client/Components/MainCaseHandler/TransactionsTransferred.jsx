import { useTranslation } from "react-i18next";
import { useGetData } from "../../../../../hooks/useGetData";
import {
  Error,
  IsEmpty,
  Loading,
  PageTitle,
  Pagination,
  Table,
} from "../../../../../components";
import { ClientList } from "../ClientList";

function TransactionsTransferred() {
  const { data, isLoading, isError, error } = useGetData({
    endpoint: `clients-for-authenticated-user`,
    queryKey: ["transaction-transferred"],
  });
  const { t } = useTranslation("layout");

  const tableHead = [
    "#",
    t("name"),
    t("country_code"),
    t("phone"),
    t("email"),
    t("address"),
    t("gender"),
    t("type"),
    t("job"),
    t("national_id"),
    t("actions"),
  ];

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }
  return (
    <div>
      <PageTitle title={t("clients")} />

      {isLoading ? (
        <Loading />
      ) : data?.data?.data?.length === 0 ? (
        <IsEmpty text={t("clients")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={<ClientList clients={data?.data?.data} />}
          />
          <Pagination totalPages={data?.data?.last_page} />
        </div>
      )}
    </div>
  );
}

export default TransactionsTransferred;
