import { PageTitle } from "../../../components/PageTitle/PageTitle";
import PropTypes from "prop-types";
import { Table } from "../../../components/Table/Table";
import { useTranslation } from "react-i18next";
import { Bar, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  AlertTriangle,
  AlertCircle,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useGetData } from "../../../hooks/useGetData";

Chart.register(...registerables);

export const DashHome = () => {
  const { t } = useTranslation("layout");

  // Fetch statistics
  const {
    data: statisticsData,
    isLoading: statsLoading,
    error: statsError,
  } = useGetData({
    endpoint: "statistics",
    queryKey: ["statistics"],
  });

  // Fetch dashboard summary
  const {
    data: dashboardData,
    isLoading: dashLoading,
    error: dashError,
  } = useGetData({
    endpoint: "statistics/dashboard",
    queryKey: ["statistics-dashboard"],
  });

  if (statsLoading || dashLoading) return <div>جاري التحميل...</div>;
  if (statsError || dashError) return <div>حدث خطأ أثناء التحميل</div>;

  const stats = statisticsData?.data;
  const dash = dashboardData?.data;

  // Helper to format numbers with commas
  const formatNumber = (num) => {
    if (typeof num === "number") return num.toLocaleString("en");
    if (typeof num === "string" && !isNaN(Number(num))) return Number(num);
    return num;
  };

  // Prepare chart data for transactions by status
  const transactionStatuses = stats?.transactions?.by_status || [];
  const progressChartData = {
    labels: transactionStatuses.map((s) => t(s.status)),
    datasets: [
      {
        label: "عدد المعاملات",
        data: transactionStatuses.map((s) => s.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Example: performance chart (clients, transactions, users)
  const performanceChartData = {
    labels: ["العملاء", "المعاملات", "المستخدمين النشطين"],
    datasets: [
      {
        label: "إحصائيات عامة",
        data: [
          dash?.total_clients || 0,
          dash?.total_transactions || 0,
          dash?.active_users || 0,
        ],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div>
      <div className=" mb-3 flex justify-between items-center mb-4">
        <PageTitle title={t("الرئيسية")} />
      </div>

      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users />}
          label="عدد العملاء"
          value={formatNumber(dash?.total_clients)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="المعاملات الكلية"
          value={formatNumber(dash?.total_transactions)}
        />
        <StatCard
          icon={<XCircle />}
          label="المعاملات المعلقة"
          value={formatNumber(dash?.pending_transactions)}
        />
        <StatCard
          icon={<Clock />}
          label="المعاملات المكتملة"
          value={formatNumber(dash?.completed_transactions)}
        />
      </div>

      {/* التنبيهات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AlertCard
          type="warning"
          icon={<AlertTriangle />}
          title="المستخدمين النشطين"
          message={`${formatNumber(dash?.active_users || 0)} مستخدم`}
        />
        <AlertCard
          type="danger"
          icon={<AlertCircle />}
          title="عدد الوثائق"
          message={`${formatNumber(
            stats?.documents?.total_documents || 0
          )} وثيقة`}
        />
      </div>

      {/* المخططات البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">حالة المعاملات</h2>
          <Line data={progressChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">إحصائيات عامة</h2>
          <Bar data={performanceChartData} options={{ responsive: true }} />
        </div>
      </div>

      {/* جدول آخر المعاملات */}
      <div className="mb-5  bg-white p-4 rounded-2xl shadow mt-6">
        <div className="mb-9">
          <PageTitle title="آخر المعاملات" fontSize="text-xl" />
        </div>
        <Table
          tableHead={["العميل", "الحالة", "تاريخ الإنشاء"]}
          body={dash?.recent_transactions?.map((tx) => (
            <tr
              key={tx.id}
              className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
            >
              <td className="p-2">{tx.client?.user?.name || "-"}</td>
              <td className="p-2">{tx.status}</td>
              <td className="p-2">
                {new Date(tx.created_at).toLocaleDateString("ar-EG")}
              </td>
            </tr>
          ))}
        />
      </div>

      {/* بطاقات المستخدمين */}
      <PageTitle title="إحصائيات المستخدمين" fontSize="text-xl" />
      <div className="mt-8  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
        <StatCard
          icon={<Users />}
          label="إجمالي المستخدمين"
          value={formatNumber(stats?.users?.total_users)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="مستخدمون جدد"
          value={formatNumber(stats?.users?.new_users)}
        />
        <StatCard
          icon={<Users />}
          label="ذكور"
          value={formatNumber(stats?.users?.by_gender?.male)}
        />
        <StatCard
          icon={<Users />}
          label="إناث"
          value={formatNumber(stats?.users?.by_gender?.female)}
        />
      </div>

      <PageTitle title="توزيع المستخدمين حسب الدور" fontSize="text-xl" />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats?.users?.by_role &&
          Object.entries(stats.users.by_role).map(([role, value]) => (
            <StatCard
              key={role}
              icon={<Users />}
              label={role}
              value={formatNumber(value)}
            />
          ))}
      </div>

      {/* بطاقات العملاء */}
      <PageTitle title="إحصائيات العملاء" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
        <StatCard
          icon={<Users />}
          label="إجمالي العملاء"
          value={formatNumber(stats?.clients?.total_clients)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="عملاء جدد"
          value={formatNumber(stats?.clients?.new_clients)}
        />
        <StatCard
          icon={<Users />}
          label="ذكور"
          value={formatNumber(stats?.clients?.by_gender?.male)}
        />
        <StatCard
          icon={<Users />}
          label="إناث"
          value={formatNumber(stats?.clients?.by_gender?.female)}
        />
      </div>
      <PageTitle title="العملاء حسب التصنيف" fontSize="text-xl" />
      <div className=" mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats?.clients?.by_financing_type &&
          stats.clients.by_financing_type.map((item, idx) => (
            <StatCard
              key={idx}
              icon={<Users />}
              label={t(item.financing_type)}
              value={formatNumber(item.total)}
            />
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<CheckCircle />}
          label="عملاء لديهم قروض سابقة"
          value={formatNumber(stats?.clients?.with_previous_loans)}
        />
      </div>

      {/* بطاقات المعاملات */}
      <PageTitle title="إحصائيات المعاملات" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
        <StatCard
          icon={<CheckCircle />}
          label="إجمالي المعاملات"
          value={formatNumber(stats?.transactions?.total_transactions)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="معاملات جديدة"
          value={formatNumber(stats?.transactions?.new_transactions)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط أيام المعالجة"
          value={formatNumber(stats?.transactions?.average_processing_days)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="معاملات بتقييم مالي"
          value={formatNumber(
            stats?.transactions?.transactions_with_financial_evaluation
          )}
        />
        <StatCard
          icon={<CheckCircle />}
          label="معاملات بإيصالات دفع"
          value={formatNumber(
            stats?.transactions?.transactions_with_payment_receipts
          )}
        />
      </div>
      <PageTitle title="المعاملات حسب الموظف" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats?.transactions?.by_officer_type &&
          Object.entries(stats.transactions.by_officer_type).map(
            ([role, value]) => (
              <StatCard
                key={role}
                icon={<Users />}
                label={t(role)}
                value={formatNumber(value)}
              />
            )
          )}
      </div>

      {/* بطاقات مالية */}
      <PageTitle title="إحصائيات مالية" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
        <StatCard
          icon={<CheckCircle />}
          label="إجمالي التقييمات"
          value={formatNumber(stats?.financial?.total_evaluations)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط الراتب"
          value={formatNumber(stats?.financial?.average_salary)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط مبلغ الدفع"
          value={formatNumber(stats?.financial?.average_payment_amount)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط سعر الفائدة"
          value={formatNumber(stats?.financial?.average_interest_rate)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط إجمالي المستحق"
          value={formatNumber(stats?.financial?.average_total_due)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="مع وجود مخالفات"
          value={formatNumber(stats?.financial?.with_violations)}
        />
      </div>
      <PageTitle title="مالية حسب الحالة" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats?.financial?.by_status &&
          Object.entries(stats.financial.by_status).map(([status, value]) => (
            <StatCard
              key={status}
              icon={<CheckCircle />}
              label={t(status)}
              value={formatNumber(value)}
            />
          ))}
      </div>

      {/* بطاقات الوثائق */}
      <PageTitle title="إحصائيات الوثائق" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
        <StatCard
          icon={<CheckCircle />}
          label="إجمالي الوثائق"
          value={formatNumber(stats?.documents?.total_documents)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="وثائق جديدة"
          value={formatNumber(stats?.documents?.new_documents)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط PDF لكل عميل"
          value={formatNumber(stats?.documents?.average_pdfs_per_client)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="متوسط الصور لكل عميل"
          value={formatNumber(stats?.documents?.average_images_per_client)}
        />
        <StatCard
          icon={<CheckCircle />}
          label="عملاء لديهم وثائق"
          value={formatNumber(stats?.documents?.clients_with_documents)}
        />
      </div>

      {/* بطاقات الملاحظات */}
      {/* <PageTitle title="إحصائيات الاستفسارات" fontSize="text-xl" />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-2">
        <StatCard
          icon={<CheckCircle />}
          label="إجمالي الاستفسارات"
          value={formatNumber(stats?.notes?.total_notes)}
        />
        <StatCard
          icon={<CheckCircle />}
          label=" استفسارات جديدة"
          value={formatNumber(stats?.notes?.new_notes)}
        />
      </div> */}
      {/* <div className="mt-5">
        <PageTitle title="أكثر المرسلين نشاطاً" fontSize="text-xl" />
        <div className="mt-8">
          <Table
            tableHead={["الاسم", "عدد الاستفسارات"]}
            body={stats?.notes?.most_active_senders?.map((s, idx) => (
              <tr
                key={idx}
                className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
              >
                <td className="p-2">{s.sender?.name || s.sender_id}</td>
                <td className="p-2">{formatNumber(s.total)}</td>
              </tr>
            ))}
          />
        </div>
      </div> */}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-2xl p-4 shadow flex items-center space-x-4">
    <div className="text-primary bg-gray-100 p-2 rounded-full">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

const AlertCard = ({ type, icon, title, message }) => {
  const colorMap = {
    danger: "red",
    warning: "yellow",
  };
  const color = colorMap[type] || "gray";

  return (
    <div
      className={`bg-${color}-100 text-${color}-800 p-4 rounded-2xl flex items-center space-x-4`}
    >
      <div className={`text-${color}-600`}>{icon}</div>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
};

AlertCard.propTypes = {
  type: PropTypes.oneOf(["danger", "warning"]),
  icon: PropTypes.node,
  title: PropTypes.string,
  message: PropTypes.string,
}
