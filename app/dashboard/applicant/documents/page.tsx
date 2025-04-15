"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileCheck, AlertCircle } from "lucide-react"
import { db, type Application, type Document } from "@/lib/db"
import { useAuth } from "@/lib/auth"
import { withAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function DocumentsPage() {
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [_loading, _setLoading] = useState(true)
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

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
          _setLoading(false)
        }
      }
    }

    fetchApplication()
  }, [user])

  const handleFileUpload = async (docType: string, file: File) => {
    if (!application) return

    setUploadingDocType(docType)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      // Find the document to update
      const docIndex = application.documents.findIndex((doc) => doc.type === docType)
      if (docIndex === -1) return

      // Update document in the database
      const updatedDoc: Document = {
        ...application.documents[docIndex],
        fileName: file.name,
        status: "uploaded",
        uploadedAt: new Date(),
      }

      // Update the application with the new document
      const updatedDocs = [...application.documents]
      updatedDocs[docIndex] = updatedDoc

      await db.updateApplication(application.id, {
        documents: updatedDocs,
      })

      // Update local state
      const updatedApplication = await db.getApplicationById(application.id)
      if (updatedApplication) {
        setApplication(updatedApplication)
      }

      // Complete progress
      setUploadProgress(100)
      setTimeout(() => {
        setUploadingDocType(null)
        setUploadProgress(0)
      }, 500)

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload Failed",
        description: "An error occurred while uploading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      clearInterval(interval)
    }
  }

  const getDocumentTypeLabel = (type: string): string => {
    switch (type) {
      case "photo":
        return "Passport Size Photo"
      case "id_proof":
        return "ID Proof (Aadhar/PAN/Passport)"
      case "tenth_certificate":
        return "10th Certificate"
      case "twelfth_certificate":
        return "12th Certificate"
      case "neet_scorecard":
        return "NEET Score Card"
      default:
        return type
    }
  }

  if (_loading) {
    return (
      <DashboardLayout userRole="applicant">
        <div className="flex items-center justify-center h-full">
          <p>Loading document data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!application) {
    return (
      <DashboardLayout userRole="applicant">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Upload and manage your application documents</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Application Found</AlertTitle>
            <AlertDescription>You need to create an application before you can upload documents.</AlertDescription>
          </Alert>

          <Button asChild>
            <a href="/dashboard/applicant/create-application">Create Application</a>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="applicant">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your application documents</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important!</AlertTitle>
          <AlertDescription>
            Please upload all required documents to complete your application. All documents must be in PDF, JPG, or PNG
            format and should not exceed 5MB in size.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>Upload your documents for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {application.documents.map((doc) => (
                <div key={doc.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`upload-${doc.type}`}>{getDocumentTypeLabel(doc.type)}</Label>
                    <div className="flex items-center gap-2">
                      {doc.status === "uploaded" ? (
                        <>
                          <FileCheck className="h-5 w-5 text-green-500" />
                          <span className="text-sm text-green-500">Uploaded</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                          <span className="text-sm text-amber-500">Pending</span>
                        </>
                      )}
                    </div>
                  </div>

                  {uploadingDocType === doc.type && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Input
                      id={`upload-${doc.type}`}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="max-w-md"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(doc.type, e.target.files[0])
                        }
                      }}
                      disabled={uploadingDocType !== null}
                    />
                    {doc.status === "uploaded" && (
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    )}
                  </div>

                  {doc.fileName && (
                    <p className="text-sm text-muted-foreground">
                      Current file: {doc.fileName}
                      {doc.uploadedAt && ` (Uploaded on ${new Date(doc.uploadedAt).toLocaleDateString()})`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(DocumentsPage, ["applicant"])
