import React, { useState } from 'react'
import { Calculator, DollarSign, User, Clock, Info, ChevronDown, ChevronUp } from 'lucide-react'

const EstimateSummary = ({ template, formData, estimate, onConfirm, onEdit }) => {
  const [expandedSections, setExpandedSections] = useState({
    breakdown: true,
    details: false,
    timeline: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getComplexityColor = (complexity) => {
    switch (complexity.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-3xl mr-4">{template.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{template.title}</h2>
              <p className="text-gray-600">{template.description}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(template.complexity)}`}>
                  {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)} Complexity
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {template.estimatedTime}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Project Cost</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(estimate.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-lg shadow-md">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
          onClick={() => toggleSection('breakdown')}
        >
          <div className="flex items-center">
            <Calculator className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>
          </div>
          {expandedSections.breakdown ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
        
        {expandedSections.breakdown && (
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(estimate.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2">
                  <span className="text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className={`font-medium ${value < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {value < 0 ? `-${formatCurrency(Math.abs(value))}` : formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Subtotal:</span>
                <span>{formatCurrency(estimate.subtotal || estimate.total * 0.85)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Platform Fee (8%):</span>
                <span>{formatCurrency((estimate.total * 0.08))}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Tax (Estimated):</span>
                <span>{formatCurrency((estimate.total * 0.07))}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between items-center text-xl font-bold text-green-600">
                <span>Total:</span>
                <span>{formatCurrency(estimate.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-lg shadow-md">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
          onClick={() => toggleSection('details')}
        >
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>
          </div>
          {expandedSections.details ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
        
        {expandedSections.details && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Specifications</h4>
                {Object.entries(formData).map(([key, value]) => {
                  if (key === 'images' || key === 'mapData' || key === 'templateId') return null
                  
                  let displayValue = value
                  if (typeof value === 'boolean') {
                    displayValue = value ? 'Yes' : 'No'
                  } else if (Array.isArray(value)) {
                    displayValue = value.join(', ')
                  }
                  
                  if (!displayValue || displayValue === '') return null
                  
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="font-medium text-gray-900">
                        {displayValue}
                      </span>
                    </div>
                  )
                })}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Project Info</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Template:</span>
                    <span className="font-medium text-gray-900">{template.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium text-gray-900 capitalize">{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complexity:</span>
                    <span className="font-medium text-gray-900 capitalize">{template.complexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Duration:</span>
                    <span className="font-medium text-gray-900">{template.estimatedTime}</span>
                  </div>
                  {formData.images && formData.images.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Images Uploaded:</span>
                      <span className="font-medium text-gray-900">{formData.images.length} files</span>
                    </div>
                  )}
                  {formData.mapData && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area Mapped:</span>
                      <span className="font-medium text-gray-900">
                        {Math.round(formData.mapData.totalArea)} sq ft
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {formData.additionalNotes && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {formData.additionalNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timeline & Process */}
      <div className="bg-white rounded-lg shadow-md">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer border-b border-gray-200"
          onClick={() => toggleSection('timeline')}
        >
          <div className="flex items-center">
            <User className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Next Steps & Timeline</h3>
          </div>
          {expandedSections.timeline ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
        
        {expandedSections.timeline && (
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Confirm Project Details</h4>
                  <p className="text-sm text-gray-600">Review and confirm all specifications</p>
                  <span className="text-xs text-gray-500">~5 minutes</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Contractor Matching</h4>
                  <p className="text-sm text-gray-600">We'll match you with qualified contractors</p>
                  <span className="text-xs text-gray-500">~24 hours</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Schedule & Begin Work</h4>
                  <p className="text-sm text-gray-600">Choose your contractor and schedule the project</p>
                  <span className="text-xs text-gray-500">2-5 days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
          >
            Edit Details
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Confirm Project & Find Contractors
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">What happens next?</p>
              <p>After confirming, we'll connect you with vetted contractors who can complete your project according to these specifications. You'll receive multiple quotes and can choose the best fit for your needs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EstimateSummary
