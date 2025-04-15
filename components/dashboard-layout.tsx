"use client"

import type React from "react"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Home,
  Users,
  ClipboardList,
  FileCheck,
  FileX,
  Wallet,
  Receipt,
  FileSearch,
  ShieldCheck,
  Database,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useAuth } from "@/lib/auth"
import type { UserRole } from "@/lib/db"

type DashboardLayoutProps = {
  children: React.ReactNode
  userRole: UserRole
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    // Redirect if user role doesn't match the dashboard
    if (user && user.role !== userRole) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, userRole, router])

  const getNavItems = () => {
    switch (userRole) {
      case "applicant":
        return [
          { name: "Dashboard", href: "/dashboard/applicant", icon: Home },
          { name: "My Application", href: "/dashboard/applicant/application", icon: FileText },
          { name: "Documents", href: "/dashboard/applicant/documents", icon: FileCheck },
          { name: "Payments", href: "/dashboard/applicant/payments", icon: CreditCard },
          { name: "Notifications", href: "/dashboard/applicant/notifications", icon: Bell },
        ]
      case "cao":
        return [
          { name: "Dashboard", href: "/dashboard/cao", icon: Home },
          { name: "New Applications", href: "/dashboard/cao/new-applications", icon: ClipboardList },
          { name: "Accepted Applications", href: "/dashboard/cao/accepted", icon: FileCheck },
          { name: "Rejected Applications", href: "/dashboard/cao/rejected", icon: FileX },
        ]
      case "accounts":
        return [
          { name: "Dashboard", href: "/dashboard/accounts", icon: Home },
          { name: "Fees Not Fixed", href: "/dashboard/accounts/fees-not-fixed", icon: Wallet },
          { name: "Fees Fixed", href: "/dashboard/accounts/fees-fixed", icon: Receipt },
          { name: "Fee Audit", href: "/dashboard/accounts/fee-audit", icon: FileSearch },
        ]
      case "admin":
        return [
          { name: "Dashboard", href: "/dashboard/admin", icon: Home },
          { name: "User Management", href: "/dashboard/admin/users", icon: Users },
          { name: "Role Management", href: "/dashboard/admin/roles", icon: ShieldCheck },
          { name: "Master Data", href: "/dashboard/admin/master-data", icon: Database },
          { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-center px-2">
              <Image src="/images/logo.png" alt="Sri Shanmugha Logo" width={150} height={50} priority />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator />
            <div className="p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">{user?.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
            <SidebarTrigger className="mr-2" />
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
