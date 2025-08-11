"use client"

import { useState, useEffect } from "react"
import Login from "../login"
import ReminderDashboard from "../reminder-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, Bell } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function BookingSystemApp() {
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<"bookings" | "reminders">("bookings")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user_session")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user_session")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("user_session")
    setUser(null)
    setCurrentView("bookings")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-green-800">Botshabelo Digital Hub</h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Welcome, {user.name}</span>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="flex space-x-2">
                <Button
                  variant={currentView === "bookings" ? "default" : "ghost"}
                  onClick={() => setCurrentView("bookings")}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Bookings</span>
                </Button>
                <Button
                  variant={currentView === "reminders" ? "default" : "ghost"}
                  onClick={() => setCurrentView("reminders")}
                  className="flex items-center space-x-2"
                >
                  <Bell className="h-4 w-4" />
                  <span>Reminders</span>
                </Button>
              </nav>

              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === "reminders" ? (
          <ReminderDashboard />
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Booking System</h2>
              <p className="text-gray-600">
                Your existing booking system content goes here. This would be your current HTML/JavaScript booking
                interface converted to React.
              </p>
              {/* Insert your existing booking system components here */}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
