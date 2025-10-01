import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ShowClient from "./ShowClient";
import UpdateClient from "./UpdateClient";
import { DeleteGlobal } from "../../../../components";
import ActivityLog from "./ActivityLog";
import ClientTransaction from "./ClientTransaction";
import AddDocs from "./ClientDocs/AddDocs";
// import Transactions from "./transactions/Transactions";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { format } from "date-fns";
import ClientStatus from "./ClientStatus";
import { useHasPermission } from "../../../../hooks/useHasPermission";
import { useState } from "react";
import TransactionDetails from "../../transactions/TransactionDetails";
import { Link } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";

export const ClientCard = ({ client, index, pagination }) => {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const canUpdateClients = useHasPermission("update-clients");
  const canDeleteClients = useHasPermission("delete-clients");
  const canUpdateStatus = useHasPermission("update-statuses");
  const canCreateDocuments = useHasPermission("create-documents");
  // const canViewTransactions = useHasPermission("read-transactions");
  const canViewActivities = useHasPermission("read-activities");
  const [selected, setSelected] = useState(null);
  const isLegalSupervisor = token?.user?.roles.map((role) => role.name).includes("legal_supervisor");
  return (
    <tr
      key={client.id}
      className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
    >
      <td className="p-3 max-w-2">{(pagination?.from || 0) + index}</td>
      <td className="p-3 max-w-2">#{client.transaction.transaction_code}</td>
      <td className="p-3">{client?.name || client?.user?.name || "-"}</td>
      <td className="p-3"> {format(client?.created_at, "yyyy-MM-dd hh:mm") || "-"} </td>
      <td className="p-3 flex items-center gap-2">
        {client?.user?.phone ? (
          <>
            <span>{client.user.phone}</span>
            <a
              href={`https://wa.me/${client.user.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-600"
            >
              <FaWhatsapp size={20} />
            </a>
          </>
        ) : (
          "-"
        )}
      </td>
      {client.financing_type && (<td className="p-3">{t(client?.financing_type || "-")}</td>)}
      <td className="p-3"> {canUpdateStatus && (<ClientStatus clientId={client.id} clientStatus={t(client?.status?.name)} />)} </td>

      <td className="flex gap-2 items-center justify-center p-3 mt-2">
        {
          (
            <>
              {" "}
              <ShowClient client={client} />
              {canUpdateClients && <UpdateClient client={client} />}
              {<ClientTransaction client={client} />}
              {/* {canViewTransactions && <Transactions id={client.user.id} />} */}
              <Link to={`/dashboard/chats/${client?.id}`}>
                <button
                  type="button"
                  className={"btn text-xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-gray-300 hover:scale-[1.07] btn-sm flex items-center justify-center"}
                >
                  <div
                    className={"tooltip tooltip-info top"}
                    data-tip={t("chats")}
                  >
                    <FaMessage />
                  </div>
                </button>
              </Link>
              {canViewActivities && <ActivityLog client={client} />}
              {canCreateDocuments && <AddDocs client={client} />}
              {canDeleteClients && (
                <DeleteGlobal
                  endpoint={`clients/${client?.id}`}
                  queryKey="clients"
                  text={t("delete_client")}
                  tooltipText={t("delete_client")}
                  deleteTitle={t("delete_client")}
                />
              )}
              {!isLegalSupervisor && (
                <button
                  onClick={() => setSelected(client.transaction)}
                  className="btn btn-info btn-sm"
                >
                  {t("details")}
                </button>
              )}
              {selected && (
                <TransactionDetails
                  transaction={selected}
                  onClose={() => setSelected(null)}
                />
              )}
            </>
          )
        }
      </td>
    </tr>
  );
};

ClientCard.propTypes = {
  client: PropTypes.object,
  index: PropTypes.number,
  pagination: PropTypes.object
};
