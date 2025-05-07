import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Divider,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const POSReceipt = ({ transactionDetails, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handlePrint = () => {
    window.print(); // Opens the print dialog for the current page
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const paidDate = formatDate(new Date());

  return (
    <Box sx={{ padding: 4, display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: "600px",
          padding: 3,
          textAlign: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: colors.primary[500],
          }}
        >
          POS Receipt
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            marginBottom: 1,
            color: colors.primary[500],
          }}
        >
          Customer: {transactionDetails.customerName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ marginBottom: 2, color: colors.primary[500] }}
        >
          Transaction Date: {paidDate}
        </Typography>

        <Divider sx={{ marginBottom: 2 }} />

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
              </TableRow>
              {transactionDetails.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₱{item.price}</TableCell>
                  <TableCell align="right">
                    ₱{item.price * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                  Amount Paid
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ₱{transactionDetails.amountPaid}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                  Change
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ₱{transactionDetails.change}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ fontWeight: "bold", borderTop: "2px solid black" }}
                >
                  Total Amount
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", borderTop: "2px solid black" }}
                >
                  ₱{transactionDetails.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="body2"
          sx={{ marginTop: 3, fontStyle: "italic", fontSize: "0.9em" }}
        >
          Thank you for your purchase!
        </Typography>

        {/* Buttons */}
        <Box
          className="no-print"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            sx={{ padding: "5px 30px", fontWeight: "bold" }}
          >
            Print
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={onClose}
            sx={{ padding: "5px 30px", fontWeight: "bold" }}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default POSReceipt;

/* CSS for print */
const styles = `
@media print {
  .no-print {
    display: none;
  }
}
`;

// Append styles to document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
