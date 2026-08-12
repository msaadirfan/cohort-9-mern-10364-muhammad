import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NoteEditor from './pages/NoteEditor';
import Profile from './pages/Profile';


function App(){
return (
  <BrowserRouter>
  <Routes>
    <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/:id/edit" element={<NoteEditor />} />
        <Route path="/profile" element={<Profile />} />
  </Routes>
  </BrowserRouter>
)
}
export default App;