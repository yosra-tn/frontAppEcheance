import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './pages/Header';
import './App.css';
import SignUp from './pages/SignIn';
import Login from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import ProfilePage from './pages/ProfilePage';
import FormUpdateMdp from './pages/FormUpdateMdp';


function App() {
  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/Calendar" element={<CalendarPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path='/FormUpdateMdp' element={<FormUpdateMdp/>} />
      </Routes>
    </div>
  );
}

export default App;
