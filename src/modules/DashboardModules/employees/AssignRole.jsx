import { MdAssignmentAdd } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useGetData } from "../../../hooks/useGetData";
import { useMutate } from "../../../hooks/useMutate";
import { Button, Modal, SelectField, Spinner } from "../../../components";

export const AssignRole = ({ userAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const { data, isLoading } = useGetData({
    endpoint: `roles`,
    queryKey: ["roles"],
  });

  const roleOptions = useMemo(() => {
    if (!data?.data) return [];
    return data.data
      .filter((role) => role.name !== "Client" && role.name)
      .map((role) => ({
        id: role.name,
        name: t(role.name),
      }));
  }, [data]);

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `roles/assign-role/${userAdmin?.id}`,
    queryKeysToInvalidate: ["employees"],
  });

  const assignRoleHandler = async (values, { resetForm, setSubmitting }) => {
    const formData = new FormData();

    formData.append("role", values.role);
    mutate(formData, {
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
      btnText={
        <div
          className={"tooltip tooltip-info top "}
          data-tip={t("assign_role")}
        >
          <MdAssignmentAdd />
        </div>
      }
      btnClassName={
        "btn text-2xl btn-circle bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      }
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <div>
        <h2 className="text-center text-2xl mb-3">{t("assign_role")}</h2>
        <Formik
          initialValues={{ role: userAdmin?.roles[0]?.name || "" }}
          onSubmit={assignRoleHandler}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="w-full">
                  <SelectField
                    name={"role"}
                    label={t("roles")}
                    options={roleOptions}
                    value={values?.role}
                    onChange={(e) => setFieldValue("role", e.target.value)}
                  />
                </div>
              )}

              <div className="text-white gap-2">
                <Button
                  disabled={isSubmitting || isPending}
                  type="submit"
                  className="font-semibold bg-[var(--primary-color)] w-full transition-all"
                  text={t("assign_role")}
                  loading={isSubmitting || isPending}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

AssignRole.propTypes = {
  userAdmin: PropTypes.object,
};
