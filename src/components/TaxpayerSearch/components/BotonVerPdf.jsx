import { PictureAsPdf as IconPDF } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import awaitms from "./Custom/awaitms";
// IconPdf
const BotonVerPdf = ({ onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    await awaitms(1000);
    if (onClick) await onClick();
    // await awaitms(2000);
    setIsLoading(false);
  };

  return (
    <LoadingButton
      color="info"
      style={{
        position: "absolute",
        top: "170px",
        right: "40px",
      }}
      onClick={handleClick}
      loading={isLoading}
      loadingPosition="start"
      startIcon={<IconPDF />}
      variant="contained"
    >
      <span>Ver PDF</span>
    </LoadingButton>
  );
};

export default BotonVerPdf;
