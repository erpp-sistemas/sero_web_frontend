import React, { useEffect, useState } from 'react';
import '../styles/ImageViewer.css'
import BoxIcon from './generic/BoxIcon';
import awaitMs from './tools/awaitMs';
import useTempClassName from './hooks/useClassNames';
// Componente para la miniatura de la imagen
const initialClassName = { img: '' }

const ImageThumbnail = ({ src, onClick }) => {
  // const { stateClassTemp, handleSetClassTemp } = useclassNameTemp()
  const { classNames, setClassName } = useTempClassName(initialClassName)
  const handleClick = () => {
    setClassName('img', '--click')
    onClick()
  }
  return (
    <img
      src={src}
      alt="Miniatura"
      onClick={handleClick}
      loading='lazy'
      className={`thumbnail useClick ${classNames.img}`}
    />
  );
};


// Componente para el modal de la imagen
const ImageModal = ({ src, onClose, onBack, onNext }) => {
  const [className, setClassName] = useState('--close')
  const handleApplyClass = (value) => setClassName(value ? ` ${value}` : '');

  useEffect(() => {
    handleApplyClass('')
  }, [])

  const handleClickClose = async () => {
    handleApplyClass('--close');

    await awaitMs(200);
    onClose()
  };
  return (
    <div className={`modal ${className}`}>
      <div className='modal-header' onClick={handleClickClose}>
        <BoxIcon iconName='bx-x' classNames='close' />
      </div>

      <div className="modal-content">
        <BoxIcon
          iconName='bxs-chevron-left'
          classNames='modal-content-icon left'
          handleClick={onBack}
        />
        <img className='modal-image' src={src} alt="Imagen" />
        <BoxIcon
          iconName='bxs-chevron-right'
          classNames='modal-content-icon right'
          handleClick={onNext}
        />
      </div>
    </div>
  );
};

// Componente principal para el visualizador de imágenes
const ImageViewer = ({ images }) => {

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const openModal = (src, index) => {
    setSelectedIndex(index)
    setSelectedImage(src);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage('');
    setModalOpen(false);
  };
  const setImageByIndex = (newIndex) => {
    const image = images[newIndex];
    if (!image) return;
    setSelectedIndex(newIndex)
    setSelectedImage(image)
  }
  const backImage = () => setImageByIndex(selectedIndex - 1)
  const nextImage = () => setImageByIndex(selectedIndex + 1)
  return (
    <div style={{ maxWidth: '100vw' }}>
      <h2>Visualizador de Imágenes</h2>
      <div className="thumbnails">
        {images.map((image, index) => (
          <ImageThumbnail key={index} src={image} onClick={() => openModal(image, index)} />
        ))}
      </div>
      {(
        modalOpen &&
        <ImageModal
          src={selectedImage}
          onClose={closeModal}
          onBack={backImage}
          onNext={nextImage}
        />)}
    </div>
  );
};

export default ImageViewer;
