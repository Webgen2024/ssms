// This is a mock database service to simulate real-time data
// In a real application, this would be replaced with actual database calls

// Types
export type UserRole = "admin" | "cao" | "accounts" | "applicant"

export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: UserRole
  status: "active" | "inactive"
  createdAt: Date
}

export interface Application {
  id: string
  applicationNumber: string
  userId: string
  name: string
  email: string
  phone: string
  dob: string
  gender: string
  course: string
  status: "submitted" | "under_review" | "accepted" | "rejected"
  remarks?: string
  createdAt: Date
  updatedAt: Date
  documents: Document[]
  academicDetails: {
    tenth: {
      school: string
      board: string
      year: string
      percentage: string
    }
    twelfth: {
      school: string
      board: string
      year: string
      percentage: string
    }
  }
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
  guardian: {
    name: string
    relationship: string
    phone: string
    email?: string
  }
}

export interface Document {
  id: string
  applicationId: string
  type: "photo" | "id_proof" | "tenth_certificate" | "twelfth_certificate" | "neet_scorecard"
  fileName: string
  status: "pending" | "uploaded" | "verified" | "rejected"
  uploadedAt?: Date
}

export interface Fee {
  id: string
  sinNumber: string
  studentName: string
  course: string
  totalFee: number
  status: "not_fixed" | "fixed" | "audited"
  terms: FeeTerm[]
  createdAt: Date
  updatedAt: Date
}

export interface FeeTerm {
  id: string
  feeId: string
  termName: string
  amount: number
  dueDate: Date
  status: "pending" | "paid" | "overdue"
  paidAt?: Date
  transactionId?: string
}

export interface FeeAudit {
  id: string
  feeId: string
  amountReduced: number
  referenceNumber: string
  message: string
  createdAt: Date
  createdBy: string
}

// Mock data
let users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@ssei.edu",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    status: "active",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    email: "cao@ssei.edu",
    password: "cao123", // In a real app, this would be hashed
    role: "cao",
    status: "active",
    createdAt: new Date("2023-01-02"),
  },
  {
    id: "3",
    name: "Raj Patel",
    email: "accounts@ssei.edu",
    password: "accounts123", // In a real app, this would be hashed
    role: "accounts",
    status: "active",
    createdAt: new Date("2023-01-03"),
  },
  {
    id: "4",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "student123", // In a real app, this would be hashed
    role: "applicant",
    status: "active",
    createdAt: new Date("2023-02-01"),
  },
  {
    id: "5",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    password: "student123", // In a real app, this would be hashed
    role: "applicant",
    status: "active",
    createdAt: new Date("2023-02-02"),
  },
]

let applications: Application[] = [
  {
    id: "1",
    applicationNumber: "SSEI-123456",
    userId: "4",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    dob: "2000-01-01",
    gender: "male",
    course: "B.Tech Computer Science",
    status: "under_review",
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-04-10"),
    documents: [
      {
        id: "1",
        applicationId: "1",
        type: "photo",
        fileName: "john_photo.jpg",
        status: "uploaded",
        uploadedAt: new Date("2023-04-10"),
      },
      {
        id: "2",
        applicationId: "1",
        type: "id_proof",
        fileName: "john_id.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-10"),
      },
      {
        id: "3",
        applicationId: "1",
        type: "tenth_certificate",
        fileName: "john_10th.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-10"),
      },
      {
        id: "4",
        applicationId: "1",
        type: "twelfth_certificate",
        fileName: "john_12th.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-10"),
      },
      {
        id: "5",
        applicationId: "1",
        type: "neet_scorecard",
        fileName: "",
        status: "pending",
      },
    ],
    academicDetails: {
      tenth: {
        school: "ABC School",
        board: "CBSE",
        year: "2018",
        percentage: "92",
      },
      twelfth: {
        school: "XYZ School",
        board: "CBSE",
        year: "2020",
        percentage: "88",
      },
    },
    address: {
      line1: "123 Main Street",
      line2: "Apartment 4B",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    },
    guardian: {
      name: "Robert Doe",
      relationship: "father",
      phone: "+91 9876543211",
      email: "robert.doe@example.com",
    },
  },
  {
    id: "2",
    applicationNumber: "SSEI-123457",
    userId: "5",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+91 9876543212",
    dob: "2000-02-15",
    gender: "female",
    course: "B.Tech Electronics",
    status: "submitted",
    createdAt: new Date("2023-04-11"),
    updatedAt: new Date("2023-04-11"),
    documents: [
      {
        id: "6",
        applicationId: "2",
        type: "photo",
        fileName: "jane_photo.jpg",
        status: "uploaded",
        uploadedAt: new Date("2023-04-11"),
      },
      {
        id: "7",
        applicationId: "2",
        type: "id_proof",
        fileName: "jane_id.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-11"),
      },
      {
        id: "8",
        applicationId: "2",
        type: "tenth_certificate",
        fileName: "jane_10th.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-11"),
      },
      {
        id: "9",
        applicationId: "2",
        type: "twelfth_certificate",
        fileName: "jane_12th.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-11"),
      },
      {
        id: "10",
        applicationId: "2",
        type: "neet_scorecard",
        fileName: "jane_neet.pdf",
        status: "uploaded",
        uploadedAt: new Date("2023-04-11"),
      },
    ],
    academicDetails: {
      tenth: {
        school: "DEF School",
        board: "ICSE",
        year: "2018",
        percentage: "90",
      },
      twelfth: {
        school: "GHI School",
        board: "ICSE",
        year: "2020",
        percentage: "85",
      },
    },
    address: {
      line1: "456 Park Avenue",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
    guardian: {
      name: "Mary Smith",
      relationship: "mother",
      phone: "+91 9876543213",
      email: "mary.smith@example.com",
    },
  },
]

