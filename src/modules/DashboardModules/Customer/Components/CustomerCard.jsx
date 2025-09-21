import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ShowCustomer from "./ShowCustomer";
import UpdateCustomer from "./UpdateCustomer";
import { DeleteGlobal } from "../../../../components";
import ActivityLog from "./ActivityLog";
import CustomerTransaction from "./CustomerTransaction";
import AddDocs from "./ClientDocs/AddDocs";
import Transactions from "./transactions/Transactions";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { format } from "date-fns";
import CustomerStatus from "./CustomerStatus";
import { useHasPermission } from "../../../../hooks/useHasPermission";
import { useState } from "react";
import TransactionDetails from "../../transactions/TransactionDetails";
import { Link } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";

export const CustomerCard = ({ customer}) => {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const canUpdateClients = useHasPermission("update-clients");
  const canDeleteClients = useHasPermission("delete-clients");
  const canCreateStatus = useHasPermission("create-status");
  const canUpdateStatus = useHasPermission("update-status");
  const canCreateDocuments = useHasPermission("create-documents");
  const canViewTransactions = useHasPermission("read-transactions");
  const userRoles = token?.user?.roles.map((role) => role.name);
  const isSuperAdmin = userRoles.includes("SuperAdmin");
  const isExecutiveDirector = userRoles.includes("Executive Director");
  const [selected, setSelected] = useState(null);
  const isLegalSupervisor = token?.user?.roles.map((role) => role.name).includes("Legal Supervisor");
  return (
    <tr
      key={customer.id}
      className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
    >
      <td className="p-3 max-w-2">{customer?.id}</td>
      <td className="p-3 max-w-2">#{customer.transactions[0].transaction_code}</td>
      <td className="p-3">{customer?.name || customer?.user?.name || "-"}</td>
      <td className="p-3"> {format(customer?.created_at, "yyyy-MM-dd hh:mm") || "-"} </td>
      <td className="p-3">{`${customer?.phone || customer?.user?.phone || "-"} `}</td>
      {customer.financing_type && (<td className="p-3">{t(customer?.financing_type || "-")}</td>)}
      <td className="p-3"> {(canCreateStatus || canUpdateStatus) && (<CustomerStatus userId={customer?.user?.id} customerStatus={t(customer?.status?.name)} />)} </td>

      <td className="flex gap-2 items-center justify-center p-3 mt-2">
        {
          (
            <>
              {" "}
              <ShowCustomer customer={customer} />
              {canUpdateClients && <UpdateCustomer customer={customer} />}
              {<CustomerTransaction customer={customer} />}
              {canViewTransactions && <Transactions id={customer.user.id} />}
              <Link to={`/dashboard/chats/${customer?.id}`}>
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
              {isSuperAdmin || isExecutiveDirector && <ActivityLog customer={customer} />}
              {canCreateDocuments && <AddDocs customer={customer} />}
              {canDeleteClients && (
                <DeleteGlobal
                  endpoint={`clients/${customer?.id}`}
                  queryKey={[`customers`]}
                  text={t("delete_customer")}
                  tooltipText={t("delete_customer")}
                  deleteTitle={t("delete_customer")}
                />
              )}
              {!isLegalSupervisor && (
                <button
                  onClick={() => setSelected(customer.transactions[0])}
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

CustomerCard.propTypes = {
  customer: PropTypes.object,
  index: PropTypes.number,
};
