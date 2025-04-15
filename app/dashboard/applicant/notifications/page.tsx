"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { withAuth } from "@/lib/auth"
import { Bell, CheckCircle, Clock, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    title: "Application Received",
    message: "Your application has been received and is under review.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: false,
    type: "application",
  },
  {
    id: "2",
    title: "Document Verification",
    message: "Please upload your pending documents to complete your application.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: false,
    type: "document",
  },
  {
    id: "3",
    title: "Payment Reminder",
    message: "Your application fee payment is due. Please complete the payment to proceed with your application.",
    date: new Date(),
    read: true,
    type: "payment",
  },
]

function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    toast({
      title: "Notification marked as read",
      variant: "default",
    })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
      variant: "default",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-5 w-5 text-indigo-500" />
      case "document":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "payment":
        return <Bell className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <DashboardLayout userRole="applicant">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your application status</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>You have {unreadCount} unread notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No notifications to display</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="space-y-2">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${notification.read ? "" : "font-bold"}`}>{notification.title}</h3>
                        <p className="text-xs text-muted-foreground">{notification.date.toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Button variant="ghost" size="sm" className="mt-0" onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                  <Separator />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Email Notifications</h3>
              <p className="text-sm text-muted-foreground">
                You will receive email notifications for important updates regarding your application.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">SMS Notifications</h3>
              <p className="text-sm text-muted-foreground">
                You will receive SMS notifications for critical updates that require immediate attention.
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">In-App Notifications</h3>
              <p className="text-sm text-muted-foreground">
                You will receive in-app notifications for all updates related to your application.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(NotificationsPage, ["applicant"])
