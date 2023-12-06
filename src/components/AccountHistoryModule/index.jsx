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
import { useStoreZustand } from "../../zustan_store/useStoreZustand";
import BackDrop from "./components/backdrop";
import { array } from "yup";
import AlertAccountHistory from "./components/alert";
import Charts from "./components/sections/charts";
import useAccountData from "../../hooks/accountDataHook";
import useCombinedSlices from "../../hooks/useCombinedSlices";

function AccountHistoryModule() {
  const {
    setInformationContributorPersonalData,
    informationContributorPersonalData, 
     photos, 
     debts, 
    payments,
     setDebts, 
    setPayments,
    setActions, 
     setPhotos, 
    alertInfo,
  } = useStoreZustand();

  const {
    accountData,
    /* setInformationContributorPersonalData,
    informationContributorPersonalData, */
   /*  setActions,
    setPhotos,
    setInformationContributorPersonalData,
    informationContributorPersonalData,
    photos,
    debts, */
 /*    payments,
    setPayments, */
    /* setDebts, */
  } = useAccountData();

  const [selectedTab, setSelectedTab] = React.useState(
    "Contributor" /* "FormularioDatosFaltantes" */
  );

  const handleTabChange = (event, newTab) => {
    //?Estados Globales
    setSelectedTab(newTab);
  };
  //?Estados locales

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  //?Handles
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handelOpenBackDrop = () => {
    setOpenBackDrop(true);
  };

  const handelCloseBackDrop = () => {
    setOpenBackDrop(false);
  };

  //?Funcion Render

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
      case "Statistics":
        return <Charts />;

      default:
        return null;
    }
  };

  //?

  React.useEffect(() => {
    let accountDataIndexes = {
      userProfileContributor: { index: [] },
      debtInfoContributor: { index: [] },
      paymentInfoContributor: { index: [] },
      dateCaptureInfoContributor: { index: [] },
      imageUrlInfoContributor: { index: [] },
    };

    const keyMapping = {
      account: "userProfileContributor",
      debt_amount: "debtInfoContributor",
      reference: "paymentInfoContributor",
      date_capture: "dateCaptureInfoContributor",
      image_url: "imageUrlInfoContributor",
    };

    if (accountData) {
      accountData.forEach((el, i) => {
        console.log(el);
        for (const key in el) {
          const prop = keyMapping[key];
          if (prop !== undefined) {
            accountDataIndexes[prop].index.push(i);
          }
        }
      });
    }

    let data = {};

    console.log(accountDataIndexes);

    if (accountDataIndexes.userProfileContributor.index.length > 1) {
      accountDataIndexes.userProfileContributor.index.forEach(
        (iteration, index) => {
          for (const key in accountData[iteration]) {
            data = {
              ...data,
              [`${key}_${index + 1}`]: accountData?.[iteration][key],
            };
          }
        }
      );
    } else {
      const iteration = accountDataIndexes.userProfileContributor.index;
      if (iteration !== undefined && accountData) {
        let arrayInformationContributorPersonalData = [{}];
        for (const key in accountData[iteration]) {
          // Hace push de los datos al array
          arrayInformationContributorPersonalData[key] =
            accountData[iteration][key];

          // Hace push de los datos al objeto data

          data = {
            ...data,
            [key]: accountData?.[iteration][key],
          };
        }
        console.log(arrayInformationContributorPersonalData);

        setInformationContributorPersonalData(
          arrayInformationContributorPersonalData
        );
      }
    }

    if (accountDataIndexes.debtInfoContributor.index.length > 1) {
      accountDataIndexes.debtInfoContributor.index.forEach(
        (iteration, index) => {
          for (const key in accountData[iteration]) {
            data = {
              ...data,
              [`${key}_${index + 1}`]: accountData?.[iteration][key],
            };
          }
        }
      );
    }
    if (accountDataIndexes.paymentInfoContributor.index.length > 1) {
      accountDataIndexes.paymentInfoContributor.index
        .slice(1)
        .forEach((iteration, index) => {
          for (const key in accountData[iteration]) {
            data = {
              ...data,
              [`${key}_${index + 1}`]: accountData?.[iteration][key],
            };
          }
        });
    }

    if (accountDataIndexes.dateCaptureInfoContributor.index.length > 1) {
      accountDataIndexes.dateCaptureInfoContributor.index.forEach(
        (iteration, index) => {
          for (const key in accountData[iteration]) {
            data = {
              ...data,
              [`${key}_capture_info_${index + 1}`]:
                accountData?.[iteration][key],
            };
          }
        }
      );
    }
    if (accountDataIndexes.imageUrlInfoContributor.index.length > 1) {
      accountDataIndexes.imageUrlInfoContributor.index.forEach(
        (iteration, index) => {
          for (const key in accountData?.[iteration]) {
            data = {
              ...data,
              [`${key}_${index + 1}`]: accountData?.[iteration][key],
            };
          }
        }
      );
    }else if(accountDataIndexes.imageUrlInfoContributor.index.length === 1){
      accountDataIndexes.imageUrlInfoContributor.index.forEach(
        (iteration, index) => {
          for (const key in accountData?.[iteration]) {
            data = {
              ...data,
              [`${key}_${index + 1}`]: accountData?.[iteration][key],
            };
          }
          console.log(iteration);
        /*   for (const key in accountData?.[iteration]) {
            data = {
              ...data,
              [`${key}_${index + 1}`]: accountData?.[iteration][key],
            };
          } */
        }
      );
      
     

    }

    console.log(data);

    const arrayDebts = [];

    for (
      let i = 1;
      i <= accountDataIndexes.debtInfoContributor.index.length;
      i++
    ) {
      const debt = {
        debtAmount: data?.[`debt_amount_${i}`],
        lastPaymentDate: data?.[`last_payment_date_${i}`],
        updateDate: data?.[`update_date_${i}`],
        cutoffDate: data?.[`cutoff_date_${i}`],
        lasTwoMonthPayment: data?.[`last_two_month_payment_${i}`],
      };

      arrayDebts.push(debt);
    }

    setDebts(arrayDebts);

    const arrayPayments = [];

    for (
      let i = 1;
      i <= accountDataIndexes.paymentInfoContributor.index.length;
      i++
    ) {
      const payment = {
        referencia: data?.[`reference_${i}`],
        fechaDePago: data?.[`payment_date_${i}`],
        descripcion: data?.[`description_${i}`],
        montoPagado: data?.[`amount_paid_${i}`],
        paymentPeriod: data?.[`payment_period_${i}`],
      };

      arrayPayments.push(payment);
    }
    setPayments(arrayPayments);

    const arrayActions = [];
    for (
      let i = 1;
      i <= accountDataIndexes.dateCaptureInfoContributor.index.length;
      i++
    ) {
      const action = {
        dateCapture: data?.[`date_capture_capture_info_${i}`],
        taskDone: data?.[`task_done_capture_info_${i}`],
        personWhoCapture: data?.[`person_who_capture_capture_info_${i}`],
        photoPersonWhoCapture:
          data?.[`photo_person_who_capture_capture_info_${i}`],
      };

      arrayActions.push(action);
    }
    console.log(arrayActions);
    setActions(arrayActions);

    const arrayPhotos = [];
    for (
      let i = 1;
      i <= accountDataIndexes.dateCaptureInfoContributor.index.length;
      i++
    ) {
      const photo = {
        imageId: data?.[`image_id_${i}`],
        imageUrl: data?.[`image_url_${i}`],
        imageType: data?.[`image_type_${i}`],
        dateCapture: data?.[`date_capture_${i}`],
        taskDone: data?.[`task_done_${i}`],
        personWhoCapture: data?.[`person_who_capture_${i}`],
        synchronizationDate: data?.[`synchronization_date_${i}`],
        photoPersonWhoCapture: data?.[`photo_person_who_capture_${i}`],
        active: data?.[`active_${i}`],
        typeLoad: data?.[`type_load_${i}`],
      };
      if (photo.imageId != undefined) {
        arrayPhotos.push(photo);
      }
    }

    console.log(arrayPhotos);

    setPhotos(arrayPhotos);
  }, [accountData, alertInfo]);

  return (
    <>
      {alertInfo && <AlertAccountHistory alertInfo={alertInfo} />}
      <Container>
        <Search
          handleOpenDialog={handleOpenDialog}
          handelOpenBackDrop={handelOpenBackDrop}
          handelCloseBackDrop={handelCloseBackDrop}
          ownerDetails={informationContributorPersonalData}
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
      {openDialog && <SearchDialog handleCloseDialog={handleCloseDialog} />}
      {openBackDrop && <BackDrop openBackDrop={openBackDrop} />}
    </>
  );
}

export default AccountHistoryModule;
