import { useState, type ReactNode } from "react"
import {
  Search,
  Filter,
  FileText,
  Briefcase,
  Play,
  Eye,
  Trash2,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  ChevronDown
} from "lucide-react"

// Mock history data
const mockSessions = [
  {
    id: "1",
    name: "Google SWE Interview Prep",
    type: "Resume",
    score: 85,
    date: "2024-01-15",
    status: "completed",
    questions: 10,
    duration: "24 minutes",
    category: "Technical",
  },
  {
    id: "2",
    name: "Meta Product Manager Role",
    type: "Job Description",
    score: 72,
    date: "2024-01-14",
    status: "completed",
    questions: 15,
    duration: "32 minutes",
    category: "Product",
  },
  {
    id: "3",
    name: "Amazon Leadership Principles",
    type: "Resume",
    score: null,
    date: "2024-01-13",
    status: "in-progress",
    questions: 8,
    duration: "12 minutes",
    category: "Behavioral",
  },
  {
    id: "4",
    name: "Startup Technical Interview",
    type: "Job Description",
    score: 91,
    date: "2024-01-12",
    status: "completed",
    questions: 12,
    duration: "28 minutes",
    category: "Technical",
  },
  {
    id: "5",
    name: "Microsoft System Design",
    type: "Resume",
    score: 78,
    date: "2024-01-11",
    status: "completed",
    questions: 6,
    duration: "45 minutes",
    category: "System Design",
  },
  {
    id: "6",
    name: "Netflix Culture Interview",
    type: "Job Description",
    score: 88,
    date: "2024-01-10",
    status: "completed",
    questions: 8,
    duration: "18 minutes",
    category: "Behavioral",
  },
]

// Custom components
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false
}: {
  children: React.ReactNode,
  variant?: "primary" | "outline" | "secondary",
  size?: "sm" | "md" | "lg",
  className?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  disabled?: boolean
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-md",
    lg: "px-6 py-3 text-base rounded-lg"
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
      {children}
    </div>
  )
}

type BadgeProps = {
  children: React.ReactNode,
  variant?: "default" | "outline" | "secondary",
  className?: string
}

const Badge = ({ children, variant = "default", className = "" }: BadgeProps) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-200 bg-white text-gray-700",
    secondary: "bg-gray-100 text-gray-800"
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

type SelectProps = {
  value: string,
  onValueChange: (value: string) => void,
children: React.ReactElement<{
    children: ReactNode; value: string;
}>[],
  placeholder: string
}

const Select = ({ value, onValueChange, children, placeholder }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        type="button"
        className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="block truncate text-sm">
          {value === "all" ? placeholder : value}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          {children.map((child, index) => (
            <div
              key={index}
              className="relative cursor-default select-none py-2 pl-3 pr-9 text-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onValueChange(child.props.value)
                setIsOpen(false)
              }}
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

const SelectItem = ({ value, children }: SelectItemProps) => {
  return <option value={value}>{children}</option>
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredSessions = mockSessions.filter((session) => {
    const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    const matchesType = typeFilter === "all" || session.type.toLowerCase() === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: mockSessions.length,
    completed: mockSessions.filter((s) => s.status === "completed").length,
    inProgress: mockSessions.filter((s) => s.status === "in-progress").length,
    averageScore: Math.round(
      mockSessions.filter((s) => s.score).reduce((acc, s) => acc + s.score!, 0) /
        mockSessions.filter((s) => s.score).length,
    ),
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-3/4 mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview History</h1>
            <p className="text-gray-600">Track your progress and review past interviews</p>
          </div>
          <Button className="mt-4 sm:mt-0">
            Start New Interview
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter & Search
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search interviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter} placeholder="Filter by status">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter} placeholder="Filter by type">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="job description">Job Description</SelectItem>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy} placeholder="Sort by">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </Select>
            </div>
          </div>
        </Card>

        {/* Sessions Table */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Interview Sessions ({filteredSessions.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Name</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-4 py-6 whitespace-nowrap">
                      <div className="text-base font-semibold text-gray-900">{session.name}</div>
                      <div className="text-sm text-gray-500">{session.category}</div>
                    </td>
                    <td className="px-4 py-6 whitespace-nowrap">
                      <Badge variant="outline" className="flex items-center w-fit text-sm px-3 py-1">
                        {session.type === "Resume" ? (
                          <FileText className="w-4 h-4 mr-2" />
                        ) : (
                          <Briefcase className="w-4 h-4 mr-2" />
                        )}
                        {session.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-6 whitespace-nowrap">
                      {session.score ? (
                        <span
                          className={`text-lg font-bold ${
                            session.score >= 80
                              ? "text-green-600"
                              : session.score >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {session.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-lg">-</span>
                      )}
                    </td>
                    <td className="px-4 py-6 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{session.duration}</div>
                      <div className="text-xs text-gray-500">{session.questions} questions</div>
                    </td>
                    <td className="px-4 py-6 whitespace-nowrap text-gray-600">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-6 whitespace-nowrap">
                      <Badge
                        variant={session.status === "completed" ? "default" : "secondary"}
                        className={`text-sm px-3 py-1 ${
                          session.status === "completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {session.status === "completed" ? "Completed" : "In Progress"}
                      </Badge>
                    </td>
                    <td className="px-4 py-6 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-3">
                        {session.status === "in-progress" ? (
                          <Button size="md">
                            <Play className="w-4 h-4 mr-2" />
                            Continue
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="md">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="md">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="md" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}