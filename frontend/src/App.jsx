import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NoteEditor from './components/NoteEditorModal';
import NotFound from './pages/NotFound';
import CreateNote from './pages/CreateNote';
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
  
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/notes/new" element={<ProtectedRoute><NoteEditor /> </ProtectedRoute>} />
        <Route path="/notes/:id/edit" element={<ProtectedRoute><NoteEditor /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateNote /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route/>
  </Routes>
  </BrowserRouter>
  </div>
)
}
export default App;