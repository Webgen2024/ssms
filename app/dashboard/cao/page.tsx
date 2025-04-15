"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCheck, FileX, ClipboardList, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { type Application, db } from "@/lib/db"
import { withAuth } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

function CAODashboard() {
  const [newApplications, setNewApplications] = useState<Application[]>([])
  const [acceptedApplications, setAcceptedApplications] = useState<Application[]>([])
  const [rejectedApplications, setRejectedApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const newApps = await db.getNewApplications()
        const acceptedApps = await db.getAcceptedApplications()
        const rejectedApps = await db.getRejectedApplications()

        setNewApplications(newApps)
        setAcceptedApplications(acceptedApps)
        setRejectedApplications(rejectedApps)
      } catch (error) {
        console.error("Error fetching applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await db.updateApplication(applicationId, {
        status: "accepted",
        updatedAt: new Date(),
      })

      // Update local state
      const updatedApp = await db.getApplicationById(applicationId)
      if (updatedApp) {
        setNewApplications((prev) => prev.filter((app) => app.id !== applicationId))
        setAcceptedApplications((prev) => [...prev, updatedApp])
      }

      toast({
        title: "Application Accepted",
        description: "The application has been accepted successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error accepting application:", error)
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectApplication = async () => {
    if (!selectedApplication) return

    try {
      await db.updateApplication(selectedApplication.id, {
        status: "rejected",
        remarks: rejectReason,
        updatedAt: new Date(),
      })

      // Update local state
      const updatedApp = await db.getApplicationById(selectedApplication.id)
      if (updatedApp) {
        setNewApplications((prev) => prev.filter((app) => app.id !== selectedApplication.id))
        setRejectedApplications((prev) => [...prev, updatedApp])
      }

      setIsRejectDialogOpen(false)
      setRejectReason("")
      setSelectedApplication(null)

      toast({
        title: "Application Rejected",
        description: "The application has been rejected successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error rejecting application:", error)
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openRejectDialog = (application: Application) => {
    setSelectedApplication(application)
    setIsRejectDialogOpen(true)
  }

  const filteredNewApplications = newApplications.filter(
    (app) =>
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAcceptedApplications = acceptedApplications.filter(
    (app) =>
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRejectedApplications = rejectedApplications.filter(
    (app) =>
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    newApplications: newApplications.length,
    acceptedApplications: acceptedApplications.length,
    rejectedApplications: rejectedApplications.length,
    totalApplications: newApplications.length + acceptedApplications.length + rejectedApplications.length,
  }

  if (loading) {
    return (
      <DashboardLayout userRole="cao">
        <div className="flex items-center justify-center h-full">
          <p>Loading application data...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="cao">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CAO Dashboard</h1>
          <p className="text-muted-foreground">Manage and review student applications.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Applications</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newApplications}</div>
              <p className="text-xs text-muted-foreground mt-2">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted Applications</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.acceptedApplications}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalApplications > 0
                  ? `${Math.round((stats.acceptedApplications / stats.totalApplications) * 100)}% acceptance rate`
                  : "No applications yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected Applications</CardTitle>
              <FileX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejectedApplications}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalApplications > 0
                  ? `${Math.round((stats.rejectedApplications / stats.totalApplications) * 100)}% rejection rate`
                  : "No applications yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-2">For 2025 academic year</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <Tabs defaultValue="new">
          <TabsList>
            <TabsTrigger value="new">New Applications</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Applications</CardTitle>
                <CardDescription>Review and process new student applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Application ID</th>
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Course</th>
                          <th className="px-4 py-3 text-left font-medium">Date</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNewApplications.length > 0 ? (
                          filteredNewApplications.map((app) => (
                            <tr key={app.id} className="border-b">
                              <td className="px-4 py-3">{app.applicationNumber}</td>
                              <td className="px-4 py-3">{app.name}</td>
                              <td className="px-4 py-3">{app.course}</td>
                              <td className="px-4 py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/cao/application/${app.id}`}>View</Link>
                                  </Button>
                                  <Button size="sm" variant="default" onClick={() => handleAcceptApplication(app.id)}>
                                    Accept
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => openRejectDialog(app)}>
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center" colSpan={5}>
                              No new applications found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accepted">
            <Card>
              <CardHeader>
                <CardTitle>Accepted Applications</CardTitle>
                <CardDescription>View all accepted applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Application ID</th>
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Course</th>
                          <th className="px-4 py-3 text-left font-medium">Date Accepted</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAcceptedApplications.length > 0 ? (
                          filteredAcceptedApplications.map((app) => (
                            <tr key={app.id} className="border-b">
                              <td className="px-4 py-3">{app.applicationNumber}</td>
                              <td className="px-4 py-3">{app.name}</td>
                              <td className="px-4 py-3">{app.course}</td>
                              <td className="px-4 py-3">{new Date(app.updatedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/dashboard/cao/application/${app.id}`}>View</Link>
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center" colSpan={5}>
                              No accepted applications found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>View all rejected applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">Application ID</th>
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Course</th>
                          <th className="px-4 py-3 text-left font-medium">Date Rejected</th>
                          <th className="px-4 py-3 text-left font-medium">Reason</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRejectedApplications.length > 0 ? (
                          filteredRejectedApplications.map((app) => (
                            <tr key={app.id} className="border-b">
                              <td className="px-4 py-3">{app.applicationNumber}</td>
                              <td className="px-4 py-3">{app.name}</td>
                              <td className="px-4 py-3">{app.course}</td>
                              <td className="px-4 py-3">{new Date(app.updatedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3">{app.remarks || "No reason provided"}</td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/dashboard/cao/application/${app.id}`}>View</Link>
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center" colSpan={6}>
                              No rejected applications found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Application: {selectedApplication?.applicationNumber}</p>
              <p className="text-sm font-medium">Applicant: {selectedApplication?.name}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Reason for Rejection
              </label>
              <Textarea
                id="reason"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectApplication} disabled={!rejectReason.trim()}>
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

export default withAuth(CAODashboard, ["cao"])
