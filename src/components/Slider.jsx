import { useState } from "react"
import { Container, Grid, Stack, Tab, Tabs, Typography } from "@mui/material"
import { section4Content } from "../data/slider"

const { bottom } = section4Content

const Slider = () => {

    const [tabValue, setTabValue] = useState(0)

    return (

        <Container sx={{ mt: { xs: 5, md: 5, lg: 5 } }}>

            <Grid
                container
                spacing={5}
                flexWrap="wrap-reverse"
                alignItems="center"
                sx={{ mt: { xs: 10, md: 15 } }}
            >

                <Grid item xs={12} md={6}>
                    <img
                        src={bottom.TABS[tabValue].image}
                        style={{ width: "100%", objectFit: "contain" }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>

                    <Stack spacing={2} sx={{ maxWidth: 480 }}>

                        <Typography 
							sx={{ 
								color:'white', 
								fontSize:'1.125rem', 
								lineHeight:'1.75rem', 
								fontWeight:'800' ,
								textAlign:{
									xs:'center',
									md:'start'
								}
							}}
						>
							<span className='text-[#5ebfff]'>{bottom.title}</span>
						</Typography>
                       
						<Tabs
                            value={tabValue}
                            onChange={(e, v) => setTabValue(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            {bottom.TABS.map(({ name }) => (
                                <Tab
                                    label={name}
                                    key={name}
                                    sx={{
                                        minWidth: 60,
                                        "&.Mui-selected": { color: "text.primary" },
                                    }}
                                />
                            ))}
                        </Tabs>

                        <Typography
                            variant="h4"
                            color="text.secondary"
                            sx={{ 
								pb: 2, 
								minHeight: 70,
								textAlign:{
									xs:'center',
									md:'start'
								}
							}}
                        >
                            {bottom.TABS[tabValue].subtitle}
                        </Typography>

                    </Stack>

                </Grid>

            </Grid>

        </Container>

    )

}

export default Slider