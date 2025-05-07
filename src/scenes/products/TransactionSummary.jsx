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
  Modal,
  useTheme,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";

const TransactionSummary = ({ transactionDetails, onClose, onProceed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="transaction-summary-modal"
      aria-describedby="transaction-summary-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Transaction Summary
        </Typography>
        {/* <Typography variant="body1" sx={{ mb: 1 }}>
          Customer: {transactionDetails.customerName}
        </Typography> */}
        <Typography variant="body2" sx={{ mb: 2 }}>
          Transaction Date: {paidDate}
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableBody>
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
                  Total Amount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ₱{transactionDetails.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                  Amount Paid
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ₱{transactionDetails.amountPaid.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                  Change
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    color: colors.greenAccent[500],
                  }}
                >
                  ₱{transactionDetails.change.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={onProceed}>
            Proceed
          </Button>
          <Button variant="outlined" color="error" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TransactionSummary;
