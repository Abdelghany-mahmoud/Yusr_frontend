import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Modal, Loading, DropDownMenu, TextArea } from "../../../../../components";
import { useGetData } from "../../../../../hooks/useGetData";
import { useMutate } from "../../../../../hooks/useMutate";
import { SingleSelectionField } from "../../../../../components/InputField/SingleSelectionField";
import { roleFields } from "../../../../../constant/clientType";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

function RequestEvaluation({ client }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");

  // Fetch officers
  const { data: officersData, isLoading: officersLoading } = useGetData({
    endpoint: `employees?role=${selectedRoleDisplay}&page=${page}`,
    queryKey: ["officers", page, selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay,
  });

  const officersOptions = useMemo(
    () =>
      (officersData?.data?.data || []).map((officer) => ({
        value: officer.id,
        label: officer.name,
      })),
    [officersData]
  );

  const { mutate, isPending } = useMutate({
    endpoint: `transactions/${client?.id}/request-evaluation`,
    method: "post",
    onSuccess: () => {
      setIsOpen(false);
    },
  });

  const initialValues = {
    client_id: client?.id || "",
    officers_id: null,
    notes: "",
  };

  const validationSchema = Yup.object({
    client_id: Yup.mixed().required("Client is required"),
    officers_id: Yup.object()
      .shape({
        value: Yup.number().required(),
        label: Yup.string().required(),
      })
      .nullable()
      .required("Officer is required"),
    notes: Yup.string().nullable(),
  });

  const handleSubmit = (values, { resetForm }) => {
    const cleanedValues = {
      employee_id: values.officers_id?.value ?? "",
      notes: values.notes,
    };

    mutate(cleanedValues, {
      onSuccess: (data) => {
        toast.success(data?.message);
        resetForm();
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };

  const renderRoleOptions = () =>
    roleFields.filter((role) => role.label !== "client")
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
      ));

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      // btnText={
      //   <div className="tooltip tooltip-info top" data-tip={t("request_evaluation")}>
      //     <MdSwapHoriz />
      //   </div>
      // }
      // btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      btnText={t("request_evaluation")}
      btnClassName="btn btn-black text-white"
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center text-2xl">{t("request_evaluation")}</h2>

            {/* Role filter */}
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
                onClick={() => setSelectedRole("")}
                className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""
                  }`}
              >
                {t("all")}
              </li>
              {renderRoleOptions()}
            </DropDownMenu>

            {/* Officer Select */}
            <SingleSelectionField
              name="officers_id"
              label={t("officer")}
              value={values.officers_id}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              options={officersOptions}
              isLoading={officersLoading}
              currentPage={page}
              onPageChange={setPage}
              totalPages={officersData?.data?.last_page || 1}
              error={touched.officers_id && errors.officers_id}
            />

            {/* Notes */}
            <TextArea
              label={t("notes")}
              name="notes"
              value={values.notes}
              onChange={(e) => setFieldValue("notes", e.target.value)}
              error={touched.notes && errors.notes}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending || officersLoading}
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

RequestEvaluation.propTypes = {
  client: PropTypes.object.isRequired,
};

export default RequestEvaluation;
