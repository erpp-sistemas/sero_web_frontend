import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h3"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      {/* S02-H2.1: verde de texto del tema nuevo (el #4cceac anterior no se leía sobre fondo claro) */}
      <Typography variant="h5" color="#1E7A47">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
