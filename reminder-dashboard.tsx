"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Calendar, Clock, User, MapPin, CheckCircle, AlertCircle } from "lucide-react"

interface Reminder {
  reminder_id: string
  booking_id: string
  event_title: string
  booking_date: string
  start_time: string
  user_name: string
  user_email: string
  facility_name: string
  reminder_message: string
  days_until_event: number
}

export default function ReminderDashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  // Mock data - replace with actual Supabase calls
  useEffect(() => {
    const fetchReminders = async () => {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock reminder data
      const mockReminders: Reminder[] = [
        {
          reminder_id: "1",
          booking_id: "booking-1",
          event_title: "Corporate Training Workshop",
          booking_date: "2024-03-15",
          start_time: "09:00",
          user_name: "John Smith",
          user_email: "john@company.com",
          facility_name: "Board Room",
          reminder_message: "Biweekly reminder: Upcoming event in 14 days",
          days_until_event: 14,
        },
        {
          reminder_id: "2",
          booking_id: "booking-2",
          event_title: "Government Meeting",
          booking_date: "2024-02-28",
          start_time: "14:00",
          user_name: "Sarah Johnson",
          user_email: "sarah@gov.za",
          facility_name: "Auditorium",
          reminder_message: "Final reminder: Event is tomorrow!",
          days_until_event: 1,
        },
      ]

      setReminders(mockReminders)
      setIsLoading(false)
    }

    fetchReminders()
  }, [])

  const markReminderAsSent = async (reminderId: string) => {
    setProcessingIds((prev) => new Set(prev).add(reminderId))

    try {
      // Simulate API call to mark reminder as sent
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from list
      setReminders((prev) => prev.filter((r) => r.reminder_id !== reminderId))

      // Show success toast (you can implement this)
      console.log("Reminder marked as sent")
    } catch (error) {
      console.error("Failed to mark reminder as sent:", error)
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reminderId)
        return newSet
      })
    }
  }

  const getReminderUrgency = (daysUntil: number) => {
    if (daysUntil <= 1) return { color: "destructive", label: "URGENT" }
    if (daysUntil <= 7) return { color: "default", label: "SOON" }
    return { color: "secondary", label: "UPCOMING" }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-green-800">Event Reminders</h1>
            <p className="text-gray-600">Manage upcoming event notifications</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {reminders.length} Pending
        </Badge>
      </div>

      {reminders.length === 0 ? (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>No pending reminders at this time. All caught up! 🎉</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => {
            const urgency = getReminderUrgency(reminder.days_until_event)
            const isProcessing = processingIds.has(reminder.reminder_id)

            return (
              <Card key={reminder.reminder_id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{reminder.event_title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(reminder.booking_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{reminder.start_time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={urgency.color as any}>{urgency.label}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium">{reminder.user_name}</p>
                        <p className="text-gray-600">{reminder.user_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{reminder.facility_name}</span>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Days until event: {reminder.days_until_event}</strong>
                      <br />
                      {reminder.reminder_message}
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => markReminderAsSent(reminder.reminder_id)}
                      disabled={isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? "Processing..." : "Mark as Notified"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
