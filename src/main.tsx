import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import ReportsPage from "./pages/ReportsPage";
import SpaWorkflowPage from "./pages/SpaWorkflowPage";
import TabsHistoryPage from "./pages/TabsHistoryPage";
import UnsavedFormPage from "./pages/UnsavedFormPage";

const theme = createTheme({
  palette: {
    mode: "light",
  },
  shape: {
    borderRadius: 12,
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "spa-workflow", element: <SpaWorkflowPage /> },
      { path: "tabs-history", element: <TabsHistoryPage /> },
      { path: "unsaved-form", element: <UnsavedFormPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
