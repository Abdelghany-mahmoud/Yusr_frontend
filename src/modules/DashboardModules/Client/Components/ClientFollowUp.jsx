import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useRef } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { MdOutlineReply } from "react-icons/md";
import { Modal, Loading, SwitchField, DropDownMenu, MultipleSelectionField } from "../../../../components";
import { useGetData } from "../../../../hooks/useGetData";
import { useMutate } from "../../../../hooks/useMutate";
import { roleFields } from "../../../../constant/clientType";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { useRecoilState } from "recoil";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

function ClientFollowUp({ client }) {
  const [token] = useRecoilState(tokenAtom);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const [isFollowUpActive, setIsFollowUpActive] = useState(client?.follow_up_active === 1);
  const [userId] = useState(client?.id);
  const userRoles = token?.user?.roles;
  const isSuperAdmin = userRoles.includes("superAdmin");
  const isExecutiveDirector = userRoles.includes("executive_director");
  const formikRef = useRef(null);

  const handleClose = (value) => {
    setIsOpen(value);
    if (value === false) {
      // reset when closing
      formikRef.current?.resetForm();
      setIsFollowUpActive(client?.follow_up_active === 1); // also reset switch state
      setSelectedRole("");
      setSelectedRoleDisplay("");
    }
  };

  const { data: officersData, isLoading: officersLoading } = useGetData({
    endpoint: `employees?role=${selectedRoleDisplay}&per_page=all`,
    queryKey: ["employees", selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay && isFollowUpActive, // only fetch if active
  });

  const officersOptions = useMemo(
    () => officersData?.data?.data || [],
    [officersData]
  );

  const { mutate, isPending } = useMutate({
    endpoint: `clients/${client?.id}/client-follow-up`,
    method: "post",
  });

  const initialValues = {
    client_id: userId || "",
    officers_id: client?.follow_up_employees?.map((u) => ({
      value: u.id,
      label: u.name,
    })) || [],
    role: null,
    ...roleFields.reduce((acc, field) => {
      acc[field.id] = "";
      return acc;
    }, {}),
  };

  const validationSchema = Yup.object({
    officers_id: isFollowUpActive
      ? Yup.array()
        .of(
          Yup.object().shape({
            value: Yup.number().required(),
            label: Yup.string().required(),
          })
        )
        .min(1, "At least one officer is required")
      : Yup.mixed().notRequired(),
  });

  const handleSubmit = (values, { resetForm }) => {
    const cleanedValues = {
      isFollowUpActive: isFollowUpActive ? 1 : 0,
      employeeIds: values.officers_id.map((o) => o.value),
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
      setIsOpen={handleClose}  // pass our handler
      btnText={
        <div
          className="tooltip tooltip-info top"
          data-tip={t("client_follow_up")}
        >
          <MdOutlineReply
            className={`${isFollowUpActive ? "text-green-500" : "text-red-500"} w-5 h-5`}
          />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[650px] h-[720px] w-full p-3"
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
        }) => (
          <>
            <h2 className="text-center text-2xl">{t("transaction")}</h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-[600px]"
            >
              {/* Form Body */}
              <div className="flex-1 overflow-y-auto space-y-4 p-2">
                {/* Toggle Follow Up */}
                <SwitchField
                  label={t("client_follow_up")}
                  name="isFollowUpActive"
                  checked={isFollowUpActive}
                  onChange={() => setIsFollowUpActive((prev) => !prev)}
                />

                {/* Roles + Officers */}
                {isFollowUpActive && (
                  <>
                    {/* Role Filter */}
                    <DropDownMenu
                      menuTitle={t("filter_by_role")}
                      MenuIcon={<FaFilter />}
                      className="px-4 py-2 rounded-md w-full"
                      selectedValue={
                        selectedRole
                          ? t(
                            roleFields.find((role) => role.id === selectedRole)?.label
                          )
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
                      {roleFields
                        .filter((role) => {
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

                    {/* Officer Multi-Select */}
                    <MultipleSelectionField
                      name="officers_id"
                      totalPages={1}
                      label={t("employees")}
                      values={values.officers_id}
                      setFieldValue={setFieldValue}
                      options={officersOptions?.map((officer) => ({
                        value: officer.id,
                        label: officer.name,
                      }))}
                      isLoading={officersLoading}
                      error={touched.officers_id && errors.officers_id}
                    />
                  </>
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isPending || officersLoading}
                >
                  {isPending ? <Loading size="w-5 h-5" /> : t("save")}
                </button>
              </div>
            </form>

          </>
        )}
      </Formik>
    </Modal>
  );
}

export default ClientFollowUp;

ClientFollowUp.propTypes = {
  client: PropTypes.object.isRequired,
};
