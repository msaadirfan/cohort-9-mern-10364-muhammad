import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import {Toaster} from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';


function App(){
return (
  <div data-theme = "coffee" className="min-h-screen">
  <BrowserRouter>
  <Toaster/>
  <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route/>
  </Routes>
  </BrowserRouter>
  </div>
)
}
export default App;