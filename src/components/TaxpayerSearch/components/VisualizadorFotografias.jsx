import React from "react";
import Viewer from "react-viewer";
// import './Modal.css';
import "./styles/VisualizadorFotografias.css";

const VisualizadorFotografias = ({
  images: initialImages,
  visible,
  setVisible,
  activeIndex = 0,
}) => {
  // const [visible, setVisible] = React.useState(false);

  return (
    <div>
      {/* <button
        onClick={() => {
          if (!images?.length) return;
          // setVisible(true);
        }}
      >
        show
      </button> */}
      <Viewer
        className="react-viewer"
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        images={initialImages?.map((image) => ({ src: image, alt: "" }))}
        activeIndex={activeIndex}
      />
    </div>
  );
};

export default VisualizadorFotografias;
