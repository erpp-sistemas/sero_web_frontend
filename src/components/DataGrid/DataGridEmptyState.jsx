import React from "react";

import { Box, Typography, useTheme } from "@mui/material";

import { tokens } from "../../theme";

function DataGridEmptyState({ icon, title, description, actions }) {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 260,
          textAlign: "center",
        }}
      >
        {icon && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 1.5,

              "& svg": {
                fontSize: 26,
                color: colors.grey[500],
              },
            }}
          >
            {icon}
          </Box>
        )}

        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            color: colors.grey[200],
            lineHeight: 1.4,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              mt: 0.75,
              color: colors.grey[500],
              lineHeight: 1.6,
              fontSize: "0.82rem",
            }}
          >
            {description}
          </Typography>
        )}

        {actions && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DataGridEmptyState;