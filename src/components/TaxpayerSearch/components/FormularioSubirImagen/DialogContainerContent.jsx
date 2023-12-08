import { Container } from "@mui/material";

function DialogContainerContent({ children }) {
  return (
    <Container maxWidth="sm">
      {children}
    </Container>
  );
}

export default DialogContainerContent;