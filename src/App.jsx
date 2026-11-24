import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
import { CssBaseline, ThemeProvider } from "@mui/material"
import { useMode } from "./theme"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { esES } from '@mui/x-date-pickers/locales'
import 'dayjs/locale/es'
import { useSelector, useDispatch } from 'react-redux'
import { verifyTokenRequest } from "./api/auth"
import Armazon from "./components/armazon/Armazon"
import Dashboard from "./scenes/dashboard-direccion"
import Team from "./scenes/team"
import Invoices from "./scenes/invoices"
import Contacts from "./scenes/contacts"
import Bar from "./scenes/bar"
import Form from "./scenes/form"
import Line from "./scenes/line"
import Pie from "./scenes/pie"
import FAQ from "./scenes/faq"
import Geography from "./scenes/geography"
import Calendar from "./scenes/calendar/calendar"
import Home from './scenes/home'
import Login from './scenes/login'
import MapList from './scenes/maps'
import Map from './scenes/map'
import Maintenance from './scenes/maintenance'
import WorkAssignment from './scenes/assignment'
import DashboardCoordinator from './scenes/dashboard-coordinacion'
import Geocoding from './scenes/geocoding'
import Usuarios from './scenes/usuarios' // S02-H2.4
import EditarUsuario from './scenes/usuarios/EditarUsuario' // S02-H2.4
import WorkAttendance from './scenes/work-attendance'
import AccountHistory from "./scenes/account-history"
import ValidPayment from './scenes/valid-payment'
import Task from "./scenes/task"
import Service from "./scenes/service"
import Process from "./scenes/process"
import Roles from "./scenes/roles"
import Menu from "./scenes/menu"
import Permission from "./scenes/permission"
import Places from "./scenes/places"
import CoordinationDashboard from './scenes/coordination-dashboard'
import TrafficLight from './scenes/traffic-light'
import SurveyReport from './scenes/survey-report'
import Records from './scenes/records'
import RecordsBackup from './scenes/records-backup'
import RecordsImpression from './scenes/records-impression'
import Inventory from './scenes/inventory'
import ManagerDashboard from './scenes/manager-dashboard'
import PhotoManagement from './scenes/photo-management'
import { initializeWebSocket } from './config/WebSocketManager'
import { submenuAccessLogRequest } from './api/submenu'
import DebtRecord from './scenes/debt-record'
import DirectionDashboard from './scenes/direction-dashboard'
import Manuals from './scenes/manuals'
import Individual from './scenes/inventory/individual'
import Credict from './scenes/credit'
import TestRh from './scenes/rh-test'
import ReportsTestRH from './scenes/rerports-test-rh'
import Lektor from './scenes/lektor'
import Managements from './scenes/managements'
import AssignmentManager from './scenes/assignment-management'
import AccountDetails from './scenes/account-details'
import CitizenAttentionAppointments from './scenes/citizen-attention-appointments'
import InventoryList from './scenes/inventory-list'
import NewInventory from './scenes/new-inventory'
import ResponsiveGenerator from './scenes/responsive-generator'
import ResponsiveGeneratorInitial from './scenes/responsive-generator-initial'
import ReturnGenerator from './scenes/return-generator'
import VerificationResponsive from './scenes/verification-responsiva'
import Chat from './scenes/chat-support'
import HomeCoordination from './scenes/home-coordination'
import PaymentValidation from './scenes/payment-validation'
import CoordinationMonitor from './scenes/coordinator-monitor'
import InventoryMonitor from './scenes/inventory-monitor'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [theme] = useMode()
  const [checkingAuth, setCheckingAuth] = useState(true)
  let location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user);

  useEffect(() => {
    checkLogin()
  }, [])

  useEffect(() => {
    SubmenuAccessLog(location.pathname)
    // console.log(location.pathname)
  }, [location.pathname])

  const SubmenuAccessLog = async (menu) => {
    try {
      const submenu_access_data = {
        username: user.username,
        menu_name: menu
      };

      await submenuAccessLogRequest(submenu_access_data);

    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    initializeWebSocket(dispatch);
  }, [dispatch]);

  async function checkLogin() {
    const token = localStorage.getItem('token')

    if (!token) {
      setIsAuthenticated(false)
      setCheckingAuth(false)
      return
    }

    try {
      const res = await verifyTokenRequest(token)

      if (!res.data) {
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }

    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setCheckingAuth(false)
    }
  }

  useEffect(() => {
    if (!checkingAuth) {
      if (!isAuthenticated && location.pathname !== '/') {
        navigate('/')
      } else if (isAuthenticated && location.pathname === '/') {
        navigate('/home')
      }
    }
  }, [isAuthenticated, navigate, location.pathname, checkingAuth])

  if (checkingAuth) {
    return null
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
      adapterLocale="es"
    >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Login setLogin={setIsAuthenticated} />} />
            {isAuthenticated && (
              <Route
                path="*"
                element={
                  <Armazon>
                      <Routes>
                        <Route path="/home" element={
                          user.profile === 'Coordinador' ? <HomeCoordination /> : <Home />
                        } />
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
                        {/* S02-H2.4: pantallas viejas de usuarios reemplazadas por /usuarios; las rutas viejas redirigen */}
                        <Route path="/new-user" element={<Navigate to="/usuarios/nuevo" replace />} />
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
                        <Route path="/users-list" element={<Navigate to="/usuarios" replace />} />
                        <Route path="/user-new" element={<Navigate to="/usuarios/nuevo" replace />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/usuarios/nuevo" element={<EditarUsuario />} />
                        <Route path="/usuarios/:id" element={<EditarUsuario />} />
                        <Route path="/account-history" element={<AccountHistory />} />
                        <Route path="/work-attendance" element={<WorkAttendance />} />
                        <Route path="/coordination-dashboard" element={<CoordinationDashboard />} />
                        <Route path="/survey-report" element={<SurveyReport />} />
                        <Route path="/traffic-light" element={<TrafficLight />} />
                        {/* <Route path="/debt-record" element={<DebtRecord />} /> */}
                        <Route path="/records" element={<Records />} />
                        <Route path="/backup" element={<RecordsBackup />} />
                        <Route path="/impresion" element={<RecordsImpression />} />
                        <Route path="/vehiculos" element={<Inventory />} />
                        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                        <Route path="/photo-management" element={<PhotoManagement />} />
                        <Route path="/direction-dashboard" element={<DirectionDashboard />} />
                        <Route path="/manuals" element={<Manuals />} />
                        <Route path="/vehiculos/:vehicleNumber" element={<Individual />} />
                        <Route path="/credit" element={<Credict />} />
                        <Route path="/test-rh" element={<TestRh />} />
                        <Route path="/reports-test-rh" element={<ReportsTestRH />} />
                        <Route path="/lektor" element={<Lektor />} />
                        <Route path="/managements" element={<Managements />} />
                        <Route path="/assignment-manager" element={<AssignmentManager />} />
                        <Route path="/account-details" element={<AccountDetails />} />
                        <Route path="/citizen-attention-appointments" element={<CitizenAttentionAppointments />} />
                        <Route path="/inventory-list" element={<InventoryList />} />
                        <Route path="/new-inventory" element={<NewInventory />} />
                        <Route path="/responsive-generator" element={<ResponsiveGenerator />} />
                        <Route path="/responsive-generator-initial" element={<ResponsiveGeneratorInitial />} />
                        <Route path="/return-generator" element={<ReturnGenerator />} />
                        <Route path="/verification-responsiva" element={<VerificationResponsive />} />
                        <Route path="/chat-support" element={<Chat />} />
                        <Route path="/home-coordination" element={<HomeCoordination />} />
                        <Route path="/payment-validation" element={<PaymentValidation />} />
                        <Route path="/coordinator-monitor" element={<CoordinationMonitor />} />
                        <Route path="/inventory-monitor" element={<InventoryMonitor />} />
                      </Routes>
                  </Armazon>
                }
              />
            )}
          </Routes>
        </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;