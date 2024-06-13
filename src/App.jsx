import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import SidebarMap from "./scenes/global/SidebarMap";
import Dashboard from "./scenes/dashboard-direccion";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Home from './scenes/home'
import Login from './scenes/login'
import NewUser from './scenes/new-user'
import MapList from './scenes/maps'
import Map from './scenes/map'
import Maintenance from './scenes/maintenance'
import WorkAssignment from './scenes/assignment'
import DashboardCoordinator from './scenes/dashboard-coordinacion'
import Geocoding from './scenes/geocoding'
import Account from './scenes/account'
import UsersList from './scenes/users-list'
import UserNew from './scenes/user-new'
import WorkAttendance from './scenes/work-attendance'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { esES } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/es';

import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { verifyTokenRequest } from "./api/auth";
import AccountHistory from "./scenes/account-history";
import SheetGenerator from "./scenes/sheet-generator";
import ValidPayment from './scenes/valid-payment'
import Task from "./scenes/task";
import Service from "./scenes/service";
import Process from "./scenes/process";
import Roles from "./scenes/roles"
import Menu from "./scenes/menu";
import Permission from "./scenes/permission";
import Places from "./scenes/places";
import CoordinationDashboard from './scenes/coordination-dashboard'
import TrafficLight from './scenes/traffic-light'
import SurveyReport from './scenes/survey-report'


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [login, setLogin] = useState(null);
  let location = useLocation()
  const navigation = useNavigate();
  const mapa_seleccionado = useSelector((state) => state.plaza_mapa)

  useEffect(() => {
    checkLogin()
  }, [])

  
   async function checkLogin() {

    const cookies = Cookies.get()
    
    if (Object.keys(cookies).length === 0) {
      setIsAuthenticated(false);
      return
    }

    if (!cookies.token) {
      setIsAuthenticated(false);
      return
    }

    try {
      const res = await verifyTokenRequest(cookies.token)
      console.log(res)
      if (!res.data) {
        setIsAuthenticated(false)
        return
      }

      setIsAuthenticated(true)

    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  useEffect(()=>{
    // console.log(isAuthenticated)
    if (!isAuthenticated) {
      setLogin(null)
      navigation('/')
    } else {
      setLogin(true)
      navigation('/home')
    }
  }, [isAuthenticated])


  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}
        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
        adapterLocale="es"
      >
        {login === null ? (
          <Routes>
            <Route path="/" element={<Login setLogin={setLogin} />} />
          </Routes>
        ) : (
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <div className="app">
                {location.pathname !== `/map/${mapa_seleccionado.place_id}` ? (<Sidebar isSidebar={isSidebar} />) : (<SidebarMap isSidebar={isSidebar} />)}
                <main className="content">
                  <Topbar setIsSidebar={setIsSidebar} />
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard-direccion" element={<Dashboard setLogin={setLogin} />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/bar" element={<Bar />} />
                    <Route path="/pie" element={<Pie />} />
                    <Route path="/line" element={<Line />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/geography" element={<Geography />} />
                    <Route path="/new-user" element={<NewUser />} />
                    <Route path="/map-list" element={<MapList />} />
                    <Route path="/map/:place_id" element={<Map />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/assignment" element={<WorkAssignment />} />
                    <Route path="/dashboard-coordinator" element={<DashboardCoordinator />} />
                    <Route path="/geocoding" element={<Geocoding />} />                    
                    <Route path="/valid-payment" element={< ValidPayment/>}/>
                    <Route path="/task" element={<Task/>}/>
                    <Route path="/service" element={<Service/>}/>
                    <Route path="/process" element={<Process/>}/>
                    <Route path="/menu" element={<Menu/>}/>
                    <Route path="/permission" element={<Permission/>}/>
                    <Route path="/places" element={<Places/>}/>
                    <Route path="/users-list" element={<UsersList/>}/>
                    <Route path="/user-new" element={<UserNew/>}/>
                    <Route path="/account-history" element={<AccountHistory />} />
                    <Route path="/valid-payment" element={< ValidPayment />} />
                    <Route path="/task" element={<Task />} />
                    <Route path="/service" element={<Service />} />
                    <Route path="/process" element={<Process />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/permission" element={<Permission />} />
                    <Route path="/places" element={<Places />} />
                    <Route path="/work-attendance" element={<WorkAttendance />} />
                    <Route path="/coordination-dashboard" element={<CoordinationDashboard />} />
                    <Route path="/survey-report" element={<SurveyReport />} />
                    <Route path="/traffic-light" element={<TrafficLight />} />
                  </Routes>
                </main>

              </div>
            </ThemeProvider>
          </ColorModeContext.Provider>
        )}
      </LocalizationProvider>
    </>
  );
}

export default App;
