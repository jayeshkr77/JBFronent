import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './login';
import EmailVerify from './emailVerify';
import SetPin from './setPin';

function Home() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:token" element={<EmailVerify />} />
          <Route path="/set/pin" element={<SetPin />} />
          <Route path="/user" element={<p>user Dashboard</p>} />
          <Route path="*" element={<h1> You are lost. 404 Not found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default Home;