"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react"
import { useRouter } from "next/navigation"
import { db, type User, type UserRole } from "@/lib/db"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const user = await db.login(email, password)
      if (user) {
        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function withAuth(Component: React.ComponentType<any>, allowedRoles?: UserRole[]) {
  return function ProtectedRoute(props: any) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login")
      } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
        router.push(`/dashboard/${user.role}`)
      }
    }, [loading, user, router])

    if (loading || !user) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <div className="flex items-center justify-center min-h-screen">Unauthorized</div>
    }

    return <Component {...props} />
  }
}