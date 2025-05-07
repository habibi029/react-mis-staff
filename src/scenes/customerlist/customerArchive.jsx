import { useContext, useEffect, useState } from "react";
import { Button, Box, Snackbar, Alert, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataCustomer } from "../../data/mockData";
import SettingsBackupRestoreOutlinedIcon from "@mui/icons-material/SettingsBackupRestoreOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CustomerArchive = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [customers, setCustomers] = useState(mockDataCustomer);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleDelete = (id) => {
    // Delete customer logic
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== id)
    );
    setSnackbar({
      open: true,
      message: "Customer deleted successfully!",
      severity: "error",
    });
  };

  const handleRestore = (id) => {
    // Restore customer logic
    const restoredCustomer = customers.find((customer) => customer.id === id);
    console.log("Restored customer:", restoredCustomer);
    setSnackbar({
      open: true,
      message: "Customer restored successfully!",
      severity: "success",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "info" });
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "chosenservices", headerName: "Chosen Services", flex: 1 },
    { field: "instructor", headerName: "Instructor", flex: 1 },
    { field: "plan", headerName: "Plan", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="10px" justifyContent="center">
          <Button
            variant="outlined"
            color="primary"
            startIcon={<SettingsBackupRestoreOutlinedIcon />}
            onClick={() => handleRestore(params.row.id)}
          >
            Restore
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineOutlinedIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Customer Archive"
        subtitle="Manage Archived Customer Records"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={customers} columns={columns} />
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerArchive;
