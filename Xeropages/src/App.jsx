import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Components/login.jsx";
import Home from "./Components/homepage.jsx";
function App() {
   
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
