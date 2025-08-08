import React, { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NewProject from './pages/NewProject'
import DynamicEstimateDisplay from './pages/DynamicEstimateDisplay'
import TechnicianProfile from './pages/TechnicianProfile'
import Navbar from './components/Navbar'
import { activityLogger, logProjectFunnel } from '../utils/ActivityLogger'

// Auth Context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email, password, userType = 'customer') => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({ 
        id: '123', 
        email, 
        name: email.split('@')[0], 
        type: userType,
        tier: userType === 'technician' ? 'bronze' : undefined,
        commissionRate: userType === 'technician' ? 33 : undefined
      })
      setIsLoading(false)
    }, 1000)
  }

  const signup = async (email, password, name, userType = 'customer') => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({ 
        id: '123', 
        email, 
        name, 
        type: userType,
        tier: userType === 'technician' ? 'bronze' : undefined,
        commissionRate: userType === 'technician' ? 33 : undefined
      })
      setIsLoading(false)
    }, 1000)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/new-project" 
              element={
                <ProtectedRoute>
                  <NewProject />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/estimate/:projectId" 
              element={
                <ProtectedRoute>
                  <EstimateDisplay />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/technician/:technicianId" 
              element={
                <TechnicianProfile />
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
