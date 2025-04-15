"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission - replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/registration-success")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-10 px-4">
      <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <GraduationCap className="h-10 w-10 text-indigo-600 mr-2" />
          <h1 className="text-3xl font-bold text-indigo-900">SSEI-AMS</h1>
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
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select>
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
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" required />
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
                          <Input id="tenthSchool" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenthBoard">Board</Label>
                          <Select>
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
                          <Input id="tenthYear" type="number" min="2000" max="2025" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenthPercentage">Percentage/CGPA</Label>
                          <Input id="tenthPercentage" required />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">12th Standard / Diploma</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="twelfthSchool">School/College Name</Label>
                          <Input id="twelfthSchool" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twelfthBoard">Board</Label>
                          <Select>
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
                          <Input id="twelfthYear" type="number" min="2000" max="2025" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twelfthPercentage">Percentage/CGPA</Label>
                          <Input id="twelfthPercentage" required />
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
                          <Input id="address1" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address2">Address Line 2</Label>
                          <Input id="address2" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Select>
                              <SelectTrigger id="state">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tn">Tamil Nadu</SelectItem>
                                <SelectItem value="ka">Karnataka</SelectItem>
                                <SelectItem value="ap">Andhra Pradesh</SelectItem>
                                <SelectItem value="kl">Kerala</SelectItem>
                                {/* Add more states */}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">Pincode</Label>
                            <Input id="pincode" required />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Guardian Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="guardianName">Guardian Name</Label>
                          <Input id="guardianName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relationship">Relationship</Label>
                          <Select>
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
                          <Input id="guardianPhone" type="tel" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianEmail">Email</Label>
                          <Input id="guardianEmail" type="email" />
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
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="photoUpload">Passport Size Photo</Label>
                          <Input id="photoUpload" type="file" accept="image/*" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="idProof">ID Proof (Aadhar/PAN/Passport)</Label>
                          <Input id="idProof" type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tenthCertificate">10th Certificate</Label>
                          <Input id="tenthCertificate" type="file" accept=".pdf" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twelfthCertificate">12th Certificate</Label>
                          <Input id="twelfthCertificate" type="file" accept=".pdf" required />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Declaration</h4>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="declaration" />
                          <Label htmlFor="declaration" className="text-sm">
                            I hereby declare that all the information provided by me in this application is true and
                            correct to the best of my knowledge and belief. I understand that in case any information is
                            found to be incorrect, my application is liable to be rejected.
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" />
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
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500">
            <p>
              Need help? Contact our support team at{" "}
              <Link href="mailto:support@ssei.edu" className="text-indigo-600 hover:text-indigo-800">
                support@ssei.edu
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
