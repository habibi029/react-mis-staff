import React, { useContext, useEffect } from "react";
import { Box, Typography, Grid, Button, Paper, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        marginTop: 8, // Space from the top
      }}
    >
      {/* Payment Form */}
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
          {/* Header */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" align="center">
              Payment Form
            </Typography>
          </Grid>

          {/* Form Details */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1" fontWeight="bold">
                  Product:
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
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button variant="contained" color="success" size="large">
            Payment
          </Button>
        </Box>
      </Grid>
    </Box>
  );
};

export default PaymentForm;
