import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout/DashboardLayout";
import { ClientLayout } from "../../layouts/ClientLayout/ClientLayout";
import { ProtectedRoute } from "../../components";
import {
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
import Clients from "../../modules/DashboardModules/Client/Clients";
import TransactionsPage from "../../modules/DashboardModules/transactions/TransactionsPage";
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
        path: "clients",
        element: <Clients />,
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