// Generate more applications
for (let i = 3; i <= 10; i++) {
  const id = i.toString()
  const applicationNumber = `SSEI-${123455 + i}`
  const name = `Applicant ${i}`
  const email = `applicant${i}@example.com`

  applications.push({
    id,
    applicationNumber,
    userId: `${i + 3}`,
    name,
    email,
    phone: `+91 98765432${i}`,
    dob: "2000-01-01",
    gender: i % 2 === 0 ? "male" : "female",
    course: i % 2 === 0 ? "B.Tech Computer Science" : "B.Tech Electronics",
    status: "submitted",
    createdAt: new Date(`2023-04-${10 + i}`),
    updatedAt: new Date(`2023-04-${10 + i}`),
    documents: [
      {
        id: `${i * 5 + 1}`,
        applicationId: id,
        type: "photo",
        fileName: `applicant${i}_photo.jpg`,
        status: "uploaded",
        uploadedAt: new Date(`2023-04-${10 + i}`),
      },
      {
        id: `${i * 5 + 2}`,
        applicationId: id,
        type: "id_proof",
        fileName: `applicant${i}_id.pdf`,
        status: "uploaded",
        uploadedAt: new Date(`2023-04-${10 + i}`),
      },
      {
        id: `${i * 5 + 3}`,
        applicationId: id,
        type: "tenth_certificate",
        fileName: `applicant${i}_10th.pdf`,
        status: "uploaded",
        uploadedAt: new Date(`2023-04-${10 + i}`),
      },
      {
        id: `${i * 5 + 4}`,
        applicationId: id,
        type: "twelfth_certificate",
        fileName: `applicant${i}_12th.pdf`,
        status: "uploaded",
        uploadedAt: new Date(`2023-04-${10 + i}`),
      },
      {
        id: `${i * 5 + 5}`,
        applicationId: id,
        type: "neet_scorecard",
        fileName: "",
        status: "pending",
      },
    ],
    academicDetails: {
      tenth: {
        school: `School ${i}`,
        board: "CBSE",
        year: "2018",
        percentage: `${80 + i}`,
      },
      twelfth: {
        school: `School ${i}`,
        board: "CBSE",
        year: "2020",
        percentage: `${75 + i}`,
      },
    },
    address: {
      line1: `${i}00 Street`,
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600001",
    },
    guardian: {
      name: `Parent ${i}`,
      relationship: i % 2 === 0 ? "father" : "mother",
      phone: `+91 98765432${20 + i}`,
      email: `parent${i}@example.com`,
    },
  })
}

let fees: Fee[] = [
  {
    id: "1",
    sinNumber: "E21AI001",
    studentName: "John Doe",
    course: "B.Tech CSE",
    totalFee: 0, // Will be calculated
    status: "not_fixed",
    terms: [],
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
  },
  {
    id: "2",
    sinNumber: "E21AI002",
    studentName: "Jane Smith",
    course: "B.Tech ECE",
    totalFee: 0, // Will be calculated
    status: "not_fixed",
    terms: [],
    createdAt: new Date("2023-04-15"),
    updatedAt: new Date("2023-04-15"),
  },
]

// Generate more fees
for (let i = 3; i <= 10; i++) {
  const id = i.toString()
  const sinNumber = `E21AI00${i}`
  const studentName = `Applicant ${i}`

  fees.push({
    id,
    sinNumber,
    studentName,
    course: i % 2 === 0 ? "B.Tech CSE" : "B.Tech ECE",
    totalFee: 0,
    status: "not_fixed",
    terms: [],
    createdAt: new Date(`2023-04-15`),
    updatedAt: new Date(`2023-04-15`),
  })
}

