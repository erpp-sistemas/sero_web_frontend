import React from "react"
import Container from "./components/Container"
import Search from "./components/search/Search"
import NavTabs from "./components/navtabs/NavTabs"
import ContributorSection from "./components/sections/contributor/index"
import ProcessTableSection from "./components/sections/process_table_section/index"
import DebtsSection from "./components/sections/debts_sections/index"
import PaymentsSections from "./components/sections/payments_sections/index"
import ContributorInfo from "./components/contributor_info"
import BackDrop from "./components/backdrop"
import AlertAccountHistory from "./components/alert"
import useCombinedSlices from "../../hooks/useCombinedSlices"
import DialogSearch from "./components/full-screen-dialog-search"

function AccountHistoryModule() {

	const { debts, alertInfo, photos, accountData, informationContributor, payments, actions, setPhotos, setActions, setInformationContributor, setDebts, setPayments } = useCombinedSlices()

	const [selectedTab, setSelectedTab] = React.useState(
		"Contributor" 
	)

	const handleTabChange = (event, newTab) => {
		setSelectedTab(newTab)
	}

	const [openDialog, setOpenDialog] = React.useState(false)
	const [openBackDrop, setOpenBackDrop] = React.useState(false)
	const [accountNumber, setAccountNumber] = React.useState("")

	const handleOpenDialog = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	const handelOpenBackDrop = () => {
		setOpenBackDrop(true)
	}

	const handelCloseBackDrop = () => {
		setOpenBackDrop(false)
	}

	const renderContent = (selectedValue) => {

		switch (selectedValue) {
		case "Contributor":
			return (
			<>
				<ContributorSection/>
			</>
		)

		case "Payments":
			return <PaymentsSections/>

		case "Debt":
			return <DebtsSection />

		case "PerformedActions":
			return <ProcessTableSection />

		default:
			return null
		}

	}

  React.useEffect(() => {

    function filterObjectsByProperties(arrayOfObjects, expectedProperties) {
      return arrayOfObjects?.filter((object) => {
        const keys = Object.keys(object)
        return keys.length === expectedProperties.length && keys.every((key, index) => key === expectedProperties[index])
      })
    }

    const expectedPropertiesOfTheProfile = ["account","owner_name", "type_service", "rate_type", "turn","meter_series","street","outdoor_number","interior_number","cologne","square","allotment","between_street_1","between_street_2","reference","town","poastal_code","latitude","longitude"]
    const filteredObjectsOfTheProfile = filterObjectsByProperties(accountData, expectedPropertiesOfTheProfile)
    setInformationContributor(filteredObjectsOfTheProfile)

    const expectedPropertiesOfTheDebts = ["debt_amount","last_payment_date", "update_date", "cutoff_date", "last_two_month_payment"]
    const filteredObjectsOfTheDebts = filterObjectsByProperties(accountData, expectedPropertiesOfTheDebts)
    setDebts(filteredObjectsOfTheDebts)

    const expectedPropertiesOfThePayments = ["reference","description", "amount_paid", "payment_date", "payment_period"]
    const filteredObjectsOfThePayments = filterObjectsByProperties(accountData, expectedPropertiesOfThePayments)
    setPayments(filteredObjectsOfThePayments)
    
    const expectedPropertiesOfTheActions = ["date_capture", "task_done", "person_who_capture", "photo_person_who_capture"]
    const filteredObjectsOfTheActions = filterObjectsByProperties(accountData, expectedPropertiesOfTheActions)
    
    setActions(filteredObjectsOfTheActions)
     
    const expectedPropertiesOfThePhotos = ["image_id","image_url", "image_type", "date_capture", "task_done","person_who_capture","photo_person_who_capture","synchronization_date","active","type_load"]
    const filteredObjectsOfThePhotos = filterObjectsByProperties(accountData, expectedPropertiesOfThePhotos)

    setPhotos(filteredObjectsOfThePhotos)
  }, [accountData, alertInfo, setActions, setDebts, setInformationContributor, setPayments, setPhotos])

	return (
		<>

			{alertInfo && <AlertAccountHistory alertInfo={alertInfo} />}

			<Container>
				<Search
				handleOpenDialog={handleOpenDialog}
				handelOpenBackDrop={handelOpenBackDrop}
				handelCloseBackDrop={handelCloseBackDrop}
				ownerDetails={informationContributor}
				ownerHomeImages={photos}
				ownerDebts={debts}
				ownerPayments={payments}
				ownerActions={actions}
				accountNumber={accountNumber}
				/>
			</Container>

			<Container>
				<ContributorInfo />
			</Container>

			<Container>
				<NavTabs value={selectedTab} handleChange={handleTabChange} />
			</Container>

			{accountData && <Container>{renderContent(selectedTab)}</Container>}

			{openDialog && <DialogSearch handleCloseDialog={handleCloseDialog} setAccountNumber={setAccountNumber} />}

			{openBackDrop && <BackDrop openBackDrop={openBackDrop} />}

		</>

	)

}

export default AccountHistoryModule
