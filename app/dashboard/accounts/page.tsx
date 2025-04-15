"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Receipt, FileSearch, Search, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { type Fee, db } from "@/lib/db"
import { withAuth } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"

function AccountsDashboard() {
  const [notFixedFees, setNotFixedFees] = useState<Fee[]>([])
  const [fixedFees, setFixedFees] = useState<Fee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const notFixed = await db.getNotFixedFees()
        const fixed = await db.getFixedFees()

        setNotFixedFees(notFixed)
        setFixedFees(fixed)
      } catch (error) {
        console.error("Error fetching fees:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFees()
  }, [])

  const filteredNotFixedFees = notFixedFees.filter(
    (fee) =>
      fee.sinNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredFixedFees = fixedFees.filter(
    (fee) =>
      fee.sinNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    feesNotFixed: notFixedFees.length,
    feesFixed: fixedFees.length,
    totalStudents: notFixedFees.length + fixedFees.length,
    totalFees: `₹${fixedFees.reduce((sum, fee) => sum + fee.totalFee, 0).toLocaleString("en-IN")}`,
  }

  const handleExportFees = () => {
    toast({
      title: "Export Started",
      description: "Your fee data is being exported to Excel.",
      variant: "default",
    })
  }

  if (loading) {
    return (
      <DashboardLayout userRole="accounts">
        <div className="flex items-center justify-center h-full">
          <p>Loading fee data...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="accounts">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts Dashboard</h1>
          <p className="text-muted-foreground">Manage student fees and financial records.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fees Not Fixed</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.feesNotFixed}</div>
              <p className="text-xs text-muted-foreground mt-2">Students pending fee assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fees Fixed</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.feesFixed}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.totalStudents > 0
                  ? `${Math.round((stats.feesFixed / stats.totalStudents) * 100)}% of total students`
                  : "No students yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <FileSearch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-2">For 2025 academic year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFees}</div>
              <p className="text-xs text-muted-foreground mt-2">Collected for current year</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Student Fees</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by SIN No..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline" onClick={handleExportFees}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="not-fixed">
          <TabsList>
            <TabsTrigger value="not-fixed">Fees Not Fixed</TabsTrigger>
            <TabsTrigger value="fixed">Fees Fixed</TabsTrigger>
            <TabsTrigger value="audit">Fee Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="not-fixed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fees Not Fixed</CardTitle>
                <CardDescription>Assign fees to students who don't have fees fixed yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">SIN No</th>
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Course</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredNotFixedFees.length > 0 ? (
                          filteredNotFixedFees.map((fee) => (
                            <tr key={fee.id} className="border-b">
                              <td className="px-4 py-3">{fee.sinNumber}</td>
                              <td className="px-4 py-3">{fee.studentName}</td>
                              <td className="px-4 py-3">{fee.course}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                  Not Fixed
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="default" asChild>
                                    <Link href={`/dashboard/accounts/fix-fee/${fee.id}`}>Fix Fee</Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center" colSpan={5}>
                              No students with unfixed fees found
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

          <TabsContent value="fixed">
            <Card>
              <CardHeader>
                <CardTitle>Fees Fixed</CardTitle>
                <CardDescription>View all students with fixed fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">SIN No</th>
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Course</th>
                          <th className="px-4 py-3 text-left font-medium">Total Fee</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFixedFees.length > 0 ? (
                          filteredFixedFees.map((fee) => (
                            <tr key={fee.id} className="border-b">
                              <td className="px-4 py-3">{fee.sinNumber}</td>
                              <td className="px-4 py-3">{fee.studentName}</td>
                              <td className="px-4 py-3">{fee.course}</td>
                              <td className="px-4 py-3">₹{fee.totalFee.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/accounts/view-fee/${fee.id}`}>View</Link>
                                  </Button>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={`/dashboard/accounts/edit-fee/${fee.id}`}>Edit</Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center" colSpan={5}>
                              No students with fixed fees found
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

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Fee Audit</CardTitle>
                <CardDescription>Audit and adjust student fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left font-medium">SIN No</th>
                          <th className="px-4 py-3 text-left font-medium">Name</th>
                          <th className="px-4 py-3 text-left font-medium">Course</th>
                          <th className="px-4 py-3 text-left font-medium">Current Fee</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFixedFees.length > 0 ? (
                          filteredFixedFees.map((fee) => (
                            <tr key={fee.id} className="border-b">
                              <td className="px-4 py-3">{fee.sinNumber}</td>
                              <td className="px-4 py-3">{fee.studentName}</td>
                              <td className="px-4 py-3">{fee.course}</td>
                              <td className="px-4 py-3">₹{fee.totalFee.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3">
                                <Button size="sm" variant="default" asChild>
                                  <Link href={`/dashboard/accounts/audit-fee/${fee.id}`}>Audit</Link>
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className="border-b">
                            <td className="px-4 py-3 text-center" colSpan={5}>
                              No fee audit records to display
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
    </DashboardLayout>
  )
}

export default withAuth(AccountsDashboard, ["accounts"])
