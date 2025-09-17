import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout/DashboardLayout";
import { ClientLayout } from "../../layouts/ClientLayout/ClientLayout";
import { ProtectedRoute } from "../../components";
import {
  CustomerRequests,
  DashError,
  DashHome,
  Login,
  Roles,
  BankLiaisonOfficer,
} from "../../modules/DashboardModules/index";
import {
  ClientHome,
  ClientProfile,
  ClientTransactions,
} from "../../modules/ClientModules/index";
import Customers from "../../modules/DashboardModules/Customer/Customers";
import TransactionsPage from "../../modules/DashboardModules/transactions/TransactionsPage";
import TransactionsTransferred from "../../modules/DashboardModules/Customer/Components/MainCaseHandler/TransactionsTransferred";
import Employees from "./../../modules/DashboardModules/employees/Employees";
import Statuses from "../../components/Statuses/Statuses";
import LegalTasks from "../../modules/DashboardModules/LegalTasks/LegalTasks";
import ClosedTransactions from "../../modules/DashboardModules/transactions/ClosedTransactions";
import { ArchiveLayout } from "../../layouts/ArchiveLayout/ArchiveLayout";
import { ArchiveTransactions } from "../../modules/Archive/ArchiveTransactions";
import { ChatsPage } from "../../modules/Chat/index";

export const Routes = createBrowserRouter([
  {
    path: "/client",
    errorElement: <DashError />,
    element: (
      <ProtectedRoute>
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <ClientHome />,
      },
      {
        path: "profile",
        element: <ClientProfile />,
      },
      {
        path: "transactions",
        element: <ClientTransactions />,
      },
      {
        path: "chats/:chatId?",
        element: <ChatsPage {...{ basePath: "/client" }}/>,
      },
    ],
  },
  {
    path: "/dashboard",
    errorElement: <DashError />,
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <DashHome />,
      },
      {
        path: "new-customer-requests",
        element: <CustomerRequests />,
      },
      {
        path: "Transactions-transferred",
        element: <TransactionsTransferred />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "transactions",
        element: <TransactionsPage />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
      {
        path: "employees",
        element: <Employees />,
      },
      {
        path: "statuses",
        element: <Statuses />,
      },
      {
        path: "Legal-tasks",
        element: <LegalTasks />,
      },
      {
        path: "bank-liaison-officer",
        element: <BankLiaisonOfficer />,
      },
      {
        path: "closed_transactions",
        element: <ClosedTransactions />,
      },
      {
        path: "chats/:chatId?",
        element: <ChatsPage {...{ basePath: "/dashboard" }}/>,
      },
    ],
  },
  {
    path: "archive",
    errorElement: <DashError />,
    element: (
      <ProtectedRoute>
        <ArchiveLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "transactions",
        element: <ArchiveTransactions />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
  // {
  //   path: "/admin",
  //   element: <Login />,
  // },
]);
