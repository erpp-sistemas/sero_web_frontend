import React from "react";
import Container from "./components/Container";
import Search from "./components/search/Search";
import NavTabs from "./components/navtabs/NavTabs";
import PhotographsSection from "./components/sections/photographs_section/index";
import ContributorSection from "./components/sections/contributor/index";
import ProcessTableSection from "./components/sections/process_table_section/index";
import DebtsSection from "./components/sections/debts_sections/index";
import PaymentsSections from "./components/sections/payments_sections/index";
import ContributorInfo from "./components/contributor_info";
import SearchDialog from "./components/dialog";
import BackDrop from "./components/backdrop";
import AlertAccountHistory from "./components/alert";
import Charts from "./components/sections/charts";
import useCombinedSlices from "../../hooks/useCombinedSlices";
import DialogSearch from "./components/full-screen-dialog-search";
/**
 * Represents the main module for displaying and managing account history.
 *
 * @component
 * @returns {JSX.Element} JSX Element representing the AccountHistoryModule.
 */
function AccountHistoryModule() {
  // State and hooks initialization
  const {
    debts,
    alertInfo,
    photos,
    accountData,
    informationContributor,
    payments,
    setPhotos,
    setActions,
    setInformationContributor,
    setDebts,
    setPayments,
  } = useCombinedSlices();

  // Local state for handling tabs and dialogs
  const [selectedTab, setSelectedTab] = React.useState(
    "Contributor" /* "FormularioDatosFaltantes" */
  );

  /**
   * Handles the change in the selected tab.
   *
   * @param {React.SyntheticEvent} event - The event object.
   * @param {string} newTab - The newly selected tab value.
   * @returns {void}
   */

  const handleTabChange = (event, newTab) => {
    //?Estados Globales
    setSelectedTab(newTab);
  };
  // Local state for controlling dialogs and backdrops

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openBackDrop, setOpenBackDrop] = React.useState(false);

  /**
   * Opens the search dialog.
   *
   * @returns {void}
   */
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  /**
   * Closes the search dialog.
   *
   * @returns {void}
   */

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  /**
   * Opens the backdrop.
   *
   * @returns {void}
   */
  const handelOpenBackDrop = () => {
    setOpenBackDrop(true);
  };
  /**
   * Closes the backdrop.
   *
   * @returns {void}
   */
  const handelCloseBackDrop = () => {
    setOpenBackDrop(false);
  };

  /**
   * Renders the content based on the selected tab.
   *
   * @param {string} selectedValue - The currently selected tab.
   * @returns {JSX.Element | null} JSX Element representing the content for the selected tab.
   */

  const renderContent = (selectedValue) => {
    // const name = options[selectedValue];
    switch (selectedValue) {
      /* case "MissingDataForm":
        return <MissingDataSection {...missingData} />; */
      case "Contributor":
        return (
          <>
            <ContributorSection
            /*   contributor={contributor}
              address={address}
              role={role} */
            />
          </>
        );

      case "Payments":
        return <PaymentsSections /* payments={payments} */ />;
      case "Debt":
        return <DebtsSection /* debts={debts} */ />;
      case "PerformedActions":
        return <ProcessTableSection /* actions={actions} */ />;
      case "CapturedPhotographs":
        return <PhotographsSection /* photos={photos} */ />;
      /* case "Statistics":
        return <Charts />; */

      default:
        return null;
    }
  };

  // useEffect for processing account data and updating states

  React.useEffect(() => {



    function filterObjectsByProperties(arrayOfObjects, expectedProperties) {
      return arrayOfObjects?.filter((object) => {
        const keys = Object.keys(object);
        
        // Verificar si las propiedades coinciden exactamente y en el mismo orden
        return keys.length === expectedProperties.length && keys.every((key, index) => key === expectedProperties[index]);
      });
    }

    const expectedPropertiesOfTheProfile = ["account","owner_name", "type_service", "rate_type", "turn","meter_series","street","outdoor_number","interior_number","cologne","square","allotment","between_street_1","between_street_2","reference","town","poastal_code","latitude","longitude"];
    const filteredObjectsOfTheProfile = filterObjectsByProperties(accountData, expectedPropertiesOfTheProfile);
    setInformationContributor(filteredObjectsOfTheProfile);

    
    const expectedPropertiesOfTheDebts = ["debt_amount","last_payment_date", "update_date", "cutoff_date", "last_two_month_payment"];
    const filteredObjectsOfTheDebts = filterObjectsByProperties(accountData, expectedPropertiesOfTheDebts);
    setDebts(filteredObjectsOfTheDebts);

    const expectedPropertiesOfThePayments = ["reference","description", "amount_paid", "payment_date", "payment_period"];
    const filteredObjectsOfThePayments = filterObjectsByProperties(accountData, expectedPropertiesOfThePayments);
    setPayments(filteredObjectsOfThePayments);



    
    const expectedPropertiesOfTheActions = ["date_capture", "task_done", "person_who_capture", "photo_person_who_capture"];
    const filteredObjectsOfTheActions = filterObjectsByProperties(accountData, expectedPropertiesOfTheActions);

    
    setActions(filteredObjectsOfTheActions);
     
    const expectedPropertiesOfThePhotos = ["image_id","image_url", "image_type", "date_capture", "task_done","person_who_capture","photo_person_who_capture","synchronization_date","active","type_load"]
    const filteredObjectsOfThePhotos = filterObjectsByProperties(accountData, expectedPropertiesOfThePhotos);

    setPhotos(filteredObjectsOfThePhotos);
  }, [accountData, alertInfo]);

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
        />
      </Container>
      <Container>
        <ContributorInfo />
      </Container>
      <Container>
        <NavTabs value={selectedTab} handleChange={handleTabChange} />
      </Container>
      {accountData && <Container>{renderContent(selectedTab)}</Container>}
      {/* {openDialog && <SearchDialog handleCloseDialog={handleCloseDialog} />} */}
      {openDialog && <DialogSearch handleCloseDialog={handleCloseDialog} />}
      {openBackDrop && <BackDrop openBackDrop={openBackDrop} />}
    </>
  );
}

export default AccountHistoryModule;
