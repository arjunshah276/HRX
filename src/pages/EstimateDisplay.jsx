import React, { useState } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { templates, calculateTechnicianPayout } from '../utils/templates'
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Download, 
  Share, 
  MapPin, 
  Clock,
  DollarSign,
  User,
  Star,
  Phone,
  Mail
} from 'lucide-react'

const EstimateDisplay = () => {
  const { projectId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedContractor, setSelectedContractor] = useState(null)
  const [showScheduling, setShowScheduling] = useState(false)

  // Get project data (from location state or localStorage)
  const projectData = location.state?.projectData || 
    JSON.parse(localStorage.getItem('projects') || '[]').find(p => p.id === projectId)

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The requested project estimate could not be found.</p>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const template = templates[projectData.templateId]
  const estimate = projectData.estimate

  // Mock contractor data
  const availableContractors = [
    {
      id: 'tech-1',
      name: 'Mike Johnson',
      rating: 4.9,
      completedJobs: 127,
      specialties: ['Deck Refresh', 'Outdoor Projects'],
      tier: 'gold',
      commissionRate: 15,
      availability: '2 days',
      distance: '3.2 miles',
      phone: '(555) 123-4567',
      email: 'mike.j@example.com',
      reviews: 89,
      profileImage: '/api/placeholder/64/64'
    },
    {
      id: 'tech-2',
      name: 'Sarah Wilson',
      rating: 4.8,
      completedJobs: 94,
      specialties: ['Garden Design', 'Landscaping'],
      tier: 'silver',
      commissionRate: 20,
      availability: '1 week',
      distance: '5.1 miles',
      phone: '(555) 987-6543',
      email: 'sarah.w@example.com',
      reviews: 72,
      profileImage: '/api/placeholder/64/64'
    },
    {
      id: 'tech-3',
      name: 'David Chen',
      rating: 4.7,
      completedJobs: 156,
      specialties: ['Pressure Washing', 'Maintenance'],
      tier: 'bronze',
      commissionRate: 25,
      availability: '3 days',
      distance: '7.8 miles',
      phone: '(555) 456-7890',
      email: 'david.c@example.com',
      reviews: 134,
      profileImage: '/api/placeholder/64/64'
    }
  ]

  const handleContractorSelect = (contractor) => {
    setSelectedContractor(contractor)
    setShowScheduling(true)
  }

  const handleProjectConfirm = () => {
    // Update project status
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { ...p, status: 'confirmed', contractor: selectedContractor, confirmedAt: new Date().toISOString() }
        : p
    )
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
    
    navigate('/dashboard')
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'gold': return 'text-yellow-600 bg-yellow-100'
      case 'silver': return 'text-gray-600 bg-gray-100'
      case 'bronze': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

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

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-3xl mr-4">{template.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {template.title} Estimate
                </h1>
                <p className="text-gray-600">Project ID: #{projectId}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created: {new Date(projectData.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Estimate Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
              <div className="space-y-3">
                {Object.entries(estimate.breakdown).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="capitalize text-gray-600">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="font-medium">
                      {value < 0 ? (
                        <span className="text-green-600">-${Math.abs(value).toLocaleString()}</span>
                      ) : (
                        <span>${value.toLocaleString()}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Project Cost</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${estimate.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Details Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Template</span>
                    <p className="text-gray-900">{template.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-gray-900 capitalize">{template.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estimated Duration</span>
                    <p className="text-gray-900">{template.estimatedTime}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Complexity</span>
                    <p className="text-gray-900 capitalize">{template.complexity}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending Contractor Selection
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Data Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(projectData.formData).map(([key, value]) => {
                    if (typeof value === 'boolean') {
                      return value ? (
                        <div key={key} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                      ) : null
                    }
                    if (Array.isArray(value) && value.length > 0) {
                      return (
                        <div key={key}>
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="ml-2">{value.join(', ')}</span>
                        </div>
                      )
                    }
                    if (typeof value === 'string' && value.length > 0) {
                      return (
                        <div key={key}>
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="ml-2">{value}</span>
                        </div>
                      )
                    }
                    return null
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contractor Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Contractors</h2>
              <div className="space-y-4">
                {availableContractors.map((contractor) => {
                  const technicianPayout = calculateTechnicianPayout(estimate.total, contractor.commissionRate)
                  
                  return (
                    <div key={contractor.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={contractor.profileImage} 
                            alt={contractor.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {contractor.rating} ({contractor.reviews} reviews)
                                </span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(contractor.tier)}`}>
                                {contractor.tier.charAt(0).toUpperCase() + contractor.tier.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Completed Jobs:</span>
                          <p className="font-medium">{contractor.completedJobs}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Available:</span>
                          <p className="font-medium">{contractor.availability}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Distance:</span>
                          <p className="font-medium">{contractor.distance}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Commission:</span>
                          <p className="font-medium">{contractor.commissionRate}%</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="text-sm text-gray-500">Specialties:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contractor.specialties.map((specialty, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-sm text-gray-500">Technician Payout:</span>
                          <p className="font-semibold text-green-600">${technicianPayout.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleContractorSelect(contractor)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Scheduling Modal */}
            {showScheduling && selectedContractor && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Schedule with {selectedContractor.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Morning (8:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 5:00 PM)</option>
                      <option>Evening (5:00 PM - 8:00 PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      rows="3"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Any special instructions or requirements..."
                    ></textarea>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleProjectConfirm}
                      className="flex-1 bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 font-medium"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => setShowScheduling(false)}
                      className="flex-1 bg-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-400 font-medium"
                    >
                      Cancel
                    </button>
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

export default EstimateDisplay
