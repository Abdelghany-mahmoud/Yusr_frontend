import PropTypes from "prop-types";
import { TransactionCard } from "./transactioncard";

export const TransactionList = ({ transactions, id, page, refetch }) => {
  return (
    <>
      {transactions?.map((transaction, index) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          index={index}
          id={id}
          page={page}
          refetch={refetch}
        />
      ))}
    </>
  );
};

TransactionList.propTypes = {
  transactions: PropTypes.array,
  id: PropTypes.number,
  page: PropTypes.number,
  refetch: PropTypes.func,
};
