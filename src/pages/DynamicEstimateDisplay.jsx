import React, { useState, useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { 
  templates, 
  calculateProjectEstimate, 
  calculateProjectTotal, 
  mockContractors,
  logActivity,
  initializeSession
} from '../utils/templates'
import { 
  ArrowLeft, 
  CheckCircle, 
  Calendar, 
  Download, 
  Share, 
  Clock,
  DollarSign,
  User,
  Star,
  Send,
  AlertCircle,
  CheckSquare
} from 'lucide-react'

const DynamicEstimateDisplay = () => {
  const { projectId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [selectedContractors, setSelectedContractors] = useState([])
  const [quotesRequested, setQuotesRequested] = useState(false)
  const [contractorQuotes, setContractorQuotes] = useState({})
  const [finalContractor, setFinalContractor] = useState(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  // Initialize session on component mount
  useEffect(() => {
    initializeSession()
    logActivity('ESTIMATE_PAGE_VIEWED', {
      projectId,
      userId: user?.id
    })
  }, [projectId, user])

  // Get project data
  const projectData = location.state?.projectData || 
  JSON.parse(localStorage.getItem('projects') || '[]').find(p => p.id === projectId)

const formData = projectData?.form_data || projectData?.formData || {}

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

  const template = templates[projectData.template_id || projectData.templateId]

// Add safety check
if (!template) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h2>
        <p className="text-gray-600 mb-4">Template "{projectData.template_id || projectData.templateId}" could not be loaded.</p>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
          Return to Dashboard
        </Link>
      </div>
    </div>
  )
}
  const baseEstimate = calculateProjectEstimate(
  projectData.template_id || projectData.templateId, 
  formData,  // Use our safe formData
  user?.id
)

  // Calculate pricing for each contractor
  const contractorPricing = mockContractors.reduce((acc, contractor) => {
    acc[contractor.id] = calculateProjectTotal(baseEstimate, contractor.hourlyRate)
    return acc
  }, {})

  const handleContractorToggle = (contractorId) => {
    logActivity('CONTRACTOR_SELECTED', {
      contractorId,
      projectId,
      userId: user?.id
    })

    setSelectedContractors(prev => 
      prev.includes(contractorId) 
        ? prev.filter(id => id !== contractorId)
        : [...prev, contractorId]
    )
  }

  const handleRequestQuotes = () => {
    if (selectedContractors.length === 0) {
      alert('Please select at least one contractor to request quotes from.')
      return
    }

    logActivity('QUOTES_REQUESTED', {
      selectedContractors,
      projectId,
      userId: user?.id,
      baseEstimate
    })

    setQuotesRequested(true)
    setShowQuoteModal(true)
    
    // Simulate contractor responses (in real app, this would be async)
    setTimeout(() => {
      const quotes = {}
      selectedContractors.forEach(contractorId => {
        const contractor = mockContractors.find(c => c.id === contractorId)
        const basePrice = contractorPricing[contractorId]
        
        // Add some variation to simulate real quotes
        const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
        const adjustedTotal = Math.round(basePrice.total * (1 + variation))
        
        quotes[contractorId] = {
          ...basePrice,
          total: adjustedTotal,
          message: `Available ${contractor.availability}. Quote valid for 7 days.`,
          confirmed: true,
          respondedAt: new Date().toISOString()
        }
      })
      
      setContractorQuotes(quotes)
      logActivity('QUOTES_RECEIVED', {
        quotes,
        projectId,
        userId: user?.id
      })
    }, 2000)
  }

  const handleFinalSelection = (contractorId) => {
    const contractor = mockContractors.find(c => c.id === contractorId)
    const quote = contractorQuotes[contractorId]
    
    logActivity('CONTRACTOR_FINALIZED', {
      contractorId,
      contractor: contractor.name,
      finalQuote: quote,
      projectId,
      userId: user?.id
    })

    setFinalContractor(contractor)
    
    // Update project in storage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')
    const updatedProjects = projects.map(p => 
      p.id === projectId 
        ? { 
            ...p, 
            status: 'contractor-selected',
            selectedContractor: contractor,
            finalQuote: quote,
            updatedAt: new Date().toISOString()
          }
        : p
    )
    localStorage.setItem('projects', JSON.stringify(updatedProjects))
  }

  const getLowestQuote = () => {
    if (Object.keys(contractorQuotes).length === 0) return null
    return Math.min(...Object.values(contractorQuotes).map(q => q.total))
  }

  const getHighestQuote = () => {
    if (Object.keys(contractorQuotes).length === 0) return null
    return Math.max(...Object.values(contractorQuotes).map(q => q.total))
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
                  {template.title} Project Estimate
                </h1>
                <p className="text-gray-600">Project ID: #{projectId}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created: {new Date(projectData.createdAt).toLocaleDateString()}
                  <Clock className="w-4 h-4 ml-4 mr-1" />
                  Estimated Duration: {template.estimatedTime}
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

        {/* Quote Status Banner */}
        {quotesRequested && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Send className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Quotes Requested from {selectedContractors.length} Contractor(s)
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {Object.keys(contractorQuotes).length > 0 
                    ? `${Object.keys(contractorQuotes).length} quote(s) received. Price range: ${getLowestQuote()?.toLocaleString()} - ${getHighestQuote()?.toLocaleString()}`
                    : 'Waiting for contractor responses...'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base Project Estimate */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Base Project Estimate</h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  Pricing Varies by Contractor
                </span>
              </div>

              {/* Materials Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Materials Required</h3>
                <div className="space-y-2">
                  {baseEstimate.materials.map((material, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <span className="text-gray-900 font-medium">{material.item}</span>
                        <span className="text-gray-500 text-sm ml-2">({material.quantity})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-600 text-sm">${material.unitPrice}/unit</span>
                        <p className="font-medium">${material.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 border-t border-gray-200 font-medium">
                    <span className="text-gray-700">Total Materials</span>
                    <span className="text-blue-600">${baseEstimate.materialCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Labor & Other Costs */}
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <div>
                    <span className="text-gray-700 font-medium">Labor Hours Required</span>
                    <p className="text-sm text-gray-500">Rate varies by contractor</p>
                  </div>
                  <span className="font-medium text-gray-900">{baseEstimate.laborHours} hours</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">Transportation</span>
                  <span className="font-medium">${baseEstimate.transportation}</span>
                </div>
                
                {baseEstimate.disposal > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-700">Disposal & Cleanup</span>
                    <span className="font-medium">${baseEstimate.disposal}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-yellow-800 font-medium">Final pricing depends on contractor selection</p>
                        <p className="text-yellow-700 mt-1">
                          Each contractor has different hourly rates. Platform fee (10%, max $399) and 5% GST will be added to final total.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Specifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <p className="text-gray-900 capitalize">{template.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Complexity</span>
                  <p className="text-gray-900 capitalize">{baseEstimate.complexity}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estimated Duration</span>
                  <p className="text-gray-900">{baseEstimate.estimatedTime}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Labor Hours</span>
                  <p className="text-gray-900">{baseEstimate.laborHours} hours</p>
                </div>
              </div>

              {/* Form Data Display */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(formData).map(([key, value]) => {
                    // Handle images safely
                    if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo')) {
                      if (Array.isArray(value) && value.length > 0) {
                        return (
                          <div key={key} className="col-span-full">
                            <span className="font-medium capitalize block mb-2">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {value.map((file, index) => (
                                <div key={index} className="relative">
                                  {file instanceof File ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Project image ${index + 1}`}
                                      className="w-full h-20 object-cover rounded border"
                                    />
                                  ) : typeof file === 'string' ? (
                                    <img
                                      src={file}
                                      alt={`Project image ${index + 1}`}
                                      className="w-full h-20 object-cover rounded border"
                                    />
                                  ) : (
                                    <div className="w-full h-20 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500">
                                      Image {index + 1}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    }
                    
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
                    if (typeof value === 'number' && !isNaN(value)) {
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
            {!quotesRequested ? (
              // Contractor Selection Phase
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Select Contractors</h2>
                  <span className="text-sm text-gray-500">
                    {selectedContractors.length} selected
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  {mockContractors.map((contractor) => {
                    const pricing = contractorPricing[contractor.id]
                    const isSelected = selectedContractors.includes(contractor.id)
                    
                    return (
                      <div 
                        key={contractor.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleContractorToggle(contractor.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img 
                                src={contractor.profileImage} 
                                alt={contractor.name}
                                className="w-12 h-12 rounded-full"
                              />
                              {isSelected && (
                                <CheckSquare className="absolute -top-1 -right-1 w-5 h-5 text-blue-600 bg-white rounded" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {contractor.rating} ({contractor.reviews} reviews)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Hourly Rate:</span>
                            <p className="font-medium">${contractor.hourlyRate}/hr</p>
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
                            <span className="text-gray-500">Jobs Done:</span>
                            <p className="font-medium">{contractor.completedJobs}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="text-sm text-gray-500">Specialties:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {contractor.specialties.map((specialty, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <div className="text-center">
                            <span className="text-sm text-gray-500">Estimated Total:</span>
                            <p className="text-lg font-bold text-green-600">
                              ${pricing.total.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              Labor: ${pricing.laborCost.toLocaleString()} ({baseEstimate.laborHours}h × ${contractor.hourlyRate}/h)
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={handleRequestQuotes}
                  disabled={selectedContractors.length === 0}
                  className="w-full bg-blue-600 text-white rounded-md py-3 px-4 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Request Quotes from Selected Contractors
                </button>
              </div>
            ) : (
              // Quote Results Phase
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contractor Quotes</h2>
                
                <div className="space-y-4">
                  {selectedContractors.map((contractorId) => {
                    const contractor = mockContractors.find(c => c.id === contractorId)
                    const quote = contractorQuotes[contractorId]
                    
                    return (
                      <div key={contractorId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={contractor.profileImage} 
                              alt={contractor.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">{contractor.name}</h3>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{contractor.rating}</span>
                              </div>
                            </div>
                          </div>
                          {quote ? (
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                ${quote.total.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">Quote received</p>
                            </div>
                          ) : (
                            <div className="text-right">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              <p className="text-xs text-gray-500 mt-1">Waiting...</p>
                            </div>
                          )}
                        </div>

                        {quote && (
                          <>
                            <div className="text-sm text-gray-600 mb-3">
                              <p>"{quote.message}"</p>
                            </div>
                            
                            <div className="bg-gray-50 rounded p-3 text-sm mb-3">
                              <div className="grid grid-cols-2 gap-2">
                                <div>Materials: ${quote.materialCost.toLocaleString()}</div>
                                <div>Labor: ${quote.laborCost.toLocaleString()}</div>
                                <div>Transport: ${quote.transportation.toLocaleString()}</div>
                                <div>Disposal: ${quote.disposal.toLocaleString()}</div>
                                <div>Platform Fee: ${quote.platformFee.toLocaleString()}</div>
                                <div>GST: ${quote.gst.toLocaleString()}</div>
                              </div>
                            </div>

                            {!finalContractor && (
                              <button
                                onClick={() => handleFinalSelection(contractorId)}
                                className="w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 font-medium"
                              >
                                Select This Contractor
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {finalContractor && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-green-900">
                          Contractor Selected: {finalContractor.name}
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          You can now proceed to scheduling and project kickoff.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicEstimateDisplay
