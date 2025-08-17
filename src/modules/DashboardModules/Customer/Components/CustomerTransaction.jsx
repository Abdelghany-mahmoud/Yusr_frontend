import { useMemo, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { MdSwapHoriz } from "react-icons/md";
import { Modal, Loading, DropDownMenu } from "../../../../components";
import { useGetData } from "../../../../hooks/useGetData";
import { useMutate } from "../../../../hooks/useMatute";
import { statusOptions } from "../../../../constant/status";
import { SingleSelectionField } from "../../../../components/InputField/SingleSelectionField";
import { roleFields } from "../../../../constant/customerType";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { useRecoilState } from "recoil";
import { processRoleFields } from "../../../../Helpers/Helpers";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

function CustomerTransaction({ customer }) {
  const [token, setToken] = useRecoilState(tokenAtom);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [page, setPage] = useState(1);
  const [clientPage, setClientPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const [userId, setUserId] = useState(customer?.id);
  const isSuperAdmin = token?.user?.roles[0]?.name == "SuperAdmin";
  const isExecutiveDirector = token?.user?.roles[0]?.name == "Executive Director";
  const { data: clientsData, isLoading: clientsLoading } = useGetData({
    endpoint: `users?role=Client&page=${clientPage}`,
    queryKey: ["clients", clientPage],
  });

  // Fetch officers with pagination
  const { data: officersData, isLoading: officersLoading } = useGetData({
    endpoint: `users?role=${selectedRoleDisplay}&page=${page}`,
    queryKey: ["officers", page, selectedRoleDisplay],
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
  const lastPage = officersData?.data?.last_page || 1;

  const { mutate, isPending } = useMutate({
    endpoint: `clients/transfer-client/${customer?.id}`,
    method: "post",
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const initialValues = {
    client_id: userId || "",
    current_status: "",
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
        return !!(customer?.user_id || value?.value);
      }
    ),
    current_status: Yup.object()
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
      client_id: userId || values.client_id?.value || "",
      current_status: values.current_status?.value,
      [selectedRole]: values.officers_id?.value ?? "",
    };

    // console.log(cleanedValues, "clean val");
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
      title={t("create_transaction")}
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
            {!customer?.user_id && (
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
                  ? t(
                    processRoleFields(roleFields).find(
                      (role) => role.id === selectedRole
                    )?.displayLabel
                  )
                  : null
              }
            >
              <li
                onClick = {() => { setSelectedRole(""); }}
                className = {`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""}`}
              >
                {t("all")}
              </li>
              {processRoleFields(roleFields)
                .filter((role) => {
                  // Only allow specific roles if user is not SuperAdmin or Executive Director
                  if (!isSuperAdmin && !isExecutiveDirector) {
                    const allowedRoles = [
                      "Executive Director",
                      "Legal Supervisor",
                      "Quality Assurance Officer",
                      "Main Case Handler",
                    ];
                    return allowedRoles.includes(role.displayLabel);
                  }
                  return role.displayLabel !== "Client";
                })
                .map((role) => (
                  <li
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setSelectedRoleDisplay(role.displayLabel);
                    }}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""
                      }`}
                  >
                    {t(role.displayLabel)}
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
              currentPage={page}
              onPageChange={setPage}
              totalPages={lastPage}
              error={touched.officers_id && errors.officers_id}
            />
            {/* Status Select */}
            <SingleSelectionField
              name="current_status"
              label={t("status")}
              value={values.current_status}
              onChange={handleChange}
              onBlur={handleBlur}
              options={statusOptions?.map((status) => ({
                value: status.id,
                label: t(status.name),
              }))}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              totalPages={1}
              error={touched.current_status && errors.current_status}
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

export default CustomerTransaction;
