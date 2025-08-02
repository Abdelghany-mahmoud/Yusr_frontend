import { useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { MdOutlineNoteAdd } from "react-icons/md";
import { Modal, Loading, TextArea } from "../../../../components";
import { useGetData } from "../../../../hooks/useGetData";
import { useMutate } from "../../../../hooks/useMatute";
import { SingleSelectionField } from "../../../../components/InputField/SingleSelectionField";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";
import { useRecoilState } from "recoil";
import { useSendToWhatsapp } from "./../../../../hooks/useSendToWhatsapp";
import { toast } from "react-toastify";

function NoteForSpecificClient({ customer, transaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState("role"); // 'role' or 'user'
  const [page, setPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [token] = useRecoilState(tokenAtom);
  const { t } = useTranslation("layout");
  const { mutate: sendWhatsapp } = useSendToWhatsapp();

  const { data: roles, isLoading: rolesLoading } = useGetData({
    endpoint: "roles",
    queryKey: ["roles"],
    // enabledKey: token?.user?.roles[0]?.name === "SuperAdmin",
  });

  const { data: officersData, isLoading: officersLoading } = useGetData({
    endpoint: `users?role=${selectedRole}&page=${page}`,
    queryKey: ["officers", page, selectedRole],
    enabledKey: !!selectedRole,
  });

  const rolesOptions = useMemo(() => {
    return (roles?.data || []).filter(
      (role) => role.name !== "Client" && role.name !== "SuperAdmin"
    );
  }, [roles, selectedRole]);

  const officersOptions = useMemo(
    () => officersData?.data?.data || [],
    [officersData, selectedRole]
  );

  const { mutate, isPending } = useMutate({
    endpoint: "notes",
    method: "post",
    onSuccess: () => setIsOpen(false),
  });

  const initialValues = {
    note: "",
    role: "",
    receiver_id: customer?.user && tab == "user" ? customer?.user?.id : "",
  };

  const validationSchema = Yup.object().shape({
    note: Yup.string().required(t("required")),
    ...(tab === "role"
      ? {
        role: Yup.object({
          value: Yup.string().required(t("required")),
          label: Yup.string().required(),
        }).required(t("required")),
      }
      : {
        receiver_id: Yup.string(),
      }),
  });

  const handleSubmit = (values, { resetForm }) => {
    const payload = {
      ...(tab === "role"
        ? {
          receiver_id: values.receiver_id?.value,
          note: `${values.note} بخصوص عميل ${transaction?.client?.user?.name}`,
          transaction_id: transaction?.id,
        }
        : {
          receiver_id: customer?.user?.id,
          note: values.note,
          transaction_id: transaction?.id,
        }),
    };

    mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        resetForm();
        sendWhatsapp(
          {
            user_id:
              tab === "role" ? values.receiver_id?.value : customer?.user?.id,
            message: transaction?.id
              ? `${values.note} \n بخصوص معاملة رقم: ${transaction?.id}`
              : `${values.note} \n بخصوص عميل رقم هويه:   : ${customer?.national_id}`,
          },
          {
            onSuccess: (data) => {
              toast.success(data?.message);
            },
            onError: (error) => {
              toast.error(error?.response?.data?.message);
            },
          }
        );
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("add_note")}
        >
          <MdOutlineNoteAdd />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[650px] w-full p-3"
      title={t("add_note")}
    >
      <div className="mb-4 flex border-b">
        <button
          className={`px-4 py-2 font-medium ${tab === "role" ? "border-b-2 border-blue-500" : ""
            }`}
          onClick={() => setTab("role")}
        >
          {t("to_role")}
        </button>
        <button
          className={`px-4 py-2 font-medium ${tab === "user" ? "border-b-2 border-blue-500" : ""
            }`}
          onClick={() => setTab("user")}
        >
          {t("to_user")}
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
        validate={(values) => {
          try {
            validationSchema.validateSync(values, { abortEarly: false });
          } catch (err) {
            if (err.inner) {
              const validationErrors = err.inner.reduce((acc, curr) => {
                acc[curr.path] = curr.message;
                return acc;
              }, {});
              console.error("Formik validation errors:", validationErrors);
              return validationErrors;
            }
          }
        }}
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
          isSubmitting,
        }) => {
          // Sync role selection to trigger user fetching
          useEffect(() => {
            if (tab === "role" && values?.role?.value) {
              setSelectedRole(values.role?.name);
            }
          }, [values.role, tab]);

          return (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "role" && (
                <>
                  <SingleSelectionField
                    name="role"
                    label={t("role")}
                    value={values.role}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    options={rolesOptions.map((role) => ({
                      value: role.id,
                      name: role?.name,
                      label: t(role.name),
                    }))}
                    isLoading={rolesLoading}
                    totalPages={1}
                    error={touched.role && errors.role}
                  />
                  <SingleSelectionField
                    name="receiver_id"
                    label={t("officer")}
                    value={values.receiver_id}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    options={officersOptions.map((user) => ({
                      value: user.id,
                      label: user.name,
                    }))}
                    isLoading={officersLoading}
                    currentPage={page}
                    onPageChange={setPage}
                    totalPages={officersData?.data?.last_page}
                    error={touched.receiver_id && errors.receiver_id}
                    disabled={!selectedRole}
                  />
                </>
              )}

              <TextArea
                name="note"
                label={t("note")}
                value={values.note}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.note && errors.note}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    isPending || isSubmitting || rolesLoading || officersLoading
                  }
                >
                  {isPending ? <Loading size="sm" /> : t("add_note")}
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default NoteForSpecificClient;
