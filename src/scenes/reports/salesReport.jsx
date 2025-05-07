import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Print, GetApp } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { logo } from "./logo";
import Header from "../../components/Header";
import ReportSkeleton from "./reportSkeleton";
import { tokens } from "../../theme";

const SalesReport = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [monthlySales, setMonthlySales] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionResponse, productResponse] = await Promise.all([
        axios.get("http://localhost:8000/api/staff/exercise-transaction/show", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        axios.get("http://localhost:8000/api/staff/cart/show", {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      const subscriptionData = subscriptionResponse.data.data.map((item) => ({
        ...item,
        created_at: new Date(item.created_at).toLocaleDateString(),
      }));
      setMonthlySales(
        subscriptionData.filter((item) =>
          item.transactions.some((item) => item.tag === "monthly")
        )
      );
      setDailySales(
        subscriptionData.filter((item) =>
          item.transactions.some((item) => item.tag === "session")
        )
      );
      setProductSales(
        productResponse.data.data.map((sale) => ({
          ...sale,
          created_at: new Date(sale.created_at).toLocaleDateString(),
        }))
      );
      console.log(subscriptionResponse.data.data, productResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchData();
    }
  }, [authToken, navigate]);

  if (isLoading) {
    return <ReportSkeleton />;
  }

  return (
    <Box m={3} maxWidth={"1400px"} paddingBottom={"2rem"}>
      <Header title="Sales Report" subtitle="Monitor sales reports" />
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h5" gutterBottom>
          Monthly Subscription Sales
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlySales.map((sale, index) => (
                <TableRow key={sale.transaction_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sale.transaction_code}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sale.transactions
                      .map((item) => item.exercise_name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>{sale.total_price}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h5" gutterBottom>
          Daily Subscription Sales
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Services</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dailySales.map((sale, index) => (
                <TableRow key={sale.transaction_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sale.transaction_code}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sale.transactions
                      .map((item) => item.exercise_name)
                      .join(", ")}
                  </TableCell>
                  <TableCell>{sale.total_price}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Paper
        elevation={3}
        style={{ padding: "20px", backgroundColor: colors.primary[400] }}
      >
        <Typography variant="h5" gutterBottom>
          Product Sales
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productSales.map((sale, index) => (
                <TableRow key={sale.transaction_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    {sale.transaction_code}
                  </TableCell>
                  <TableCell>{sale.total_amount}</TableCell>
                  <TableCell>{sale.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesReport;
