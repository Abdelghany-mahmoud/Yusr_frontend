import { useMemo, useState } from "react";
import { useMutate } from "../../../../../hooks/useMutate";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  MultipleSelectionField,
} from "../../../../../components";
import { useGetData } from "../../../../../hooks/useGetData";
import { Form, Formik } from "formik";

export const AssignPermissions = ({ role, permissionsSet = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");

  // Fetch permissions
  const { data, isLoading } = useGetData({
    endpoint: `permissions`,
    queryKey: ["permissions"],
  });

  // Mutation
  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `roles/${role?.id}/assign-permissions`,
    queryKeysToInvalidate: ["roles"],
  });

  // Helpers
  const mapPermissions = (permissions) =>
    permissions.map((permission) => ({
      value: permission.name,
      label: t(permission.name),
    }));

  // Initial values memoized
  const initialValues = useMemo(
    () => ({
      permissions: mapPermissions(permissionsSet),
    }),
    [permissionsSet, t]
  );

  // Options from API
  const permissionsOptions = useMemo(
    () => (data?.data ? mapPermissions(data.data) : []),
    [data, t]
  );

  // Submit handler
  const assignPermissionsHandler = async (values, { resetForm, setSubmitting }) => {
    const payload = values.permissions.map((p) => p.value);

    mutate(payload, {
      onSuccess: (response) => {
        toast.success(response?.message || t("success"));
        resetForm();
        setSubmitting(false);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || t("error_occurred"));
        setSubmitting(false);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={t("assign_permissions")}
      btnClassName={`text-base btn bg-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)]  border-none `}
      classNameModalStyle={"max-w-[650px] min-h-[400px] w-full p-3"}
    >
      <div>
        <h2 className="text-center text-2xl mb-3">{t("assign_permissions")}</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={assignPermissionsHandler}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="space-y-4">
              <div className="w-full">
                <MultipleSelectionField
                  isLoading={isLoading}
                  options={permissionsOptions}
                  values={values?.permissions}
                  name={"permissions"}
                  setFieldValue={setFieldValue}
                  totalPages={1}
                  label={t("select_permissions")}
                />
              </div>

              <div className="text-white gap-2">
                <Button
                  disabled={isSubmitting || isPending}
                  type="submit"
                  className="font-semibold bg-[var(--primary-color)] w-full transition-all"
                  text={t("assign_permissions")}
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

AssignPermissions.propTypes = {
  role: PropTypes.object.isRequired,
  permissionsSet: PropTypes.array,
};
