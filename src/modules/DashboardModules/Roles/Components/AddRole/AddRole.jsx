import { useTranslation } from "react-i18next";
import { useMutate } from "../../../../../hooks/useMatute";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../../../components";
import { RoleForm } from "../RoleForm/RoleForm";

export const AddRole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const initialValues = { name: "" };

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "roles",
    queryKeysToInvalidate: ["roles"],
  });

  const AddRoleHandler = async (values, { resetForm, setSubmitting }) => {
    mutate(values, {
      onSuccess: (response) => {
        toast.success(response?.message);
        resetForm();
        setSubmitting(false);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={t("add_new_role")}
      btnClassName={`text-base btn bg-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)]  border-none `}
      classNameModalStyle={"max-w-[450px] w-full p-3"}
    >
      <div>
        <h2 className="text-center text-2xl mb-3">{t("add_new_role")}</h2>
        <RoleForm
          initialValues={initialValues}
          isPending={isPending}
          btnTextSubmit={t("add_new_role")}
          onSubmit={AddRoleHandler}
        />
      </div>
    </Modal>
  );
};
