import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AdminPage from './pages/adminPage'
import HomePage from './pages/homePage'
import TestPage from './pages/test'
import LoginPage from './pages/loginPage'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <BrowserRouter>

      <div className='w-full h-[100vh]'>

        <Toaster position="top-right" />

        <Routes path="/">

          <Route path="/*" element={<HomePage />}></Route>

          <Route path="/register" element={<h1>Register Page</h1>}></Route>

          <Route path="/login" element={<LoginPage />}></Route>

          <Route path="/admin/*" element={<AdminPage />}></Route>

          <Route path="/test" element={<TestPage />}></Route>
        </Routes>

      </div>

    </BrowserRouter>
  )
}

export default App
