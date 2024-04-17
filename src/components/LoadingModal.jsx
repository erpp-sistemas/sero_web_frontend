import React from "react";
import { Modal, Fade } from "@mui/material";
import Lottie from 'lottie-react'
import loading from '../assets/json/loading.json'

const LoadingModal = ({ open }) => {
  return (
    <Modal open={open}>
      <Fade in={open} timeout={500}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Lottie animationData={loading} style={{ width: '5%', margin: '0 auto' }} />
        </div>
      </Fade>
    </Modal>
  );
};

export default LoadingModal;
