import { useContext, useEffect, useState } from "react";
import { Button, Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockDataCustomer } from "../data/mockData";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { AuthContext } from "../context/AuthContext";

const Payment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const [customer] = useState(mockDataCustomer);

  // Modify handleEdit function to navigate to the payment form
  const handleEdit = (id) => {
    console.log("Initiating payment for customer with ID:", id);
    navigate(`/payment-form`); // Navigate to the Payment Form page, passing the customer ID
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "sex", headerName: "Sex", headerAlign: "left", align: "left" },
    { field: "contact", headerName: "Contact No", flex: 1 },
    { field: "chosenservices", headerName: "Chosen Services", flex: 1 },
    { field: "plan", headerName: "Plan", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="9px" justifyContent="center">
          <Button
            variant="outlined"
            color={colors.greenAccent[500]}
            onClick={() => handleEdit(params.row.id)} // Handle payment button click
          >
            Payment
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Payment" subtitle="" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
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
        <DataGrid checkboxSelection rows={customer} columns={columns} />
      </Box>
    </Box>
  );
};

export default Payment;
