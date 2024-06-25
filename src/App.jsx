import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/es';
import { useSelector } from 'react-redux';
import { verifyTokenRequest } from "./api/auth";

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
import Calendar from "./scenes/calendar/calendar";
import Home from './scenes/home';
import Login from './scenes/login';
import NewUser from './scenes/new-user';
import MapList from './scenes/maps';
import Map from './scenes/map';
import Maintenance from './scenes/maintenance';
import WorkAssignment from './scenes/assignment';
import DashboardCoordinator from './scenes/dashboard-coordinacion';
import Geocoding from './scenes/geocoding';
import UsersList from './scenes/users-list';
import UserNew from './scenes/user-new';
import WorkAttendance from './scenes/work-attendance';
import AccountHistory from "./scenes/account-history";
import ValidPayment from './scenes/valid-payment';
import Task from "./scenes/task";
import Service from "./scenes/service";
import Process from "./scenes/process";
import Roles from "./scenes/roles";
import Menu from "./scenes/menu";
import Permission from "./scenes/permission";
import Places from "./scenes/places";
import CoordinationDashboard from './scenes/coordination-dashboard';
import TrafficLight from './scenes/traffic-light';
import SurveyReport from './scenes/survey-report';
import Records from './scenes/records';
import RecordsBackup from './scenes/records-backup';
import RecordsImpression from './scenes/records-impression';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);  // Nuevo estado para manejar la carga inicial
  let location = useLocation();
  const navigate = useNavigate();
  const mapa_seleccionado = useSelector((state) => state.plaza_mapa);

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);  // Finaliza la verificación
      return;
    }

    try {
      const res = await verifyTokenRequest(token);

      if (!res.data) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);  // Finaliza la verificación
    }
  }

  useEffect(() => {
    if (!checkingAuth) {
      if (!isAuthenticated && location.pathname !== '/') {
        navigate('/');
      } else if (isAuthenticated && location.pathname === '/') {
        navigate('/home');
      }
    }
  }, [isAuthenticated, navigate, location.pathname, checkingAuth]);

  if (checkingAuth) {
    return null; // O un componente de carga si lo prefieres
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
      adapterLocale="es"
    >
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Login setLogin={setIsAuthenticated} />} />
            {isAuthenticated && (
              <Route
                path="*"
                element={
                  <div className="app">
                    {location.pathname !== `/map/${mapa_seleccionado.place_id}` ? (
                      <Sidebar isSidebar={isSidebar} />
                    ) : (
                      <SidebarMap isSidebar={isSidebar} />
                    )}
                    <main className="content">
                      <Topbar setIsSidebar={setIsSidebar} />
                      <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/dashboard-direccion" element={<Dashboard setLogin={setIsAuthenticated} />} />
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
                        <Route path="/valid-payment" element={<ValidPayment />} />
                        <Route path="/task" element={<Task />} />
                        <Route path="/service" element={<Service />} />
                        <Route path="/process" element={<Process />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/permission" element={<Permission />} />
                        <Route path="/places" element={<Places />} />
                        <Route path="/users-list" element={<UsersList />} />
                        <Route path="/user-new" element={<UserNew />} />
                        <Route path="/account-history" element={<AccountHistory />} />
                        <Route path="/work-attendance" element={<WorkAttendance />} />
                        <Route path="/coordination-dashboard" element={<CoordinationDashboard />} />
                        <Route path="/survey-report" element={<SurveyReport />} />
                        <Route path="/traffic-light" element={<TrafficLight />} />
                        <Route path="/records" element={<Records />} />
                        <Route path="/backup" element={<RecordsBackup />} />
                        <Route path="/impresion" element={<RecordsImpression />} />
                      </Routes>
                    </main>
                  </div>
                }
              />
            )}
          </Routes>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
}

export default App;