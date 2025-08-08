import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../App'
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Award,
  MapPin,
  Phone,
  Mail,
  Edit,
  Camera,
  Wrench,
  CheckCircle,
  Clock
} from 'lucide-react'

const TechnicianProfile = () => {
  const { technicianId } = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock technician data (in real app, fetch from API)
  const technicianData = {
    id: 'tech-1',
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '(555) 123-4567',
    location: 'Vancouver, BC',
    joinDate: '2023-03-15',
    rating: 4.9,
    tier: 'gold',
    commissionRate: 15,
    completedJobs: 127,
    activeJobs: 3,
    totalEarnings: 45670,
    monthlyEarnings: 3420,
    specialties: ['Deck Refresh', 'Outdoor Projects', 'Pressure Washing'],
    skills: ['Carpentry', 'Landscaping', 'Power Tools', 'Customer Service'],
    certifications: ['Safety Training', 'First Aid', 'Licensed Contractor'],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    },
    bio: 'Experienced contractor with over 8 years in home renovation and outdoor projects. Specializing in deck restoration and maintenance with a focus on quality workmanship and customer satisfaction.',
    reviews: [
      {
        id: 1,
        customerName: 'Sarah Wilson',
        rating: 5,
        comment: 'Excellent work on our deck refresh! Mike was professional, punctual, and the results exceeded our expectations.',
        date: '2024-01-15',
        project: 'Deck Refresh'
      },
      {
        id: 2,
        customerName: 'David Chen',
        rating: 5,
        comment: 'Great communication throughout the project. The pressure washing service was thorough and reasonably priced.',
        date: '2024-01-08',
        project: 'Pressure Washing'
      },
      {
        id: 3,
        customerName: 'Jennifer Martinez',
        rating: 4,
        comment: 'Good quality work. Project was completed on time. Would recommend for outdoor renovation projects.',
        date: '2023-12-22',
        project: 'Garden Bed Installation'
      }
    ],
    recentJobs: [
      {
        id: 'job-1',
        title: 'Deck Refresh',
        status: 'completed',
        client: 'Sarah W.',
        date: '2024-01-15',
        earnings: 850,
        rating: 5
      },
      {
        id: 'job-2',
        title: 'Pressure Washing',
        status: 'in-progress',
        client: 'Michael R.',
        date: '2024-01-20',
        earnings: 320,
        progress: 75
      },
      {
        id: 'job-3',
        title: 'Garden Bed',
        status: 'scheduled',
        client: 'Lisa K.',
        date: '2024-01-25',
        earnings: 680,
        scheduledTime: '9:00 AM'
      }
    ]
  }

  const isOwnProfile = user?.id === technicianId

  const getTierColor = (tier) => {
    switch (tier) {
      case 'gold': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'silver': return 'text-gray-600 bg-gray-100 border-gray-200'
      case 'bronze': return 'text-orange-600 bg-orange-100 border-orange-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getTierBadge = (tier) => {
    const icons = {
      gold: '🥇',
      silver: '🥈',
      bronze: '🥉'
    }
    return icons[tier] || '🏷️'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <img 
                  src="/api/placeholder/120/120" 
                  alt={technicianData.name}
                  className="w-24 h-24 rounded-full mx-auto md:mx-0"
                />
                {isOwnProfile && (
                  <button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 mr-3">{technicianData.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTierColor(technicianData.tier)}`}>
                    {getTierBadge(technicianData.tier)} {technicianData.tier.charAt(0).toUpperCase() + technicianData.tier.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {technicianData.rating} rating • {technicianData.completedJobs} completed jobs
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {technicianData.location}
                </div>
                <div className="flex items-center justify-center md:justify-start text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Member since {new Date(technicianData.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="text-center md:text-right mb-4">
                <p className="text-sm text-gray-500">Commission Rate</p>
                <p className="text-2xl font-bold text-green-600">{technicianData.commissionRate}%</p>
              </div>
              {isOwnProfile && (
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Completed Jobs"
            value={technicianData.completedJobs.toLocaleString()}
            color="green"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            title="Active Jobs"
            value={technicianData.activeJobs}
            color="blue"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            title="Total Earnings"
            value={`$${technicianData.totalEarnings.toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="This Month"
            value={`$${technicianData.monthlyEarnings.toLocaleString()}`}
            subtitle="33% increase"
            color="blue"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'jobs', label: 'Recent Jobs', icon: Wrench },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'availability', label: 'Availability', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Bio Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">{technicianData.bio}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{technicianData.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-600">{technicianData.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {technicianData.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {technicianData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                  <div className="space-y-2">
                    {technicianData.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-600">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h3>
                {technicianData.recentJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-500">Client: {job.client}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-medium">{new Date(job.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Earnings:</span>
                        <p className="font-medium text-green-600">${job.earnings}</p>
                      </div>
                      {job.status === 'completed' && job.rating && (
                        <div>
                          <span className="text-gray-500">Rating:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{job.rating}</span>
                          </div>
                        </div>
                      )}
                      {job.status === 'in-progress' && job.progress && (
                        <div>
                          <span className="text-gray-500">Progress:</span>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${job.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{job.progress}%</span>
                          </div>
                        </div>
                      )}
                      {job.status === 'scheduled' && job.scheduledTime && (
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-medium">{job.scheduledTime}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                {technicianData.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {review.customerName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{review.customerName}</p>
                          <p className="text-sm text-gray-500">{review.project}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {Object.entries(technicianData.availability).map(([day, available]) => (
                    <div key={day} className="text-center">
                      <div className={`p-4 rounded-lg border-2 ${
                        available 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}>
                        <p className="font-medium text-gray-900 capitalize mb-2">{day}</p>
                        <div className={`w-4 h-4 mx-auto rounded-full ${
                          available ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <p className={`text-xs mt-2 ${
                          available ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {available ? 'Available' : 'Not Available'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">Current Status</p>
                      <p className="text-sm text-blue-700">
                        Available for new projects • Next available: Tomorrow
                      </p>
                    </div>
                  </div>
                </div>

                {/* Commission Tier Information */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-900">Commission Tier: {technicianData.tier.charAt(0).toUpperCase() + technicianData.tier.slice(1)}</p>
                      <p className="text-sm text-yellow-700">
                        Current rate: {technicianData.commissionRate}% • Complete 10 more jobs to reach the next tier
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TechnicianProfile
