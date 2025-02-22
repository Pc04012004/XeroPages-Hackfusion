import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Components/Login/login.jsx";
import Home from "./Components/Homepage/homepage.jsx";
import ElectionHome from './Components/Elections/election-home.jsx';
import RegisterVoter from './Components/Elections/registerVoter.jsx';
import RegisterCandidate from './Components/Elections/registerCandidate.jsx';
import ElectionPost from './Components/Elections/election-post.jsx';
import ElectionNominee from './Components/Elections/election-nominee.jsx';
import AdminNominee from './Components/Elections/nominee_admin.jsx';
import StudentEditProfile from './Components/Profile/student-edit.jsx';
import FacultyEditProfile from './Components/Profile/faculty-edit.jsx';
import ProfilePage from './Components/Profile/profile-home.jsx';
import StudentDashboard from './Components/Health-Leave/hl-student.jsx';
import LeaveHistory from './Components/Health-Leave/leave-history.jsx';
import WardenDashboard from './Components/Health-Leave/hl-warden.jsx';
import DoctorDashboard from './Components/Health-Leave/hl-doctor.jsx';
import HodDashboard from './Components/Health-Leave/hl-hod.jsx';
import SecurityDashboard from './Components/Health-Leave/hl-security.jsx';
import FacilityView from './Components/CampusFacility/facility-view.jsx';
import MentalHealth from './Components/Mental-Health/mental-health.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/elections" element={<ElectionHome />} />
        <Route path="/elections/register-voter" element={<RegisterVoter />} />
        <Route path="/elections/register-candidate" element={<RegisterCandidate />} />
        <Route path="/elections/:postTitle" element={<ElectionPost />} />
        <Route path="/elections/nominee/" element={<ElectionNominee />} />
        <Route path="elections/admin/:nominee" element={<AdminNominee />} />
        <Route path="/home/profile/student" element={<StudentEditProfile />} />
        <Route path="/home/profile/faculty" element={<FacultyEditProfile />} />
        <Route path="/home/profile" element={<ProfilePage />} />
        <Route path="/home/health-notifications/student" element={<StudentDashboard />} />
        <Route path="/home/health-notifications/student/history" element={<LeaveHistory />} />
        <Route path="/home/health-notifications/hod" element={<HodDashboard />} />
        <Route path="/home/health-notifications/warden" element={<WardenDashboard />} />
        <Route path="/home/health-notifications/doctor" element={<DoctorDashboard />} />
        <Route path="/home/health-notifications/security)" element={<SecurityDashboard />} />
        <Route path="/home/campus-facility" element={<FacilityView />} />
        <Route path="/home/mental-health" element={<MentalHealth />} />

        

         

      </Routes>
    </Router>
  );
}

export default App;