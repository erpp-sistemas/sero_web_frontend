import { Box, useTheme, Typography} from "@mui/material"
import { tokens } from "../../theme"
import Bar from '../../components/NivoChart/Bar'
import PropTypes from 'prop-types'

function ManagedTask({ data }) {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

	if (!data) {
		return null
	}

	const convertData = (data) => {
		return data.map(item => {
		
		const taskKey = item.task.split(' ').map(word => word[0]).join('');
		return {
			task: `${taskKey}`,
			[`${item.task}`]: item.count,
			[`${taskKey}_Color`]: "hsl(0, 70%, 50%)"
		};
		});
	}  
	
	const formattedData = convertData(data)

	const getTaskNamesKeys = (data) => {
		return data.map(item => item.task)
	}
	
	const taskNamesKeys = getTaskNamesKeys(data)
    
  return (

    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="490px"
      gap="15px"
      width='100%'      
      padding='5px'
    >   
      <Box
        sx={{ 
			cursor: 'pointer',
			gridColumn:'span 12',
			backgroundColor:'rgba(128, 128, 128, 0.1)',
			borderRadius:"10px",
			overflowY:'hidden',
			overflowX:'scroll'
		}}
      >

            <Box
                mt="10px"
                mb="-15px"
                p="0 10px"
                justifyContent="space-between"
                alignItems="center"
            >

            <Typography 
              variant="h4" 
              align="center" 
              sx={{ fontWeight: 'bold', paddingTop: 1 }}
            >
              TAREAS GESTIONADAS
             </Typography>
            </Box>
            {data.length > 0 && (
                <Bar data={ formattedData } index='task' keys={taskNamesKeys} position='vertical' color='category10'/>
              )}
        </Box>
    </Box>    
  )
}

ManagedTask.propTypes = { 
    data: PropTypes.any.isRequired
}

export default ManagedTask