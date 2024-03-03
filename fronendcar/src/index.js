import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateAccount from "./PageAll/CreateAccount";
import LoginForm from "./PageAll/LoginPage";
import PublicPage from "./PageAll/PublicPage";
import DetailsPage from "./PageAll/DetailsPage";
import DeletePage from "./PageAll/DeletePage"
import AdminPage from "./PageAll/AdminPage"
import AdDetailsPage from"./PageAll/AdDetailsPage"
import History from "./PageAll/History";
import PaymentPage from "./PageAll/PaymentPage"
import AdcreateCar from "./PageAll/AdcreateCar";
import AdHistory from "./PageAll/AdHistory";
import Comfirmcar1 from "./PageAll/Comfirmcar1";
import HistoryDetail from "./PageAll/HistoryDetail";
import SuccessfulPaymentPage from "./PageAll/SuccessfulPayment";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/CreateAccount",
    element: <CreateAccount />,
  },
  {
    path: "/LoginForm",
    element: <LoginForm />,
  },
  {
    path: "/DetailsPage/:id",
    element: <DetailsPage />,
  },
  {
    path: "/DeletePage",
    element: <DeletePage />,
  },
  {
    path: "/AdminPage",
    element: <AdminPage />,
  },
  {
    path: "/AdDetailsPage/:id",
    element: <AdDetailsPage />,
  },
  {
    path: "/PaymentPage/:id",
    element: <PaymentPage />,
  },
  {
    path: "/History",
    element: <History />,
  },
  {
    path: "/AdminHistory",
    element: <AdHistory />,
  },
  {
    path: "/AdcreateCar",
    element: <AdcreateCar />,
  },
  {
    path: "/Comfirmcar1/:id",
    element: <Comfirmcar1 />,
  },
  {
    path: "/Historydetail/:id",
    element: <HistoryDetail />,
  },
  {
    path: "/SuccessfulPayment/:id",
    element: <SuccessfulPaymentPage />,
  },
 
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals();
