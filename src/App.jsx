import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./scenes/dashboard";
import Customerlist from "./scenes/customerlist";
import Settings from "./scenes/settings";
import Monthlylist from "./scenes/monthlylist";
import PaymentForm from "./components/paymentForm";
import PaymentReceipt from "./components/paymentReceipt";
import CustomerArchive from "./scenes/customerlist/customerArchive";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Update from "./components/update";
import AccountSettings from "./scenes/settings/accountSettings";
import Products from "./scenes/products";
import MonthPaymentForm from "./scenes/products/monthPaymentForm";
import ChangePassword from "./components/changePassword";
import ForgotPassword from "./components/forgotPassword";
import EmployeeAttendance from "./scenes/employeeAttendance";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import Subscriptions from "./scenes/subscriptions";
import CustomerSubscriptions from "./scenes/customerlist/CustomerSubscriptions";

import EquipmentTable from "./scenes/inventory/equipmentTable.jsx";
import InventoryTable from "./scenes/inventory/supplementTable.jsx";
import Profile from "./components/Profile.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import SalesReport from "./scenes/reports/salesReport.jsx";
import InventoryReport from "./scenes/reports/inventoryReport.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  useEffect(() => {
    document.title = "The Gym Republic | Staff"; // Set the title here
  }, []);

  return (
    <AuthProvider>
      <AlertProvider>
        <NotificationProvider>
          <Router>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ContentLayout
                  isSidebar={isSidebar}
                  setIsSidebar={setIsSidebar}
                />
              </ThemeProvider>
            </ColorModeContext.Provider>
          </Router>
        </NotificationProvider>
      </AlertProvider>
    </AuthProvider>
  );
}

function ContentLayout({ isSidebar, setIsSidebar }) {
  const location = useLocation();

  // Define routes where Sidebar and Topbar should be hidden
  const hideSidebarAndTopbar = [
    "/",
    "/change-password",
    "/forgot-password",
    "/payment-form",
    "/payment-receipt",
  ].includes(location.pathname);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customers" element={<Customerlist />} />
        <Route
          path="/customers/subscriptions"
          element={<CustomerSubscriptions />}
        />
        <Route path="/update" element={<Update />} />
        <Route path="/attendance" element={<EmployeeAttendance />} />
        <Route path="/products" element={<Products />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/stocks/equipments" element={<EquipmentTable />} />
        <Route path="/stocks/products" element={<InventoryTable />} />
        <Route path="/reports/sales" element={<SalesReport />} />
        <Route path="/reports/inventory" element={<InventoryReport />} />
      </Routes>
    </Layout>
  );
}

export default App;
