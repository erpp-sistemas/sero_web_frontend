import React, {useState, useEffect} from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import FaceIcon from '@mui/icons-material/Face'
import WorkIcon from '@mui/icons-material/Work'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'
import StepOne from '../../components/NewUser/StepOne.jsx'
import StepTwo from '../../components/NewUser/StepTwo.jsx'
import StepThree from '../../components/NewUser/StepThree.jsx'
import { registerRequest } from '../../api/auth.js'
import { Alert, Collapse } from '@mui/material'

const steps = [
	{ label: 'Datos Personales', icon: <FaceIcon />, size: 'large' }, 
	{ label: 'Plazas, Servicio y Procesos', icon: <WorkIcon />, size: 'large' }, 
	{ label: 'Permisos', icon: <BusinessCenterIcon />, size: 'large' }
]

function Index() {

	const matches = useMediaQuery('(min-width:600px)')
	const [activeStep, setActiveStep] = React.useState(0)
	const [completed, setCompleted] = React.useState({})
	const [profileId, setProfileId] = React.useState(null)
	const [formData, setFormData] = React.useState(null)
	const [ setFormDataTwo] = React.useState(null)
	const [ setFormDataThree] = React.useState(null)
	const [signinErrors, setSigninErrors] = React.useState([])
	const [alertOpen, setAlertOpen] = useState(false)

	const totalSteps = () => {
		return steps.length
	}

	const completedSteps = () => {
		return Object.keys(completed).length
	}

	const isLastStep = () => {
		return activeStep === totalSteps() - 1
	}

	const allStepsCompleted = () => {
		return completedSteps() === totalSteps()
	}

	const handleNext = () => {
		const newActiveStep =
		isLastStep() && !allStepsCompleted()
			? steps.findIndex((step, i) => !(i in completed))
			: activeStep + 1
		setActiveStep(newActiveStep)
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	const handleStep = (step) => () => {
		setActiveStep(step)
	}

	const handleComplete = () => {
		const newCompleted = completed
		newCompleted[activeStep] = true
		setCompleted(newCompleted)
		handleNext()
	}

	const handleReset = () => {
		setActiveStep(0)
		setCompleted({})
	}

	const handleStepOneNext = (formData) => {
		setFormData(formData)
		setProfileId(formData.profile_id)

		if (formData.profile_id === 1) {
			signup(formData)
		} else {
			handleNext()
		}
		
	}

	const handleStepTwoNext = (formDataTwo) => {
		setFormDataTwo(formDataTwo)

		const profileIdFromformData = formDataTwo && formData.profile_id

		if (profileIdFromformData === 5) {
			setProfileId(profileIdFromformData)
			setActiveStep(totalSteps())
		}
		else{
			handleNext()
		}    

	}

	const handleStepThreeNext = (formDataThree) => {
		setFormDataThree(formDataThree)    
		setActiveStep(totalSteps())    
	}

	const signup = async (user) => {

		try {
			const res = await registerRequest(user)
			console.info(res.data)
			setActiveStep(totalSteps())      
		} catch (error) {
			if(Array.isArray(error.response.data)){
				return setSigninErrors(error.response.data)
			}    
			setSigninErrors([error.response.data.message])
			handleNext()
		}        

	}

	useEffect(() => {

		if(signinErrors.length > 0){
			setAlertOpen(true)
			setTimeout(() => {
				setAlertOpen(false)
			}, 5000)
			return
		}

	},[signinErrors])

	return (
		
		<Box m="20px">

			<Stepper nonLinear activeStep={activeStep} orientation={matches ? 'horizontal' : 'vertical'}>
				{steps.map((step, index) => (
				<Step key={step.label} completed={completed[index]}>
					<StepButton 
					color="inherit" 
					onClick={handleStep(index)}
					completed={completed[index]}
					icon={React.cloneElement(step.icon, { fontSize: step.size })}
					sx={{
						color: index === activeStep ? 'info.main' : 'inherit',
						'& .MuiStepLabel-label': {
						fontSize: step.size === 'large' ? '1.25rem' : '1rem',
						fontWeight: 'bold'
						},
					}}
					>
					<Typography
						variant="inherit"
						sx={{
						color: index === activeStep ? 'info.main' : 'inherit',
						fontSize: step.size === 'large' ? '1.25rem' : '1rem',
						fontWeight: 'bold'
						}}
					>
						{step.label}
					</Typography>
					</StepButton>
				</Step>
				))}
			</Stepper>
		
			<Box mt={2}>
				<Collapse in={alertOpen}>
				<Alert severity="error" onClose={() => setAlertOpen(false)}>
				{signinErrors}
				</Alert>
				</Collapse>
			</Box>
		
			<div>
				{activeStep === 0 && <StepOne onNext={handleStepOneNext} onFormData={setFormData} />}
				{activeStep === 1 && <StepTwo onNextTwo={handleStepTwoNext} onFormDataTwo={setFormDataTwo}/>}
				{activeStep === 2 && <StepThree profileId={profileId} onNextThree={handleStepThreeNext} onFormDataThree={setFormDataThree}/>}
				
				{((allStepsCompleted() || (profileId === 1 && activeStep === totalSteps()) || profileId === 5) && activeStep !== 1) ? (
				<React.Fragment>
					<Typography sx={{ mt: 2, mb: 1 }}>
					All steps completed - you&aposre finished
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
					<Box sx={{ flex: '1 1 auto' }} />
					<Button onClick={handleReset}>Reset</Button>
					</Box>
				</React.Fragment>
				) : (
				<React.Fragment>
					<Typography sx={{ mt: 2, mb: 1, py: 1 }}>
					Step {activeStep + 1}
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: matches ? 'row' : 'column', pt: 2 }}>
					<Button
						color="inherit"
						disabled={activeStep === 0}
						onClick={handleBack}
						sx={{ mr: 1, bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' } }}
					>
						Back
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					<Button onClick={handleNext} sx={{ mr: 1, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}>
						Next
					</Button>
					{activeStep !== steps.length &&
						(completed[activeStep] ? (
						<Typography variant="caption" sx={{ display: 'inline-block' }}>
							Step {activeStep + 1} already completed
						</Typography>
						) : (
						<Button onClick={handleComplete} sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}>
							{completedSteps() === totalSteps() - 1
							? 'Finish'
							: 'Complete Step'}
						</Button>
						))}
					</Box>
				</React.Fragment>
				)}
			</div>

		</Box>

	)

}

export default Index