const feeAudits: FeeAudit[] = []

// Database service functions
export const db = {
  // Auth
  login: async (email: string, password: string): Promise<User | null> => {
    const user = users.find((u) => u.email === email && u.password === password)
    return user || null
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    return [...users]
  },

  getUserById: async (id: string): Promise<User | null> => {
    const user = users.find((u) => u.id === id)
    return user || null
  },

  createUser: async (userData: Omit<User, "id" | "createdAt">): Promise<User> => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...userData,
      createdAt: new Date(),
    }
    users.push(newUser)
    return newUser
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User | null> => {
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return null

    users[index] = { ...users[index], ...userData }
    return users[index]
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const initialLength = users.length
    users = users.filter((u) => u.id !== id)
    return users.length < initialLength
  },

  // Applications
  getApplications: async (): Promise<Application[]> => {
    return [...applications]
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    const application = applications.find((a) => a.id === id)
    return application || null
  },

  getApplicationsByUserId: async (userId: string): Promise<Application[]> => {
    return applications.filter((a) => a.userId === userId)
  },

  createApplication: async (
    applicationData: Omit<Application, "id" | "createdAt" | "updatedAt">,
  ): Promise<Application> => {
    const newApplication: Application = {
      id: (applications.length + 1).toString(),
      ...applicationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    applications.push(newApplication)
    return newApplication
  },

  updateApplication: async (id: string, applicationData: Partial<Application>): Promise<Application | null> => {
    const index = applications.findIndex((a) => a.id === id)
    if (index === -1) return null

    applications[index] = {
      ...applications[index],
      ...applicationData,
      updatedAt: new Date(),
    }
    return applications[index]
  },

  deleteApplication: async (id: string): Promise<boolean> => {
    const initialLength = applications.length
    applications = applications.filter((a) => a.id !== id)
    return applications.length < initialLength
  },

  // Fees
  getFees: async (): Promise<Fee[]> => {
    return [...fees]
  },

  getFeeById: async (id: string): Promise<Fee | null> => {
    const fee = fees.find((f) => f.id === id)
    return fee || null
  },

  getFeeBySinNumber: async (sinNumber: string): Promise<Fee | null> => {
    const fee = fees.find((f) => f.sinNumber === sinNumber)
    return fee || null
  },

  createFee: async (feeData: Omit<Fee, "id" | "createdAt" | "updatedAt" | "totalFee">): Promise<Fee> => {
    const totalFee = feeData.terms.reduce((sum, term) => sum + term.amount, 0)

    const newFee: Fee = {
      id: (fees.length + 1).toString(),
      ...feeData,
      totalFee,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    fees.push(newFee)
    return newFee
  },

  updateFee: async (id: string, feeData: Partial<Fee>): Promise<Fee | null> => {
    const index = fees.findIndex((f) => f.id === id)
    if (index === -1) return null

    // Recalculate total fee if terms are updated
    let totalFee = fees[index].totalFee
    if (feeData.terms) {
      totalFee = feeData.terms.reduce((sum, term) => sum + term.amount, 0)
    }

    fees[index] = {
      ...fees[index],
      ...feeData,
      totalFee,
      updatedAt: new Date(),
    }
    return fees[index]
  },

  deleteFee: async (id: string): Promise<boolean> => {
    const initialLength = fees.length
    fees = fees.filter((f) => f.id !== id)
    return fees.length < initialLength
  },

  // Fee Audits
  getFeeAudits: async (): Promise<FeeAudit[]> => {
    return [...feeAudits]
  },

  getFeeAuditsByFeeId: async (feeId: string): Promise<FeeAudit[]> => {
    return feeAudits.filter((a) => a.feeId === feeId)
  },

  createFeeAudit: async (auditData: Omit<FeeAudit, "id" | "createdAt">): Promise<FeeAudit> => {
    const newAudit: FeeAudit = {
      id: (feeAudits.length + 1).toString(),
      ...auditData,
      createdAt: new Date(),
    }
    feeAudits.push(newAudit)
    return newAudit
  },

  // Helper functions
  getNotFixedFees: async (): Promise<Fee[]> => {
    return fees.filter((f) => f.status === "not_fixed")
  },

  getFixedFees: async (): Promise<Fee[]> => {
    return fees.filter((f) => f.status === "fixed")
  },

  getNewApplications: async (): Promise<Application[]> => {
    return applications.filter((a) => a.status === "submitted")
  },

  getAcceptedApplications: async (): Promise<Application[]> => {
    return applications.filter((a) => a.status === "accepted")
  },

  getRejectedApplications: async (): Promise<Application[]> => {
    return applications.filter((a) => a.status === "rejected")
  },
}
