import PropTypes from "prop-types";
import { TransactionCard } from "./TransactionCard";

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
  id: PropTypes.string,
  page: PropTypes.number,
  refetch: PropTypes.func,
};
