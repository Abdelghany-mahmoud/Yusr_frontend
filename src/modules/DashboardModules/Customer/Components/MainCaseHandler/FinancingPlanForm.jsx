import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  InputField,
  TextArea,
  SwitchField,
  Loading,
  Button,
} from "../../../../../components";
import { useMemo, useState } from "react";
import { SingleSelectionField } from "../../../../../components/InputField/SingleSelectionField";
import { useGetData } from "../../../../../hooks/useGetData";
import { statusOptions } from "../../../../../constant/status";
import PropTypes from "prop-types";
import SolutionsForm from "./SolutionsForm";

function FinancingPlanForm({ onSubmit, isPending, transaction }) {
  const [page, setPage] = useState(1);
  const { t } = useTranslation("layout");
  const isEvaluationAssign = transaction?.isEvaluationAssign;

  const initialValues = {
    // [isEvaluationAssign ? "status " : "current_status"]: "",
    message: "",
    city: transaction?.financial_evaluation?.city || "",
    netSalary: transaction?.financial_evaluation?.netSalary || "",
    currentBank: transaction?.financial_evaluation?.currentBank || "",
    employer: transaction?.financial_evaluation?.employer || "",
    rank: transaction?.financial_evaluation?.rank || "",
    dateOfBirth: transaction?.financial_evaluation?.dateOfBirth || "",
    paymentAmount: transaction?.financial_evaluation?.paymentAmount || "",
    interestRate: transaction?.financial_evaluation?.interestRate || "",
    interestAmount: transaction?.financial_evaluation?.interestAmount || "",
    procedureAmount: transaction?.financial_evaluation?.procedureAmount || "",
    tradingAmount: transaction?.financial_evaluation?.tradingAmount || "",
    tax: transaction?.financial_evaluation?.tax || "",
    totalProfit: transaction?.financial_evaluation?.totalProfit || "",
    totalDue: transaction?.financial_evaluation?.totalDue || "",
    realEstateFundLoan:
      transaction?.financial_evaluation?.realEstateFundLoan || "",
    realEstateLoan: transaction?.financial_evaluation?.realEstateLoan || "",
    personalLoan: transaction?.financial_evaluation?.personalLoan || "",
    totalDebt: transaction?.financial_evaluation?.totalDebt || "",
    evaluationNotes: transaction?.financial_evaluation?.evaluationNotes || "",
    hasViolations: Number(!!transaction?.financial_evaluation?.hasViolations),
    solutions: transaction?.financial_evaluation?.solutions || [],
  };

  const validationSchema = Yup.object({
    [isEvaluationAssign ? "status" : "current_status"]: Yup.object()
      .shape({
        value: Yup.string().required(),
        label: Yup.string(),
      })
      .required(t("required")),

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

  const { data: officersData, isLoading: officersLoading } = useGetData({
    endpoint: `users?role=Financial Officer&page=${page}`,
    queryKey: ["Financial-Officer", page],
  });

  const officersOptions = useMemo(
    () => officersData?.data?.data || [],
    [officersData]
  );
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
        isValid,
        setFieldTouched,
      }) => (
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <InputField
              label={t("city")}
              name="city"
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
              value={values.currentBank}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.currentBank && errors.currentBank}
            />
            <InputField
              label={t("employer")}
              name="employer"
              value={values.employer}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.employer && errors.employer}
            />
            <InputField
              label={t("rank")}
              name="rank"
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
            name={isEvaluationAssign ? "status" : "current_status"}
            label={t("status")}
            value={values[isEvaluationAssign ? "status" : "current_status"]}
            onChange={handleChange}
            onBlur={handleBlur}
            options={statusOptions?.map((status) => ({
              value: status.id,
              label: t(status.name),
            }))}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            totalPages={1}
            error={
              touched[isEvaluationAssign ? "status" : "current_status"] &&
              errors[isEvaluationAssign ? "status" : "current_status"]
            }
          />

          {values[isEvaluationAssign ? "status" : "current_status"]?.value ===
            "Cancelled" && (
              <TextArea
                label={t("reason")}
                name="message"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && errors.message}
              />
            )}

          {!isEvaluationAssign && (
            <SingleSelectionField
              name="financialOfficer"
              label={t("financial_officer")}
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
              error={touched.financialOfficer && errors.financialOfficer}
              disabled={!officersData}
            />
          )}

          <SolutionsForm
            solutions={values.solutions}
            setSolutions={(newSolutions) => setFieldValue("solutions", newSolutions)}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              text={isPending ? <Loading /> : t("submit")}
              disabled={isPending || !isValid}
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
    isEvaluationAssign: PropTypes.bool,
    financial_evaluation: PropTypes.shape({
      city: PropTypes.string,
      netSalary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      currentBank: PropTypes.string,
      employer: PropTypes.string,
      rank: PropTypes.string,
      dateOfBirth: PropTypes.string,
      paymentAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      interestRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      interestAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      procedureAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      tradingAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalProfit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalDue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      realEstateFundLoan: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      realEstateLoan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      personalLoan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      totalDebt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      evaluationNotes: PropTypes.string,
      hasViolations: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      solutions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          entity_name: PropTypes.string,
          real_estate_financing: PropTypes.number,
          personal_financing_balance: PropTypes.number,
          other_financing: PropTypes.number,
          duration: PropTypes.number,
          annual_rate: PropTypes.number,
          bank_offer: PropTypes.string,
          monthly_installment: PropTypes.number,
          second_installment: PropTypes.number,
          client_balance: PropTypes.number,
          transaction_duration: PropTypes.number,
          notes: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
};

export default FinancingPlanForm;
