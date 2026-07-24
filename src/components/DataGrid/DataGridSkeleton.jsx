// src/components/DataGrid/DataGridSkeleton.jsx

import React from "react";

import { Box, Skeleton, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { tokens } from "../../theme";

function DataGridSkeleton({ rows = 8, showHeader = true }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const widths = [
    ["18%", "42%", "24%", "12%"],
    ["24%", "30%", "18%", "16%"],
    ["15%", "48%", "20%", "10%"],
    ["20%", "34%", "28%", "14%"],
    ["16%", "40%", "22%", "18%"],
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {showHeader && (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${alpha(colors.grey[100], 0.08)}`,
          }}
        >
          {[18, 26, 20, 14].map((width, index) => (
            <Skeleton
              key={index}
              variant="text"
              animation="wave"
              sx={{
                width: `${width}%`,
                height: 18,
                borderRadius: 1,
              }}
            />
          ))}
        </Box>
      )}

      {Array.from({ length: rows }).map((_, rowIndex) => {
        const row = widths[rowIndex % widths.length];

        return (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              px: 2,
              py: 1.4,
              borderBottom:
                rowIndex !== rows - 1
                  ? `1px solid ${alpha(colors.grey[100], 0.05)}`
                  : "none",
            }}
          >
            {row.map((width, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                animation="wave"
                sx={{
                  width,
                  height: 14,
                  borderRadius: 8,
                }}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
}

export default DataGridSkeleton;
