import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { MdSwapHoriz } from "react-icons/md";
import { Modal, Loading, DropDownMenu } from "../../../../components";
import { useGetData } from "../../../../hooks/useGetData";
import { useMutate } from "../../../../hooks/useMatute";
import { SingleSelectionField } from "../../../../components/InputField/SingleSelectionField";
import { roleFields } from "../../../../constant/clientType";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { useRecoilState } from "recoil";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

function ClientTransaction({ client }) {
  const [token] = useRecoilState(tokenAtom);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [clientPage, setClientPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const [userId] = useState(client?.id);
  const userRoles = token?.user?.roles;
  const isSuperAdmin = userRoles.includes("superAdmin");
  const isExecutiveDirector = userRoles.includes("executive_director");

  const { data: statusData } = useGetData({
    endpoint: `transactions/statuses`,
    queryKey: ["transactionStatuses"],
  });

  const transactionStatuses = statusData?.data.map((status) => ({
    value: status,
    label: t(status),
  })) || [];

  const { data: clientsData, isLoading: clientsLoading } = useGetData({
    endpoint: `clients`,
    queryKey: ["clients", clientPage],
  });

  // Fetch officers with pagination
  const { data: officersData, isLoading: officersLoading } = useGetData({
    endpoint: `employees?role=${selectedRoleDisplay}&per_page=all`,
    queryKey: ["officers", selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay,
  });

  const clientsOptions = useMemo(
    () => clientsData?.data?.data || [],
    [clientsData]
  );
  const officersOptions = useMemo(
    () => officersData?.data?.data || [],
    [officersData]
  );

  const { mutate, isPending } = useMutate({
    endpoint: `clients/transfer-client/${client?.id}`,
    method: "post",
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const initialValues = {
    client_id: userId || "",
    status: "",
    officers_id: "",
    role: null,
    ...roleFields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  };

  const validationSchema = Yup.object({
    client_id: Yup.mixed().test(
      "required-client",
      "Client is required",
      function (value) {
        return !!(client?.user?.id || value?.value);
      }
    ),
    status: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string(),
      })
      .nullable()
      .required("Status is required"),
    officers_id: Yup.object()
      .shape({
        value: Yup.number().optional(),
        label: Yup.string().optional(),
      })
      .nullable()
      .required("Officer is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const cleanedValues = {
      // client_id: userId || values.client_id?.value || "",
      status: values.status?.value,
      [selectedRole]: values.officers_id?.value ?? "",
    };

    mutate(cleanedValues, {
      onSuccess: (data) => {
        setIsOpen(false);
        resetForm();
        toast.success(data?.message);
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
          className="tooltip tooltip-info top"
          data-tip={t("transfer_client")}
        >
          <MdSwapHoriz />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[650px] w-full p-3"
    // title={t("create_transaction")}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
        }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center text-2xl">{t("transaction")}</h2>

            {/* Client Select */}
            {!client?.user?.id && (
              <SingleSelectionField
                name="client_id"
                label={t("client")}
                value={values.client_id}
                onChange={handleChange}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                onBlur={handleBlur}
                options={clientsOptions?.map((client) => ({
                  value: client.id,
                  label: client.name,
                }))}
                isLoading={clientsLoading}
                currentPage={clientPage}
                onPageChange={setClientPage}
                totalPages={clientsData?.data?.last_page}
                error={touched.client_id && errors.client_id}
              />
            )}
            {/* roles */}
            <DropDownMenu
              menuTitle={t("filter_by_role")}
              MenuIcon={<FaFilter />}
              className="px-4 py-2 rounded-md w-full"
              selectedValue={
                selectedRole
                  ? t(roleFields.find((role) => role.id === selectedRole)?.label)
                  : null
              }
            >
              <li
                onClick={() => { setSelectedRole(""); }}
                className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""}`}
              >
                {t("all")}
              </li>
              {roleFields
                .filter((role) => {
                  // Only allow specific roles if user is not SuperAdmin or executive_director
                  if (!isSuperAdmin && !isExecutiveDirector) {
                    const allowedRoles = [
                      "executive_director",
                      "legal_supervisor",
                      "quality_assurance_officer",
                      "main_case_handler",
                    ];
                    return allowedRoles.includes(role.label);
                  }
                  return role.label !== "Client";
                })
                .map((role) => (
                  <li
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setSelectedRoleDisplay(role.label);
                    }}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""
                      }`}
                  >
                    {t(role.label)}
                  </li>
                ))}
            </DropDownMenu>

            {/* Officer Select with Pagination */}
            <SingleSelectionField
              name="officers_id"
              label={t("officer")}
              value={values.officers_id}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              options={officersOptions?.map((officer) => ({
                value: officer.id,
                label: officer.name,
              }))}
              isLoading={officersLoading}
              totalPages={1}
              error={touched.officers_id && errors.officers_id}
            />
            {/* Status Select */}
            <SingleSelectionField
              name="status"
              label={t("status")}
              value={values.status.value}
              onChange={handleChange}
              onBlur={handleBlur}
              options={transactionStatuses}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              error={touched.status && errors.status}
              totalPages={1}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  isPending || clientsLoading || officersLoading
                }
              >
                {isPending ? <Loading size="w-5 h-5" /> : t("save")}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
}

export default ClientTransaction;

ClientTransaction.propTypes = {
  client: PropTypes.object.isRequired,
};