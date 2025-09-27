import PropTypes from "prop-types";
import { ClientCard } from './ClientCard';

export const ClientList = ({ clients, pagination }) => {
  return (
    <>
      {clients?.map((client, index) => {
        return (
          <ClientCard key={client?.id} client={client} index={index} pagination={pagination}/>
        );
      })}
    </>
  );
};

ClientList.propTypes = {
    clients: PropTypes.array,
    pagination: PropTypes.object
};
