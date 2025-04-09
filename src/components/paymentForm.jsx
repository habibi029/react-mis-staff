import React, { useContext, useEffect } from "react";
import { Box, Typography, Grid, Button, Paper, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PaymentForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  const handlePayment = () => {
    const paymentDetails = {
      fullName: "Stacey Sevillegia",
      address: "Bagong Pook San Antonio, Cavite City",
      contactNumber: "09654782546",
      email: "staceysevillegia@gmail.com",
      instructor: "Carlo Diaz",
      service: "Monthly with Instructor",
      totalAmount: "PHP 1,500.00",
    };

    // Navigate to the Payment Receipt page with payment details
    navigate("/payment-receipt", { state: { paymentDetails } });
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        marginTop: 8, // Space from the top
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: colors.primary[400],
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 4 }}>
          <Typography variant="h5" fontWeight="bold" color="secondary">
            The Gym Republic
          </Typography>
          <Typography variant="body1" mt={1}>
            5570 Paterno Street, cor. Gajigas St., P. Burgos Ave.
          </Typography>
          <Typography variant="body1">(Behind Seven Eleven)</Typography>
          <Typography variant="body1">Cavite City</Typography>
          <Typography variant="body1" mt={2}>
            <strong>The Gym Republic Cavite City</strong>
          </Typography>
          <Typography variant="body1" mt={1}>
            <strong>0935-113-7561</strong>
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {/* Form Details */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Full name:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">Stacey Sevillegia</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Address:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  Bagong Pook San Antonio, Cavite City
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Contact Number:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">09654782546</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Email Address:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  staceysevillegia@gmail.com
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Instructor:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">Carlo Diaz</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Services:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">Monthly with Instructor</Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Total Amount:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">PHP 1,500.00</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            marginTop="10px"
            variant="contained"
            color="success"
            size="large"
            onClick={handlePayment}
          >
            Payment
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default PaymentForm;
