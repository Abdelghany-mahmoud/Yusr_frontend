import PropTypes from "prop-types";
import { CustomerCard } from './CustomerCard';

export const CustomerList = ({ customers }) => {
  return (
    <>
      {customers?.map((customer, index) => {
        return (
          <CustomerCard key={customer?.id} customer={customer} index={index} />
        );
      })}
    </>
  );
};

CustomerList.propTypes = {
    customers: PropTypes.array,
};
