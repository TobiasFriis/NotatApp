
import './App.css'
import { Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage';;
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/NotesPage';

function App() {

  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/notes' element={<NotesPage />} />
    </Routes>
  )
}

export default App
