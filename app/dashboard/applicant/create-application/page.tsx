"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { db } from "@/lib/db"
import { useAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { withAuth } from "@/lib/auth"

function CreateApplicationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: user?.email || "",
    phone: "",

    // Academic History
    tenthSchool: "",
    tenthBoard: "",
    tenthYear: "",
    tenthPercentage: "",
    twelfthSchool: "",
    twelfthBoard: "",
    twelfthYear: "",
    twelfthPercentage: "",

    // Contact Details
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    guardianName: "",
    relationship: "",
    guardianPhone: "",
    guardianEmail: "",

    // Course
    course: "",

    // Declarations
    declaration: false,
    terms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Generate application number
      const applicationNumber = "SSEI-" + Math.floor(100000 + Math.random() * 900000)

      // Create application in database
      const newApplication = await db.createApplication({
        applicationNumber,
        userId: user.id,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        course: formData.course,
        status: "submitted",
        documents: [
          {
            id: "1",
            applicationId: "temp",
            type: "photo",
            fileName: "",
            status: "pending",
          },
          {
            id: "2",
            applicationId: "temp",
            type: "id_proof",
            fileName: "",
            status: "pending",
          },
          {
            id: "3",
            applicationId: "temp",
            type: "tenth_certificate",
            fileName: "",
            status: "pending",
          },
          {
            id: "4",
            applicationId: "temp",
            type: "twelfth_certificate",
            fileName: "",
            status: "pending",
          },
          {
            id: "5",
            applicationId: "temp",
            type: "neet_scorecard",
            fileName: "",
            status: "pending",
          },
        ],
        academicDetails: {
          tenth: {
            school: formData.tenthSchool,
            board: formData.tenthBoard,
            year: formData.tenthYear,
            percentage: formData.tenthPercentage,
          },
          twelfth: {
            school: formData.twelfthSchool,
            board: formData.twelfthBoard,
            year: formData.twelfthYear,
            percentage: formData.twelfthPercentage,
          },
        },
        address: {
          line1: formData.address1,
          line2: formData.address2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        guardian: {
          name: formData.guardianName,
          relationship: formData.relationship,
          phone: formData.guardianPhone,
          email: formData.guardianEmail,
        },
      })

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
        variant: "default",
      })

      // Redirect to success page
      router.push("/registration-success")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout userRole="applicant">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Application</h1>
          <p className="text-muted-foreground">Fill out the application form to apply for admission</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admission Application Form - 2025</CardTitle>
            <CardDescription className="text-center">
              Please fill out all required information to apply for admission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic History</TabsTrigger>
                <TabsTrigger value="contact">Contact Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                <TabsContent value="personal" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <Separator />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" required value={formData.dob} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!!user?.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      <Select value={formData.course} onValueChange={(value) => handleSelectChange("course", value)}>
                        <SelectTrigger id="course">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B.Tech Computer Science">B.Tech Computer Science</SelectItem>
                          <SelectItem value="B.Tech Electronics">B.Tech Electronics</SelectItem>
                          <SelectItem value="B.Tech Mechanical">B.Tech Mechanical</SelectItem>
                          <SelectItem value="B.Tech Civil">B.Tech Civil</SelectItem>
                          <SelectItem value="B.Tech IT">B.Tech IT</SelectItem>
                          <SelectItem value="BBA">BBA</SelectItem>
                          <SelectItem value="MBA">MBA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setCurrentStep("academic")}>
                      Next: Academic History
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Academic History</h3>
                    <Separator />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">10th Standard</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="tenthSchool">School Name</Label>
                          <Input id="tenthSchool" required value={formData.tenthSchool} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenthBoard">Board</Label>
                          <Select
                            value={formData.tenthBoard}
                            onValueChange={(value) => handleSelectChange("tenthBoard", value)}
                          >
                            <SelectTrigger id="tenthBoard">
                              <SelectValue placeholder="Select board" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cbse">CBSE</SelectItem>
                              <SelectItem value="icse">ICSE</SelectItem>
                              <SelectItem value="state">State Board</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenthYear">Year of Passing</Label>
                          <Input
                            id="tenthYear"
                            type="number"
                            min="2000"
                            max="2025"
                            required
                            value={formData.tenthYear}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenthPercentage">Percentage/CGPA</Label>
                          <Input
                            id="tenthPercentage"
                            required
                            value={formData.tenthPercentage}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">12th Standard / Diploma</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="twelfthSchool">School/College Name</Label>
                          <Input id="twelfthSchool" required value={formData.twelfthSchool} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twelfthBoard">Board</Label>
                          <Select
                            value={formData.twelfthBoard}
                            onValueChange={(value) => handleSelectChange("twelfthBoard", value)}
                          >
                            <SelectTrigger id="twelfthBoard">
                              <SelectValue placeholder="Select board" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cbse">CBSE</SelectItem>
                              <SelectItem value="icse">ICSE</SelectItem>
                              <SelectItem value="state">State Board</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twelfthYear">Year of Passing</Label>
                          <Input
                            id="twelfthYear"
                            type="number"
                            min="2000"
                            max="2025"
                            required
                            value={formData.twelfthYear}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twelfthPercentage">Percentage/CGPA</Label>
                          <Input
                            id="twelfthPercentage"
                            required
                            value={formData.twelfthPercentage}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep("personal")}>
                      Previous: Personal Info
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep("contact")}>
                      Next: Contact Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Contact Details</h3>
                    <Separator />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Permanent Address</h4>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="address1">Address Line 1</Label>
                          <Input id="address1" required value={formData.address1} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address2">Address Line 2</Label>
                          <Input id="address2" value={formData.address2} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" required value={formData.city} onChange={handleChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Select
                              value={formData.state}
                              onValueChange={(value) => handleSelectChange("state", value)}
                            >
                              <SelectTrigger id="state">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tn">Tamil Nadu</SelectItem>
                                <SelectItem value="ka">Karnataka</SelectItem>
                                <SelectItem value="ap">Andhra Pradesh</SelectItem>
                                <SelectItem value="kl">Kerala</SelectItem>
                                <SelectItem value="mh">Maharashtra</SelectItem>
                                <SelectItem value="dl">Delhi</SelectItem>
                                <SelectItem value="gj">Gujarat</SelectItem>
                                <SelectItem value="up">Uttar Pradesh</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input id="pincode" required value={formData.pincode} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Guardian Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="guardianName">Guardian Name</Label>
                          <Input id="guardianName" required value={formData.guardianName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship</Label>
                          <Select
                            value={formData.relationship}
                            onValueChange={(value) => handleSelectChange("relationship", value)}
                          >
                            <SelectTrigger id="relationship">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianPhone">Phone Number</Label>
                          <Input
                            id="guardianPhone"
                            type="tel"
                            required
                            value={formData.guardianPhone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianEmail">Email</Label>
                          <Input
                            id="guardianEmail"
                            type="email"
                            value={formData.guardianEmail}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep("academic")}>
                      Previous: Academic History
                    </Button>
                    <Button type="button" onClick={() => setCurrentStep("documents")}>
                      Next: Documents
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Documents & Submission</h3>
                    <Separator />
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Required Documents</h4>
                      <p className="text-sm text-muted-foreground">
                        You can upload your documents after submitting your application from the Documents section of
                        your dashboard.
                      </p>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label>Passport Size Photo</Label>
                          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            You will be able to upload this document after submission
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>ID Proof (Aadhar/PAN/Passport)</Label>
                          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            You will be able to upload this document after submission
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>10th Certificate</Label>
                          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            You will be able to upload this document after submission
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>12th Certificate</Label>
                          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            You will be able to upload this document after submission
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>NEET Score Card (if applicable)</Label>
                          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            You will be able to upload this document after submission
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Declaration</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="declaration"
                            checked={formData.declaration}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({ ...prev, declaration: checked === true }))
                            }
                          />
                          <Label htmlFor="declaration" className="text-sm">
                            I hereby declare that all the information provided by me in this application is true and
                            correct to the best of my knowledge and belief. I understand that in case any information is
                            found to be incorrect, my application is liable to be rejected.
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={formData.terms}
                            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, terms: checked === true }))}
                          />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the terms and conditions of Sri Shanmugha Educational Institutions and will abide
                            by all the rules and regulations of the institution.
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep("contact")}>
                      Previous: Contact Details
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.declaration || !formData.terms}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(CreateApplicationPage, ["applicant"])
