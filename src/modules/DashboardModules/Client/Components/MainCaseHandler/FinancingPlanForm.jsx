import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  InputField,
  TextArea,
  SwitchField,
  Button,
  MultipleSelectionField
} from "../../../../../components";
import { useMemo } from "react";
import { SingleSelectionField } from "../../../../../components/InputField/SingleSelectionField";
import { useGetData } from "../../../../../hooks/useGetData";
import PropTypes from "prop-types";
import RequestEvaluation from "./RequestEvaluation";

function FinancingPlanForm({ onSubmit, isPending, transaction }) {
  const { t } = useTranslation("layout");
  const is_evaluation_assign = transaction?.is_evaluation_assign;

  // Fetch transaction statuses
  const { data: statusData } = useGetData({
    endpoint: `transactions/statuses`,
    queryKey: ["transactionStatuses"],
  });

  const transactionStatuses = useMemo(() => statusData?.data || [], [statusData]);

  // Fetch financial officer
  const { data: financialOfficersData, isLoading: officersLoading } = useGetData({
    endpoint: `employees?role=financial_officer&per_page=all`,
    queryKey: ["officersOptions"],
  });

  const financialOfficersOptions = useMemo(() => financialOfficersData?.data?.data || [], [financialOfficersData]);

  // Fetch employees
  const { data: employeesResponse } = useGetData({
    endpoint: "employees?per_page=all",
    queryKey: ["employees"],
  });

  const employees = useMemo(() => employeesResponse?.data.data || [], [employeesResponse]);

  const fe = transaction?.financial_evaluation || {};
  const initialValues = {
    // cancel_reason: "",
    transaction_id: transaction?.id,
    status: { value: transaction.status, label: t(transaction.status) },
    city: fe?.city || "",
    netSalary: fe?.netSalary || "",
    currentBank: fe?.currentBank || "",
    employer: fe?.employer || "",
    rank: fe?.rank || "",
    dateOfBirth: fe?.dateOfBirth || "",
    paymentAmount: fe?.paymentAmount || "",
    interestRate: fe?.interestRate || "",
    interestAmount: fe?.interestAmount || "",
    procedureAmount: fe?.procedureAmount || "",
    tradingAmount: fe?.tradingAmount || "",
    tax: fe?.tax || "",
    totalProfit: fe?.totalProfit || "",
    totalDue: fe?.totalDue || "",
    realEstateFundLoan: fe?.realEstateFundLoan || "",
    realEstateLoan: fe?.realEstateLoan || "",
    personalLoan: fe?.personalLoan || "",
    totalDebt: fe?.totalDebt || "",
    evaluationNotes: fe?.evaluationNotes || "",
    hasViolations: Number(!!fe?.hasViolations),
    notifiedEmployees: []
  };

  const validationSchema = Yup.object({
    status: Yup.object().shape({
      value: Yup.string().required(t("required")),
      label: Yup.string(),
    }).required(t("required")),
    city: Yup.string().required(t("required")),
    netSalary: Yup.number().required(t("required")),
    currentBank: Yup.string().required(t("required")),
    employer: Yup.string().required(t("required")),
    rank: Yup.string().required(t("required")),
    dateOfBirth: Yup.date().required(t("required")),
    paymentAmount: Yup.number().required(t("required")),
    interestRate: Yup.number().required(t("required")),
    interestAmount: Yup.number().required(t("required")),
    procedureAmount: Yup.number().required(t("required")),
    tradingAmount: Yup.number().required(t("required")),
    tax: Yup.number().required(t("required")),
    totalProfit: Yup.number().required(t("required")),
    totalDue: Yup.number().required(t("required")),
    realEstateFundLoan: Yup.number().required(t("required")),
    realEstateLoan: Yup.number().required(t("required")),
    personalLoan: Yup.number().required(t("required")),
    totalDebt: Yup.number().required(t("required")),
    evaluationNotes: Yup.string().required(t("required")),
    hasViolations: Yup.boolean().required(t("required")),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
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
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="hidden"
              name="transaction_id"
              value={transaction?.id}
            />
            <InputField
              label={t("city")}
              name="city"
              type="text"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.city && errors.city}
            />
            <InputField
              label={t("net_salary")}
              name="netSalary"
              type="number"
              value={values.netSalary}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.netSalary && errors.netSalary}
            />
            <InputField
              label={t("current_bank")}
              name="currentBank"
              type="text"
              value={values.currentBank}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.currentBank && errors.currentBank}
            />
            <InputField
              label={t("employer")}
              name="employer"
              type="text"
              value={values.employer}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.employer && errors.employer}
            />
            <InputField
              label={t("rank")}
              name="rank"
              type="number"
              value={values.rank}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.rank && errors.rank}
            />
            <InputField
              label={t("date_of_birth")}
              name="dateOfBirth"
              type="date"
              value={values.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dateOfBirth && errors.dateOfBirth}
            />
            <InputField
              label={t("payment_amount")}
              name="paymentAmount"
              type="number"
              value={values.paymentAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.paymentAmount && errors.paymentAmount}
            />
            <InputField
              label={t("interest_rate")}
              name="interestRate"
              type="number"
              value={values.interestRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.interestRate && errors.interestRate}
            />
            <InputField
              label={t("interest_amount")}
              name="interestAmount"
              type="number"
              value={values.interestAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.interestAmount && errors.interestAmount}
            />
            <InputField
              label={t("procedure_amount")}
              name="procedureAmount"
              type="number"
              value={values.procedureAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.procedureAmount && errors.procedureAmount}
            />
            <InputField
              label={t("trading_amount")}
              name="tradingAmount"
              type="number"
              value={values.tradingAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.tradingAmount && errors.tradingAmount}
            />
            <InputField
              label={t("tax")}
              name="tax"
              type="number"
              value={values.tax}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.tax && errors.tax}
            />
            <InputField
              label={t("total_profit")}
              name="totalProfit"
              type="number"
              value={values.totalProfit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.totalProfit && errors.totalProfit}
            />
            <InputField
              label={t("total_due")}
              name="totalDue"
              type="number"
              value={values.totalDue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.totalDue && errors.totalDue}
            />
            <InputField
              label={t("real_estate_fund_loan")}
              name="realEstateFundLoan"
              type="number"
              value={values.realEstateFundLoan}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.realEstateFundLoan && errors.realEstateFundLoan}
            />
            <InputField
              label={t("real_estate_loan")}
              name="realEstateLoan"
              type="number"
              value={values.realEstateLoan}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.realEstateLoan && errors.realEstateLoan}
            />
            <InputField
              label={t("personal_loan")}
              name="personalLoan"
              type="number"
              value={values.personalLoan}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.personalLoan && errors.personalLoan}
            />
            <InputField
              label={t("total_debt")}
              name="totalDebt"
              type="number"
              value={values.totalDebt}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.totalDebt && errors.totalDebt}
            />
          </div>

          <div className="space-y-4">
            <TextArea
              label={t("evaluation_notes")}
              name="evaluationNotes"
              value={values.evaluationNotes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.evaluationNotes && errors.evaluationNotes}
            />
            <SwitchField
              label={t("has_violations")}
              name="hasViolations"
              checked={values.hasViolations}
              onChange={(val) => setFieldValue("hasViolations", val)}
            />
          </div>

          <SingleSelectionField
            name="status"
            label={t("status")}
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            options={transactionStatuses?.map((status) => ({
              value: status,
              label: t(status),
            }))}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            totalPages={1}
            error={touched.status && errors.status}
          />

          {values.status?.value === "cancelled"
            && (
              <TextArea
                label={t("reason")}
                name="cancel_reason"
                value={values.cancel_reason}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cancel_reason && errors.cancel_reason}
              />
            )}

          {!is_evaluation_assign && (
            <SingleSelectionField
              name="financialOfficer"
              label={t("financial_officer")}
              value={values.receiver_id}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              options={financialOfficersOptions.map((user) => ({
                value: user.id,
                label: user.name,
              }))}
              isLoading={officersLoading}
              totalPages={1}
              error={touched.financialOfficer && errors.financialOfficer}
              disabled={!financialOfficersData}
            />
          )}

          <MultipleSelectionField
            options={employees.map((emp) => ({
              value: emp.id,
              label: `${emp.name} (${emp.roles?.map(r => r).join(", ")})`,
            }))}
            values={values.notifiedEmployees?.map((id) => {
              const emp = employees.find((e) => e.id === id);
              return emp
                ? {
                  value: emp.id,
                  label: `${emp.name} (${emp.roles?.map((r) => r).join(", ")})`,
                }
                : { value: id, label: id };
            })}
            name="notifiedEmployees"
            setFieldValue={(field, selected) =>
              setFieldValue(
                "notifiedEmployees",
                selected.map((s) => Number(s.value))
              )
            }
            totalPages={1}
            label={t("notify_employees")}
          />

          <div className="flex items-center gap-4 justify-end">
            <RequestEvaluation client={transaction?.client} />

            <Button
              type="submit"
              text={t("submit")}
              disabled={isPending}
              loading={isPending}
              className="btn btn-primary"
            />
          </div>
        </form>
      )}
    </Formik>
  );
}

FinancingPlanForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
  transaction: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string,
    transaction_code: PropTypes.string,
    client: PropTypes.shape({
      id: PropTypes.number,
      user: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    is_evaluation_assign: PropTypes.bool,
    financial_evaluation: PropTypes.shape({
      city: PropTypes.string,
      netSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      currentBank: PropTypes.string,
      employer: PropTypes.string,
      rank: PropTypes.string,
      dateOfBirth: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      interestRate: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      interestAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      procedureAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.string,
      ]),
      tradingAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      tax: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      totalProfit: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      totalDue: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      realEstateFundLoan: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.string,
      ]),
      realEstateLoan: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      personalLoan: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      totalDebt: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      evaluationNotes: PropTypes.string,
      hasViolations: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    }),
  }).isRequired,
};

export default FinancingPlanForm;
