import PropTypes from "prop-types";
// import { FaFemale } from "react-icons/fa";
// import { FaMale } from "react-icons/fa";
import { useTranslation } from "react-i18next";
// import SendNotificationForCustomer from "./SendNotificationForCustomer";
// import CustomerStats from "./CustomerStats";
import ShowCustomer from "./ShowCustomer";
import UpdateCustomer from "./UpdateCustomer";
import { DeleteGlobal } from "../../../../components";
import ActivityLog from "./ActivityLog";
import CustomerTransaction from "./CustomerTransaction";
// import NoteForSpecificClient from "./NoteForSpecificClient";
// import AutoTransaction from "./AutoTransaction";
// import { useLocation } from "react-router-dom";
import AddDocs from "./ClientDocs/AddDocs";
import Transactions from "./transactions/Transactions";
// import CustomerNotes from "./CustomerNotes/CustomerNotes";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { format } from "date-fns";
import CustomerStatus from "./CustomerStatus";
import { useHasPermission } from "../../../../hooks/useHasPermission";
import { useState } from "react";
import TransactionDetails from "../../transactions/TransactionDetails";
import { Link } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";

export const CustomerCard = ({ customer,/* index */ }) => {
  const { t } = useTranslation("layout");
  // const location = useLocation();
  const token = useRecoilValue(tokenAtom);
  // const userId = token?.user?.id;
  const canUpdateClients = useHasPermission("update-clients");
  const canDeleteClients = useHasPermission("delete-clients");
  const canCreateStatus = useHasPermission("create-status");
  const canUpdateStatus = useHasPermission("update-status");
  const canCreateDocuments = useHasPermission("create-documents");
  // const canCreateNote = useHasPermission("create-notes");
  // const canViewNote = useHasPermission("read-notes");
  const canViewTransactions = useHasPermission("read-transactions");
  // const canCreateTransactions = useHasPermission("create-transactions");
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
      <td className="p-3">
        {format(customer?.created_at, "yyyy-MM-dd hh:mm") || "-"}
      </td>
      {/* <td className="p-3">
        {customer?.country_code || customer?.user?.country_code || "-"}
      </td> */}
      <td className="p-3">{`${customer?.phone || customer?.user?.phone || "-"
        } `}</td>
      {/* <td className="p-3">{customer?.email || customer?.user?.email || "-"}</td>
      {customer.address && <td className="p-3">{customer.address || "-"}</td>} */}
      {/* <td className="p-3">
        <div className="text-2xl flex items-center justify-center">
          {customer?.gender == "male" ? <FaMale /> : <FaFemale />}
        </div>
      </td> */}
      {customer.financing_type && (
        <td className="p-3">{t(customer?.financing_type || "-")}</td>
      )}
      <td className="p-3">
        {(canCreateStatus || canUpdateStatus) && (<CustomerStatus userId={customer?.user?.id} customerStatus={t(customer?.status?.name)} />)}
      </td>
      {/* {customer.job && <td className="p-3">{t(customer.job || "-")}</td>} */}
      {/* {customer.national_id && (
        <td className="p-3">{t(customer.national_id || "-")}</td>
      )} */}

      <td className="flex gap-2 items-center justify-center p-3 mt-2">
        {
          (
            <>
              {" "}
              <ShowCustomer customer={customer} />
              {/* {(canCreateStatus || canUpdateStatus) && (<CustomerStatus userId={customer?.user?.id} customerStatus={t(customer?.status?.name)} />)} */}
              {canUpdateClients && <UpdateCustomer customer={customer} />}
              {<CustomerTransaction customer={customer} />}
              {/* {canCreateTransactions && !isSuperAdmin && (<AutoTransaction customer={customer} />)} */}
              {canViewTransactions && <Transactions id={customer.user.id} />}
              {/* {canViewNote && (<CustomerNotes userId={userId} customer={customer.user} />)} */}
              {/* {canCreateNote && <NoteForSpecificClient client={customer} />} */}
              <Link to={`/dashboard/chats/${customer?.id}`}>
                <button
                  type="button"
                  className={"btn text-xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-gray-300 hover:scale-[1.07] btn-sm flex items-center justify-center"}
                >
                  <div
                    className={"tooltip tooltip-info top"}
                    data-tip={t("chats")}
                  >
                    <FaMessage/>
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
                  // onClick={() => // console.log(customer.transactions[0])}
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
        {/* <RejectGlobal
          endpoint="/customers"
          queryKey="customers"
          id={customer?.id}
          text={customer?.name}
          tooltipText="reject_customer"
          rejectTitle="Reject Customer"
        /> */}
      </td>
    </tr>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.object,
  index: PropTypes.number,
};
