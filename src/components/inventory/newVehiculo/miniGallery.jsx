import { Box, Button } from "@mui/material"
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { imagenesMap, dispatchMap } from "../../../hooks/estadoVehiculoHook.js"

const MiniGallery = ({ condicional, type }) => {
    const fileInputRef = useRef(null)
    const dispatch = useDispatch()

	const galleryImages = useSelector(state => {
		return state.imagenesEstado[imagenesMap[type]] || []
	})

	const handleFileSelect = (event) => {
		const files = event.target.files
		if (files) {
			const newImages = Array.from(files).map((file, index) => ({
				id: Date.now() + index,
				src: URL.createObjectURL(file),
                file: file,
			}))
			const allImages = [...galleryImages]
			newImages.forEach(newImage => {
				if (!allImages.some(existingImage => existingImage.src === newImage.src)) {
					allImages.push(newImage)
				}
			})
			const dispatchAction = dispatchMap[type]
			if (dispatchAction) {
				dispatch(dispatchAction(allImages))
			}
			event.target.value = ''
		}
	}

    const addImage = () => {
        fileInputRef.current.click()
    }

	const removeImage = (id) => {
		const updatedImages = galleryImages.filter(image => image.id !== id)
		const dispatchAction = dispatchMap[type]
		if (dispatchAction) {
			dispatch(dispatchAction(updatedImages))
		}
	}

    return (

        <>

            {condicional && (

                <Box
                    sx={{
                        width: '100%',
                        height: '50px',
                        background: 'rgba(255,255,255,0.3)',
                        m: '10px 0px',
                        borderRadius: '4px',
                        p: '2px 6px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '6px',
                        overflowX: 'scroll',
                        overflowY: 'hidden',
                        whiteSpace: 'nowrap',
                        '&::-webkit-scrollbar': {
                            height: '4px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'rgba(0, 0, 0, 0.1)',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            borderRadius: '4px',
                        },
                    }}
                >

                    <Box
                        sx={{
                            width: '25px',
                            height: '25px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#66bb6a',
                            borderRadius: '4px',
                        }}
                    >
                        <Button
                            sx={{
                                width: '100%',
                                height: '100%',
                                background: 'transparent',
                                fontSize: '26px',
                                color: '#fff',
                            }}
                            onClick={addImage}
                        >
                            +
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                        />
                    </Box>
                    {
                        galleryImages.map((image) => (
                            <Box
                                key={image.id}
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    minWidth: '40px',
                                    minHeight: '40px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    background: 'black',
                                    borderRadius: '4px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <img src={image.src} alt={`Preview ${image.id}`} style={{ width: '100%', height: '100%' }} />
                                <Button
                                    sx={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: 'red',
                                        color: '#fff',
                                        minWidth: '10px',
                                        minHeight: '10px',
                                        padding: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '8px',
                                        position: 'absolute',
                                        top: '0px',
                                        right: '0px',
                                        '&:hover': {
                                            backgroundColor: 'red',
                                        },
                                    }}
                                    onClick={() => removeImage(image.id)}
                                >
                                    x
                                </Button>
                            </Box>
                        ))
                    }

                </Box>

            )}

        </>

    )

}

MiniGallery.propTypes = {
    condicional: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
}

export default MiniGallery