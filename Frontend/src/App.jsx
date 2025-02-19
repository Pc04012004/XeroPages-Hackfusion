import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Components/Login/login.jsx";
import Home from "./Components/Homepage/homepage.jsx";
import Election from './Components/Elections/election.jsx';
import Register from './Components/Elections/register.jsx';
function App() {
   
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/elections" element={<Election />} />
        <Route path="/elections/register" element={<Register />} />
      </Routes>
      </Router>
    </>
  )
}

export default App
