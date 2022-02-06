import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './login';
import Register from  './register';
import EmailVerify from './emailVerify';
import SetPin from './setPin';
import Dashboard from './dashboard';

function Home() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:token" element={<EmailVerify />} />
          <Route path="/set/pin" element={<SetPin />} />
          <Route path="/user" element={<Dashboard />} />
          <Route path="*" element={<h1> You are lost. 404 Not found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default Home;