import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IsEmpty,
  Loading,
  Modal,
  ModelPagination,
  Table,
} from "../../../../../components";
import { MdHistory } from "react-icons/md";
import PropTypes from "prop-types";
import { TransactionList } from "./TransactionList";
import { useGetURLParam } from "../../../../../hooks/useGetURLParam";
import { useGetData } from "../../../../../hooks/useGetData";

function Transactions({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const { currentPage } = useGetURLParam();
  const [page, setPage] = useState(currentPage);

  const {
    data: transactions,
    isLoading,
    refetch,
  } = useGetData({
    endpoint: `transactions?client_id=${id}&page=${page}`,
    queryKey: ["transactions", id, page],
    enabledKey: isOpen,
  });

  const tableHead = [
    "#",
    t("transaction_id"),
    t("status"),
    t("created_at"),
    t("financing_type"),
    t("name"),
    t("national_id"),
    t("phone"),
    t("actions"),
  ];

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("transactions")}
        >
          <MdHistory />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("transactions")}
      classNameModalStyle={"max-w-[90vw] w-full p-3"}
    >
      <div className="mt-4">
        {isLoading ? (
          <Loading />
        ) : transactions?.data?.data?.length === 0 ? (
          <IsEmpty text={t("no_transactions_found")} />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <Table
              tableHead={tableHead}
              body={
                <TransactionList
                  transactions={transactions?.data?.data}
                  id={id}
                  page={page}
                  refetch={refetch}
                />
              }
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ModelPagination
          totalPages={transactions?.data?.last_page}
          currentPage={page}
          onPageChange={setPage}
        />
      </div>
    </Modal>
  );
}

Transactions.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Transactions;
