import React, { useState, useEffect, useContext } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CustomerSubscriptions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState(false);
  const [customer, setCustomer] = useState([]);

  const getUniqueInstructors = (transactions) => {
    return transactions
      .reduce((acc, item) => {
        if (item.instructor_name && !acc.includes(item.instructor_name)) {
          acc.push(item.instructor_name);
        }
        return acc;
      }, [])
      .join(", ");
  };

  const getUniquePlan = (transactions) => {
    return transactions
      .reduce((acc, item) => {
        if (!acc.includes(item.tag)) {
          acc.push(item.tag);
        }
        return acc;
      }, [])
      .join(", ");
  };

  const fetchClientTransactions = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/exercise-transaction/show",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        const clients = response.data.data.map((client) => ({
          id: client.transaction_code,
          name: client.client_name,
          sex: client.gender,
          email: client.email,
          contact: client.contact_no,
          address: client.address,
          chosenservices: client.transactions
            .map((item) => item.exercise_name)
            .join(", "),
          instructor: getUniqueInstructors(client.transactions),
          plan: getUniquePlan(client.transactions),
          totalPrice: client.total_price.toFixed(2),
        }));

        setCustomer(clients);
      } else {
        console.error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsFetching(false);
    }
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
    { field: "totalPrice", headerName: "Total Amount", flex: 1 },
  ];

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchClientTransactions();
    }
  }, [authToken, navigate]);

  return (
    <Box m="20px">
      <Header title="Subscriptions" subtitle="Monitor customer subscriptions" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
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
        <DataGrid
          loading={isFetching}
          checkboxSelection
          rows={customer}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default CustomerSubscriptions;
