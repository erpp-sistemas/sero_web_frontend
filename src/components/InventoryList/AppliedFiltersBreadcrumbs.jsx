import React from "react";
import { Breadcrumbs, Chip } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const AppliedFiltersBreadcrumbs = ({ appliedFilters, selectedFilters, onDelete }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="large" />} 
      sx={{ '& > .MuiBreadcrumbs-separator': { mx: 0.5 }, mt: 2 }}
    >
      {appliedFilters.map((filterKey, index) => (
        <Chip
          key={filterKey}
          label={`${filterKey}: ${selectedFilters[filterKey]}`}
          onDelete={() => onDelete(filterKey, index)}
          color="info"
          variant="outlined"
          size="small"
        />
      ))}
    </Breadcrumbs>
  );
};

export default AppliedFiltersBreadcrumbs;