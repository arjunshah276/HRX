import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../App'
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Wrench,
  Home
} from 'lucide-react'
import { fetchProjectsForUser } from '../lib/supabaseClient'

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Load projects data
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      let data = []
      
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        try {
          data = await fetchProjectsForUser(user?.id || null)
        } catch (err) {
          console.warn('fetchProjectsForUser failed', err)
        }
      }

      // fallback to localStorage
      if (!data || data.length === 0) {
        const local = JSON.parse(localStorage.getItem('projects') || '[]')
        data = local.filter(p => (user?.id ? p.user_id === user?.id : true))
      }

      setProjects(data || [])
      setLoading(false)
    }
    
    loadProjects()
  }, [user])

  // Mock projects for display (fallback if no real projects)
  const mockProjects = [
    {
      id: 1,
      title: 'Kitchen Renovation',
      contractor: 'Smith Construction',
      date: '2024-03-15',
      cost: '12,500',
      status: 'in-progress',
      progress: 65,
      rating: null
    },
    {
      id: 2,
      title: 'Bathroom Remodel',
      contractor: 'Quality Home Services',
      date: '2024-02-28',
      cost: '8,200',
      status: 'completed',
      progress: 100,
      rating: 5
    },
    {
      id: 3,
      title: 'Deck Installation',
      contractor: 'Outdoor Living Pro',
      date: '2024-04-01',
      cost: '6,800',
      status: 'pending',
      progress: 0,
      rating: null
    }
  ]

  // Use real projects if available, otherwise use mock data
  const displayProjects = projects.length > 0 ? projects.map(p => ({
    id: p.id,
    title: p.template_id || p.title || 'Project',
    contractor: p.contractor || 'TBD',
    date: p.created_at || new Date().toISOString(),
    cost: Math.round(p.estimate?.total || p.estimate?.subtotal || 0).toLocaleString(),
    status: p.status || 'pending',
    progress: p.progress || 0,
    rating: p.rating || null
  })) : mockProjects

  const mockStats = {
    customer: {
      totalProjects: displayProjects.length,
      completedProjects: displayProjects.filter(p => p.status === 'completed').length,
      totalSpent: displayProjects.reduce((sum, p) => sum + (parseInt(p.cost.replace(',', '')) || 0), 0),
      averageRating: 4.8,
      activeProjects: displayProjects.filter(p => p.status === 'in-progress').length
    },
    technician: {
      totalJobs: 45,
      completedJobs: 38,
      totalEarned: 24500,
      averageRating: 4.9,
      activeJobs: 3,
      commissionRate: user?.commissionRate || 33,
      tier: user?.tier || 'bronze'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'in-progress': return <Clock className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const StatCard = ({ icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <div className={`text-${color}-600`}>
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  )

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Home className="w-12 h-12 text-white opacity-50" />
        </div>
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Contractor:</span>
            <span className="font-medium">{project.contractor}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Date:</span>
            <span>{new Date(project.date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Cost:</span>
            <span className="font-semibold text-green-600">${project.cost}</span>
          </div>
          {project.progress > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          )}
          {project.rating && (
            <div className="flex items-center text-sm">
              <span className="text-gray-600 mr-2">Rating:</span>
              <div className="flex items-center">
                {[...Array(project.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Projects Tab Component
  const ProjectsTab = () => {
    if (loading) return <div className="text-center py-8">Loading projects...</div>
    
    return (
      <div className="space-y-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">Start your first home renovation project!</p>
            <Link
              to="/new-project"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Project
            </Link>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.type === 'customer' 
                  ? "Here's what's happening with your home renovation projects"
                  : `${user?.tier?.toUpperCase()} Tier Technician • ${user?.commissionRate}% Commission Rate`
                }
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/new-project"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                {user?.type === 'customer' ? 'New Project' : 'Browse Jobs'}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'projects', label: user?.type === 'customer' ? 'My Projects' : 'My Jobs' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {user?.type === 'customer' ? (
                <>
                  <StatCard
                    icon={<Home className="w-6 h-6" />}
                    title="Total Projects"
                    value={mockStats.customer.totalProjects}
                    color="blue"
                  />
                  <StatCard
                    icon={<CheckCircle className="w-6 h-6" />}
                    title="Completed"
                    value={mockStats.customer.completedProjects}
                    color="green"
                  />
                  <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    title="Total Spent"
                    value={`$${mockStats.customer.totalSpent.toLocaleString()}`}
                    color="purple"
                  />
                  <StatCard
                    icon={<Star className="w-6 h-6" />}
                    title="Average Rating"
                    value={mockStats.customer.averageRating}
                    subtitle="Given to contractors"
                    color="yellow"
                  />
                </>
              ) : (
                <>
                  <StatCard
                    icon={<Wrench className="w-6 h-6" />}
                    title="Total Jobs"
                    value={mockStats.technician.totalJobs}
                    color="blue"
                  />
                  <StatCard
                    icon={<DollarSign className="w-6 h-6" />}
                    title="Total Earned"
                    value={`$${mockStats.technician.totalEarned.toLocaleString()}`}
                    color="green"
                  />
                  <StatCard
                    icon={<Star className="w-6 h-6" />}
                    title="Rating"
                    value={mockStats.technician.averageRating}
                    subtitle={`${mockStats.technician.tier} tier`}
                    color="yellow"
                  />
                  <StatCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    title="Commission Rate"
                    value={`${mockStats.technician.commissionRate}%`}
                    subtitle="Current rate"
                    color="purple"
                  />
                </>
              )}
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent {user?.type === 'customer' ? 'Projects' : 'Jobs'}
                </h2>
                <button 
                  onClick={() => setActiveTab('projects')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all →
                </button>
              </div>
              {loading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : displayProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProjects.slice(0, 3).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-600">Start your first home renovation project!</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  to="/new-project"
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {user?.type === 'customer' ? 'Start New Project' : 'Browse Available Jobs'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {user?.type === 'customer' 
                          ? 'Get instant estimates' 
                          : 'Find your next opportunity'
                        }
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="#"
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        Schedule Consultation
                      </h3>
                      <p className="text-xs text-gray-500">
                        Book a free consultation
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="#"
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {user?.type === 'customer' ? 'Find Contractors' : 'View Profile'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {user?.type === 'customer' 
                          ? 'Browse verified professionals' 
                          : 'Update your profile'
                        }
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && <ProjectsTab />}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics</h3>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium text-gray-900 mb-2">Analytics Coming Soon</h4>
                <p className="text-gray-600">
                  Detailed insights about your {user?.type === 'customer' ? 'project history' : 'job performance'} will be available here.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
