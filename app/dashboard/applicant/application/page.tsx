"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { db, type Application } from "@/lib/db"
import { useAuth } from "@/lib/auth"
import { withAuth } from "@/lib/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileText } from "lucide-react"
import Link from "next/link"

function ApplicationDetailsPage() {
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

  if (!application) {
    return (
      <DashboardLayout userRole="applicant">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Application</h1>
            <p className="text-muted-foreground">View and manage your application details</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Application Found</AlertTitle>
            <AlertDescription>
              You haven't created an application yet. Please create an application to proceed.
            </AlertDescription>
          </Alert>

          <Button asChild>
            <Link href="/dashboard/applicant/create-application">Create Application</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="applicant">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Application</h1>
          <p className="text-muted-foreground">View and manage your application details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Application Summary</CardTitle>
                <CardDescription>Application #{application.applicationNumber}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    application.status === "submitted"
                      ? "bg-blue-100 text-blue-800"
                      : application.status === "under_review"
                        ? "bg-amber-100 text-amber-800"
                        : application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {application.status === "submitted"
                    ? "Submitted"
                    : application.status === "under_review"
                      ? "Under Review"
                      : application.status === "accepted"
                        ? "Accepted"
                        : "Rejected"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Submitted on:</span>
                  <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span>{new Date(application.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Applied for:</span>
                  <span>{application.course}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Name</h3>
                <p>{application.name}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Date of Birth</h3>
                <p>{application.dob}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Gender</h3>
                <p>{application.gender === "male" ? "Male" : application.gender === "female" ? "Female" : "Other"}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact Information</h3>
                <p>{application.email}</p>
                <p>{application.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">10th Standard</h3>
                <p>School: {application.academicDetails.tenth.school}</p>
                <p>Board: {application.academicDetails.tenth.board}</p>
                <p>Year of Passing: {application.academicDetails.tenth.year}</p>
                <p>Percentage/CGPA: {application.academicDetails.tenth.percentage}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">12th Standard</h3>
                <p>School: {application.academicDetails.twelfth.school}</p>
                <p>Board: {application.academicDetails.twelfth.board}</p>
                <p>Year of Passing: {application.academicDetails.twelfth.year}</p>
                <p>Percentage/CGPA: {application.academicDetails.twelfth.percentage}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Permanent Address</h3>
                <p>{application.address.line1}</p>
                {application.address.line2 && <p>{application.address.line2}</p>}
                <p>
                  {application.address.city}, {application.address.state} - {application.address.pincode}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Guardian Information</h3>
                <p>Name: {application.guardian.name}</p>
                <p>
                  Relationship:{" "}
                  {application.guardian.relationship.charAt(0).toUpperCase() +
                    application.guardian.relationship.slice(1)}
                </p>
                <p>Phone: {application.guardian.phone}</p>
                {application.guardian.email && <p>Email: {application.guardian.email}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/applicant/documents">Manage Documents</Link>
          </Button>
          {application.status === "rejected" && (
            <Button asChild>
              <Link href="/dashboard/applicant/create-application">Apply Again</Link>
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(ApplicationDetailsPage, ["applicant"])
