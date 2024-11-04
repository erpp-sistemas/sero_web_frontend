import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import GroupsIcon from '@mui/icons-material/Groups';
import BuildIcon from '@mui/icons-material/Build';
import MemoryIcon from '@mui/icons-material/Memory';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DesktopAccessDisabledIcon from '@mui/icons-material/DesktopAccessDisabled';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import ArticleIcon from '@mui/icons-material/Article';
import DiscountIcon from '@mui/icons-material/Discount';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MapIcon from '@mui/icons-material/Map';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HomeIcon from '@mui/icons-material/Home';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditIcon from '@mui/icons-material/Edit';
import FaceIcon from '@mui/icons-material/Face';
import QrCodeIcon from '@mui/icons-material/QrCode';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BlurLinearIcon from '@mui/icons-material/BlurLinear';
import PolylineIcon from '@mui/icons-material/Polyline';
import SearchIcon from '@mui/icons-material/Search';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PlaceIcon from '@mui/icons-material/Place';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import RepeatIcon from '@mui/icons-material/Repeat';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonIcon from '@mui/icons-material/Person';
import LayersIcon from '@mui/icons-material/Layers';
import AppsIcon from '@mui/icons-material/Apps';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import SaveIcon from '@mui/icons-material/Save';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CloseIcon from '@mui/icons-material/Close';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import PieChartIcon from '@mui/icons-material/PieChart';
import BrushIcon from '@mui/icons-material/Brush';
import InfoIcon from '@mui/icons-material/Info';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import HelpIcon from '@mui/icons-material/Help';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export const getIcon = (icon, style) => {

     let obj = {
          "FilterAltIcon": <FilterAltIcon sx={style} />,
          "ArrowBackIcon": <ArrowBackIcon sx={style} />,
          "HelpIcon": <HelpIcon sx={style} />,
          "NotStartedIcon": <NotStartedIcon sx={style} />,
          "PictureAsPdfIcon": <PictureAsPdfIcon sx={style} />,
          "InfoIcon": <InfoIcon sx={style} />,
          "BrushIcon": <BrushIcon sx={style} />,
          "PieChartIcon": <PieChartIcon sx={style} />,
          "AltRouteIcon": <AltRouteIcon sx={style} />,
          "CloseIcon": <CloseIcon sx={style} />,
          "ViewKanbanIcon": <ViewKanbanIcon sx={style} />,
          "SaveIcon": <SaveIcon sx={style} />,
          "ZoomInMapIcon": <ZoomInMapIcon sx={style} />,
          "GpsFixedIcon": <GpsFixedIcon sx={style} />,
          "FiberSmartRecordIcon": <FiberSmartRecordIcon sx={style} />,
          "LightModeOutlinedIcon": <LightModeOutlinedIcon sx={style} />,
          "DarkModeOutlinedIcon": <DarkModeOutlinedIcon sx={style} />,
          "NotificationsOutlinedIcon": <NotificationsOutlinedIcon sx={style} />,
          "AppsIcon": <AppsIcon sx={style} />,
          "LayersIcon": <LayersIcon sx={style} />,
          "PersonIcon": <PersonIcon sx={style} />,
          "ContactsIcon": <ContactsIcon sx={style} />,
          "SkipNextIcon": <SkipNextIcon sx={style} />,
          "BookmarkAddedIcon": <BookmarkAddedIcon sx={style} />,
          "BackupTableIcon": <BackupTableIcon sx={style} />,
          "AccountCircleIcon": <AccountCircleIcon sx={style} />,
          "BarChartIcon": <BarChartIcon sx={style} />,
          "LaptopMacIcon": <LaptopMacIcon sx={style} />,
          "RepeatIcon": <RepeatIcon sx={style} />,
          "PlaceIcon": <PlaceIcon sx={style} />,
          "ColorLensIcon": <ColorLensIcon sx={style}/>,
          "CheckCircleIcon": <CheckCircleIcon sx={style} />,
          "VolumeUpIcon": <VolumeUpIcon sx={style} />,
          "AccessTimeFilledIcon": <AccessTimeFilledIcon sx={style} />,
          "CloudDownloadIcon": <CloudDownloadIcon sx={style} />,
          "LineWeightIcon": <LineWeightIcon sx={style} />,
          "DeleteIcon": <DeleteIcon sx={style} />,
          "PhotoSizeSelectActualIcon": <PhotoSizeSelectActualIcon sx={style} />,
          "EditLocationAltIcon": <EditLocationAltIcon sx={style} />,
          "PolylineIcon": <PolylineIcon sx={style} />,
          "AdminPanelSettingsOutlinedIcon": <AdminPanelSettingsOutlinedIcon sx={style} />,
          "EditIcon": <EditIcon sx={style} />,
          "FaceIcon": <FaceIcon sx={style} />,
          "QrCodeIcon": <QrCodeIcon sx={style} />,
          "GroupAddIcon": <GroupAddIcon sx={style} />,
          "PhonelinkSetupIcon": <PhonelinkSetupIcon sx={style} />,
          "AssignmentIndIcon": <AssignmentIndIcon sx={style} />,
          "BlurLinearIcon": <BlurLinearIcon sx={style} />,
          "MenuOutlinedIcon": <MenuOutlinedIcon sx={style} />,
          "LogoutIcon": <LogoutIcon sx={style} />,
          "ArticleIcon": <ArticleIcon sx={style} />,
          "DiscountIcon": <DiscountIcon sx={style} />,
          "CalendarMonthIcon": <CalendarMonthIcon sx={style} />,
          "MapIcon": <MapIcon sx={style} />,
          "WhatsAppIcon": <WhatsAppIcon sx={style} />,
          "HomeIcon": <HomeIcon sx={style} />,
          "Searchicon": <SearchIcon sx={style} />
           // "AccessAlarmIcon": <AccessAlarmIcon sx={style} />,
          // "GroupsIcon": <GroupsIcon sx={style} />,
          // "BuildIcon": <BuildIcon sx={style} />,
          // "MemoryIcon": <MemoryIcon sx={style} />,
          // "WidgetsIcon": <WidgetsIcon sx={style} />,
          // "DesktopAccessDisabledIcon": <DesktopAccessDisabledIcon sx={style} />,
          // "AssignmentIcon": <AssignmentIcon sx={style} />,
          // "AppRegistrationIcon": <AppRegistrationIcon sx={style} />,
          // "ContactMailIcon": <ContactMailIcon sx={style} />,
     }

     return obj[icon]
}
