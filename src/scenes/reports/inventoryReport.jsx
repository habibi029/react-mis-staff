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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { logo } from "./logo";
import Header from "../../components/Header";
import ReportSkeleton from "./reportSkeleton";
import { tokens } from "../../theme";

const InventoryReport = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summaryInventory, setSummaryInventory] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/inventory-lists",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const inventoryData = response.data.data;
      setSummaryInventory(inventoryData);
      setSupplements(
        inventoryData.filter((item) => item.type === "supplement")
      );
      setEquipments(inventoryData.filter((item) => item.type === "equipment"));
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
      <Header title="Inventory Report" subtitle="Monitor inventory reports" />
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          backgroundColor: colors.primary[400],
        }}
      >
        <Typography variant="h5" gutterBottom>
          Summary Inventory
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryInventory.map((item, index) => (
                <TableRow key={item.item_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code.toUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.short_description || "No description available"}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
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
          Supplements
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplements.map((item, index) => (
                <TableRow key={item.item_code}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code.toUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.short_description || "No description available"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
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
          Equipments
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Item Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipments.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item_code.toUpperCase()}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: "120px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.short_description || "No description available"}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InventoryReport;
