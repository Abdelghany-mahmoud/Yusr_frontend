import { useEffect, useState } from "react";
import { Loading, Modal } from "../../../../components";
import { useTranslation } from "react-i18next";
import { MdAutorenew } from "react-icons/md";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { useRecoilState } from "recoil";
import { useGetData } from "../../../../hooks/useGetData";
import { useMutate } from "../../../../hooks/useMatute";
import { Button } from "../../../../components"; // adjust path if needed
import { roleNameToFieldId } from "../../../../Helpers/Helpers";
import { toast } from "react-toastify";

function AutoTransaction({ customer, transaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [token] = useRecoilState(tokenAtom);
  const [transferTo, setTransferTo] = useState("");
  const roleNameToId = roleNameToFieldId(token?.user?.roles?.[0]?.name);

  useEffect(() => {
    const role = token?.user?.roles?.[0]?.name;
    if (role === "Frontline Liaison Officer") {
      setTransferTo("main_case_handler_id");
    } else if (role === "Main Case Handler") {
      setTransferTo("financial_officer_id");
    } else if (role === "Financial Officer") {
      setTransferTo("bank_liaison_officer_id");
    }
    // else if (role === "Executive Director") {
    //   setTransferTo("legal_supervisor_id");
    // } else if (role === "Legal Supervisor") {
    //   setTransferTo("quality_assurance_officer_id");
    // } else if (role === "Quality Assurance Officer") {
    //   setTransferTo("bank_liaison_officer_id");
    // }
  }, [token]);

  const { data, isLoading } = useGetData({
    endpoint: `transactions/available-users/${transferTo}`,
    queryKey: [`available-users-${customer?.user_id}`],
    enabledKey: isOpen,
  });

  const { mutate, isPending } = useMutate({
    endpoint: transaction
      ? `transactions/update/${transaction?.id}`
      : "transactions",
    method: "post",
    onSuccess: () => setIsOpen(false),
  });

  const handleTransfer = () => {
    mutate(
      {
        client_id: customer?.id,
        current_status: "Approved",
        [transferTo]: data?.data?.user?.id,
      },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          toast.success(data?.message);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message);
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("auto_transaction")}
        >
          <MdAutorenew />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("transactions")}
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      {isLoading ? (
        <div className="text-center py-4">{<Loading />}</div>
      ) : data?.data?.user ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">
              {t("transfer_to")} {data?.data?.user?.name}
            </h2>
            <p className="text-sm text-gray">
              {t("pending_transactions")}:{" "}
              <span className="font-medium">
                {data?.data?.pending_transactions}
              </span>
            </p>
          </div>
        </div>
      ) : (
        data?.data?.pending_transactions && (
          <div className="text-center text-gray-500">
            {t("no_data_available")}
          </div>
        )
      )}
      {customer?.transactions_count == 0 && (
        <div className="text-center text-gray-500">
          {t("create_transaction")}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          text={t("cancel")}
          onClick={() => setIsOpen(false)}
          className="bg-gray-100 text-gray-800 px-4 py-2 text-sm"
        />
        <Button
          text={t("transfer")}
          onClick={handleTransfer}
          loading={isPending}
          className="bg-[var(--primary-color)] text-white px-4 py-2 text-sm"
        />
      </div>
    </Modal>
  );
}

export default AutoTransaction;
