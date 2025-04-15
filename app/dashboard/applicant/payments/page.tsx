"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { db, type Application } from "@/lib/db"
import { useAuth } from "@/lib/auth"
import { withAuth } from "@/lib/auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CreditCard, Download } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

function PaymentsPage() {
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

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

  const handlePayNow = () => {
    setProcessingPayment(true)

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
        variant: "default",
      })
      setProcessingPayment(false)
    }, 2000)
  }

  const handleDownloadReceipt = () => {
    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded successfully.",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <DashboardLayout userRole="applicant">
        <div className="flex items-center justify-center h-full">
          <p>Loading payment data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!application) {
    return (
      <DashboardLayout userRole="applicant">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">Manage your application fees and payments</p>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Application Found</AlertTitle>
            <AlertDescription>You need to create an application before you can make any payments.</AlertDescription>
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
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage your application fees and payments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>View your payment details and pending fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Application Fee</h3>
                  <p className="text-sm text-muted-foreground">Transaction ID: TXN123456</p>
                  <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹1,000</p>
                  <p className="text-sm text-green-500">Paid</p>
                  <Button variant="ghost" size="sm" onClick={handleDownloadReceipt}>
                    <Download className="mr-2 h-4 w-4" />
                    Receipt
                  </Button>
                </div>
              </div>
            </div>

            {application.status === "accepted" ? (
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Admission Fee</h3>
                    <p className="text-sm text-muted-foreground">
                      Due by: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹25,000</p>
                    <p className="text-sm text-amber-500">Pending</p>
                    <Button size="sm" onClick={handlePayNow} disabled={processingPayment}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {processingPayment ? "Processing..." : "Pay Now"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Admission Fee</h3>
                    <p className="text-sm text-muted-foreground">Due after acceptance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹25,000</p>
                    <p className="text-sm text-muted-foreground">Not applicable yet</p>
                    <Button disabled size="sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Available Payment Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-indigo-600" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#00BAF2" />
                    <path
                      d="M17.1 11.9H15.66C15.57 11.9 15.5 11.97 15.5 12.06V12.33C15.5 12.42 15.57 12.49 15.66 12.49H17.1C17.19 12.49 17.26 12.42 17.26 12.33V12.06C17.26 11.97 17.19 11.9 17.1 11.9Z"
                      fill="white"
                    />
                    <path
                      d="M6.95 11.9H6.74C6.65 11.9 6.58 11.97 6.58 12.06V13.33C6.58 13.42 6.65 13.49 6.74 13.49H6.95C7.04 13.49 7.11 13.42 7.11 13.33V12.06C7.11 11.97 7.04 11.9 6.95 11.9Z"
                      fill="white"
                    />
                    <path
                      d="M18.5 7H5.5C4.67 7 4 7.67 4 8.5V15.5C4 16.33 4.67 17 5.5 17H18.5C19.33 17 20 16.33 20 15.5V8.5C20 7.67 19.33 7 18.5 7ZM8.13 14.33C8.13 14.42 8.06 14.49 7.97 14.49H5.74C5.65 14.49 5.58 14.42 5.58 14.33V11.06C5.58 10.97 5.65 10.9 5.74 10.9H7.97C8.06 10.9 8.13 10.97 8.13 11.06V14.33ZM12.13 14.33C12.13 14.42 12.06 14.49 11.97 14.49H9.74C9.65 14.49 9.58 14.42 9.58 14.33V11.06C9.58 10.97 9.65 10.9 9.74 10.9H11.97C12.06 10.9 12.13 10.97 12.13 11.06V14.33ZM16.13 14.33C16.13 14.42 16.06 14.49 15.97 14.49H13.74C13.65 14.49 13.58 14.42 13.58 14.33V11.06C13.58 10.97 13.65 10.9 13.74 10.9H15.97C16.06 10.9 16.13 10.97 16.13 11.06V14.33ZM18.42 14.33C18.42 14.42 18.35 14.49 18.26 14.49H17.74C17.65 14.49 17.58 14.42 17.58 14.33V13.06C17.58 12.97 17.65 12.9 17.74 12.9H18.26C18.35 12.9 18.42 12.97 18.42 13.06V14.33ZM18.42 11.33C18.42 11.42 18.35 11.49 18.26 11.49H17.74C17.65 11.49 17.58 11.42 17.58 11.33V11.06C17.58 10.97 17.65 10.9 17.74 10.9H18.26C18.35 10.9 18.42 10.97 18.42 11.06V11.33Z"
                      fill="white"
                    />
                  </svg>
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-muted-foreground">Pay using UPI apps</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex items-center gap-4">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="4" fill="#002970" />
                    <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="#FFB600" />
                  </svg>
                  <div>
                    <p className="font-medium">Net Banking</p>
                    <p className="text-sm text-muted-foreground">Pay through your bank</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Payment Instructions</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>All payments are secure and encrypted</li>
                <li>You will receive a receipt via email after successful payment</li>
                <li>For any payment issues, contact our support team at payments@ssei.edu</li>
                <li>Application fee is non-refundable</li>
                <li>Admission fee is refundable as per the institution's refund policy</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(PaymentsPage, ["applicant"])
