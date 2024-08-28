import { Box, Typography } from "@mui/material"
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { EffectCoverflow, Pagination } from 'swiper/modules'

export default function Manuals () {

	return (

		<Box sx={{ width:'100%', height:'auto', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column' }}>
			<Typography sx={{ width:'100%', height:'auto', textAlign:'start', fontSize:'26px' }}>Manuales</Typography>

			<Box sx={{ width:'50%', height:'auto', mt:'40px' }}>
				<Swiper
					style={{ width: '100%', height: '300px' }}
					effect={'coverflow'}
					grabCursor={true}
					centeredSlides={true}
					slidesPerView={'auto'}
					coverflowEffect={{
						rotate: 150,
						stretch: 0,
						depth: 200,
						modifier: 2,
						slideShadows: true,
					}}
					pagination={true}
					modules={[EffectCoverflow, Pagination]}
					className="mySwiper"
				>
					<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-1.jpg" style={{ width: '90%', height: '100%', objectFit: 'cover' }}  />
					</SwiperSlide>
					<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-2.jpg" style={{ width: '90%', height: '100%', objectFit: 'cover' }} />
					</SwiperSlide>
					<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-3.jpg" style={{ width: '90%', height: '100%', objectFit: 'cover' }} />
					</SwiperSlide>
					<SwiperSlide>
					<img src="https://swiperjs.com/demos/images/nature-4.jpg" style={{ width: '90%', height: '100%', objectFit: 'cover' }} />
					</SwiperSlide>
				</Swiper>
			</Box>
		
		</Box>

	)

}