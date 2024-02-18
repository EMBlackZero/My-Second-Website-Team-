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
import PaymentPage from "./PageAll/PaymentPage";

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
    path: "/PublicPage",
    element: <PublicPage />,
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
    path: "/PaymentPage",
    element: <PaymentPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
reportWebVitals();
