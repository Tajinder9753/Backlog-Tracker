import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { UserProvider } from './context/UserContext'
import ProtectedRoutes from './components/ProtectedRoutes'
import { Register } from './pages/Register'
import { Navbar } from './components/Navbar'

function App() {

  return (
    <>
    <UserProvider>
      <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

      </Routes>
    </UserProvider>

    </>
  )
}

export default App
