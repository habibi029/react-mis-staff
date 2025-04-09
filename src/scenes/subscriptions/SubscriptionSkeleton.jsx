import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";

function SubscriptionSkeleton() {
  return (
    <Box
      display="flex"
      gap={2}
      sx={{
        flexDirection: {
          xs: "column-reverse",
          sm: "column-reverse",
          md: "row",
        },
      }}
    >
      <Box flex={1}>
        <Typography marginBottom={"0.5rem"} variant="h6">
          Available Services
        </Typography>
        <Box
          display="grid"
          gap={2}
          sx={{
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr",
              lg: "1fr 1fr 1fr",
              xl: "1fr 1fr 1fr 1fr",
            },
          }}
        >
          {[...Array(9)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={80}
              sx={{ borderRadius: "8px" }}
            />
          ))}
        </Box>
      </Box>

      <Box flex={1}>
        <Typography marginBottom={"0.5rem"} variant="h6">
          Cart
        </Typography>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ borderRadius: "8px" }}
        />
      </Box>
    </Box>
  );
}

export default SubscriptionSkeleton;
