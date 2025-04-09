import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const DashboardSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          <Skeleton width={200} />
        </Typography>
        <Typography variant="subtitle1">
          <Skeleton width={300} />
        </Typography>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gap={2}
        sx={{
          maxWidth: "96rem",
          gridTemplateColumns: {
            sm: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
        }}
        mt={3}
      >
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            backgroundColor="rgba(0, 0, 0, 0.1)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={3}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={100}
              animation="wave"
            />
          </Box>
        ))}
      </Box>

      {/* Instructors Section */}
      <Box marginTop="2rem">
        <Typography variant="h3" fontWeight="600">
          <Skeleton width={300} />
        </Typography>
        <Box
          display="grid"
          gap={2}
          backgroundColor="rgba(0, 0, 0, 0.05)"
          marginTop="0.5rem"
          p="30px"
          sx={{
            maxHeight: "500px",
            maxWidth: "96rem",
            overflowY: "scroll",
            gridTemplateColumns: {
              sm: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              sx={{
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: colors.primary[400],
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  <Skeleton width={120} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Skeleton width={150} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Skeleton width={180} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Skeleton width={140} />
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <Skeleton width={160} />
                </Typography>
              </CardContent>
              <IconButton>
                <Skeleton variant="circular" width={40} height={40} />
              </IconButton>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar open={false}>
        <Alert severity="info">
          <Skeleton width={200} />
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DashboardSkeleton;
