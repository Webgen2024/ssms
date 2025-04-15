"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileCheck, FileText, Bell, CreditCard, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { type Application, db } from "@/lib/db"
import { useAuth } from "@/lib/auth"
import { withAuth } from "@/lib/auth"

function ApplicantDashboard() {
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      if (user) {
        try {
          const applications = await db.getApplicationsByUserId(user.id)
          if (applications.length > 0) {
            setApplication(applications[0])
          }
        } catch (error) {
          console.error("Error fetching application:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchApplication()
  }, [user])

  if (loading) {
    return (
      <DashboardLayout userRole="applicant">
        <div className="flex items-center justify-center h-full">
          <p>Loading application data...</p>
        </div>
      </DashboardLayout>
    )
  }

  // Calculate application progress
  const getApplicationProgress = () => {
    if (!application) return 0

    let progress = 0

    // Basic info complete
    if (application.name && application.email && application.phone) {
      progress += 25
    }

    // Academic details complete
    if (application.academicDetails.tenth.percentage && application.academicDetails.twelfth.percentage) {
      progress += 25
    }

    // Address complete
    if (application.address.line1 && application.address.city && application.address.state) {
      progress += 25
    }

    // Documents uploaded
    const uploadedDocs = application.documents.filter((doc) => doc.status === "uploaded").length
    const totalDocs = application.documents.length
    progress += Math.round((uploadedDocs / totalDocs) * 25)

    return progress
  }

  const applicationProgress = getApplicationProgress()
  const uploadedDocs = application?.documents.filter((doc) => doc.status === "uploaded").length || 0
  const totalDocs = application?.documents.length || 0

  return (
    <DashboardLayout userRole="applicant">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicant Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's the status of your application.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Status</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {application
                  ? application.status === "submitted"
                    ? "Submitted"
                    : application.status === "under_review"
                      ? "Under Review"
                      : application.status === "accepted"
                        ? "Accepted"
                        : application.status === "rejected"
                          ? "Rejected"
                          : "Not Started"
                  : "Not Started"}
              </div>
              <Progress value={applicationProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {application ? new Date(application.updatedAt).toLocaleDateString() : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Number</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{application?.applicationNumber || "Not Assigned"}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Applied on: {application ? new Date(application.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {uploadedDocs}/{totalDocs}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalDocs - uploadedDocs} document{totalDocs - uploadedDocs !== 1 ? "s" : ""} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-2">New notifications</p>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important!</AlertTitle>
          <AlertDescription>
            Please complete your document submission before the deadline of May 15, 2025.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="application">
          <TabsList>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="application" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Review your application information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {application ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-sm">Personal Information</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>
                          <span className="text-muted-foreground">Name:</span> {application.name}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Date of Birth:</span> {application.dob}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Gender:</span>{" "}
                          {application.gender === "male" ? "Male" : "Female"}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Email:</span> {application.email}
                        </li>
                        <li>
                          <span className="text-muted-foreground">Phone:</span> {application.phone}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">Academic Information</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>
                          <span className="text-muted-foreground">10th Percentage:</span>{" "}
                          {application.academicDetails.tenth.percentage}%
                        </li>
                        <li>
                          <span className="text-muted-foreground">12th Percentage:</span>{" "}
                          {application.academicDetails.twelfth.percentage}%
                        </li>
                        <li>
                          <span className="text-muted-foreground">Applied Course:</span> {application.course}
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p>No application data available. Please start your application.</p>
                )}
                <div className="flex justify-end">
                  <Button asChild>
                    <Link href="/dashboard/applicant/application">
                      {application ? "View Full Application" : "Start Application"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Status</CardTitle>
                <CardDescription>Track your document submission status</CardDescription>
              </CardHeader>
              <CardContent>
                {application ? (
                  <ul className="space-y-4">
                    {application.documents.map((doc) => (
                      <li key={doc.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {doc.status === "uploaded" ? (
                            <FileCheck className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          <span>
                            {doc.type === "photo"
                              ? "Passport Size Photo"
                              : doc.type === "id_proof"
                                ? "ID Proof"
                                : doc.type === "tenth_certificate"
                                  ? "10th Certificate"
                                  : doc.type === "twelfth_certificate"
                                    ? "12th Certificate"
                                    : doc.type === "neet_scorecard"
                                      ? "NEET Score Card"
                                      : "Document"}
                          </span>
                        </div>
                        {doc.status === "uploaded" ? (
                          <span className="text-sm text-green-500">Uploaded</span>
                        ) : (
                          <Button size="sm">Upload</Button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No document data available. Please start your application first.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>View your payment details and pending fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Application Fee</h3>
                      <p className="text-sm text-muted-foreground">Transaction ID: TXN123456</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹1,000</p>
                      <p className="text-sm text-green-500">Paid</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Admission Fee</h3>
                      <p className="text-sm text-muted-foreground">Due after acceptance</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹25,000</p>
                      <p className="text-sm text-amber-500">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    View Receipt
                  </Button>
                  <Button disabled>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(ApplicantDashboard, ["applicant"])
