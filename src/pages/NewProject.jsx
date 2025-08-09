import React, { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../App'
import { templates, calculateProjectEstimate } from '../utils/templates'
import { supabase, insertProject, insertActivity } from '../lib/supabaseClient'
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  X, 
  MapPin, 
  Calculator,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const NewProject = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState(location.state?.selectedTemplate || '')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [estimate, setEstimate] = useState(null)

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm()

  const watchedValues = watch()

  // Get current template
  const template = selectedTemplate ? templates[selectedTemplate] : null

  const steps = [
    { id: 1, title: 'Select Template', description: 'Choose your project type' },
    { id: 2, title: 'Project Details', description: 'Customize your requirements' },
    { id: 3, title: 'Review & Estimate', description: 'Review and get your quote' }
  ]

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    setCurrentStep(2)
    reset()
    setEstimate(null)
  }

  const handleFileUpload = (fieldId, event) => {
    const files = Array.from(event.target.files)
    const field = template.fields.find(f => f.id === fieldId)
    const maxFiles = field?.maxFiles || 5

    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`)
      return
    }

    // Store files with preview URLs
    const processedFiles = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      fieldId
    }))

    setUploadedFiles(prev => {
      const filtered = prev.filter(f => f.fieldId !== fieldId)
      return [...filtered, ...processedFiles]
    })

    setValue(fieldId, files)
  }

  const removeFile = (fieldId, fileName) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => !(f.fieldId === fieldId && f.name === fileName))
      const remainingFiles = updated.filter(f => f.fieldId === fieldId).map(f => f.file)
      setValue(fieldId, remainingFiles)
      return updated
    })
  }

 const calculateEstimate = async (formData) => {
  setIsCalculating(true)

  // Simulate API call delay
  setTimeout(async () => {
    let cost
    try {
      cost = calculateProjectEstimate(selectedTemplate, formData, user?.id)
      setEstimate(cost ?? { total: 0, breakdown: {} })
    } catch (err) {
      console.error('Estimate calc failed:', err)
      setEstimate({ total: 0, breakdown: {} })
    }

    // Try to log to Supabase (best-effort)
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        await insertActivity({
          user_id: user?.id || null,
          session_id: sessionStorage.getItem('sessionId') || null,
          action: 'ESTIMATE_CALCULATED',
          payload: {
            templateId: selectedTemplate,
            summary: {
              total: cost?.total || 0,
              materialCost: cost?.materialCost || 0,
              laborHours: cost?.laborHours || 0
            },
            formData: { ...formData, images: formData.images?.length || 0 }
          }
        })
      } catch (err) {
        console.warn('Supabase activity insert failed, falling back to local log')
      }
    }

    setIsCalculating(false)
  }, 1500)
}

const onSubmit = async (data) => {
  if (currentStep === 2) {
    calculateEstimate(data)
    setCurrentStep(3)
  } else if (currentStep === 3) {
    // Submit project
    const projectData = {
      template_id: selectedTemplate,
      form_data: data,
      files: uploadedFiles.map(f => ({ name: f.name, size: f.size, fieldId: f.fieldId })),
      estimate,
      user_id: user?.id || null,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    // First try Supabase insert
    let savedProject = null
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      try {
        savedProject = await insertProject(projectData)
      } catch (err) {
        console.warn('Supabase insert failed, falling back to localStorage', err)
      }
    }

    // Fallback: store in localStorage with an id
    if (!savedProject) {
      const projects = JSON.parse(localStorage.getItem('projects') || '[]')
      const newProject = { ...projectData, id: Date.now().toString() }
      projects.push(newProject)
      localStorage.setItem('projects', JSON.stringify(projects))
      savedProject = newProject
    }

    // Optionally, log project create activity
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        await insertActivity({
          user_id: user?.id || null,
          session_id: sessionStorage.getItem('sessionId') || null,
          action: 'PROJECT_CREATED',
          payload: { projectId: savedProject.id, templateId: selectedTemplate }
        })
      }
    } catch (err) {
      console.warn('Supabase activity log failed for project create', err)
    }

    // Navigate to estimate display with the saved project data
    navigate(`/estimate/${savedProject.id}`, { state: { projectData: savedProject } })
  }
}

  const renderField = (field) => {
    const fieldError = errors[field.id]
    const fieldValue = watchedValues[field.id]
    
    // Check if field should be shown based on dependencies
    if (field.dependsOn && !watchedValues[field.dependsOn]) {
      return null
    }

    const baseClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      fieldError ? 'border-red-300' : 'border-gray-300'
    }`

    switch (field.type) {
      case 'number':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
            </label>
            <input
              type="number"
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false,
                min: field.min ? { value: field.min, message: `Minimum value is ${field.min}` } : undefined,
                max: field.max ? { value: field.max, message: `Maximum value is ${field.max}` } : undefined
              })}
              className={baseClasses}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false
              })}
              className={baseClasses}
            >
              <option value="">Select an option...</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register(field.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {field.description && (
              <p className="mt-1 text-xs text-gray-500">{field.description}</p>
            )}
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )

      case 'checkbox-group':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(field.id)}
                    value={option.value}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false
              })}
              className={`${baseClasses} h-20`}
              placeholder={field.placeholder}
              rows={3}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )

      case 'file':
        const filesForField = uploadedFiles.filter(f => f.fieldId === field.id)
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.maxFiles && (
                <span className="text-gray-500 ml-1">(Max {field.maxFiles} files)</span>
              )}
            </label>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById(`file-${field.id}`).click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG up to 10MB each
              </p>
            </div>

            <input
              id={`file-${field.id}`}
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => handleFileUpload(field.id, e)}
              className="hidden"
            />

            {/* File Preview */}
            {filesForField.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {filesForField.map((file) => (
                  <div key={file.name} className="relative">
                    <div className="bg-gray-100 rounded-lg p-2">
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(field.id, file.name)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )

      default:
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              {...register(field.id, {
                required: field.required ? `${field.label} is required` : false
              })}
              className={baseClasses}
              placeholder={field.placeholder}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError.message}</p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Choose Your Project Template
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(templates).map((tmpl) => (
                  <div 
                    key={tmpl.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTemplate === tmpl.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(tmpl.id)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{tmpl.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {tmpl.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {tmpl.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>⏱️ {tmpl.estimatedTime}</span>
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                          {tmpl.complexity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Project Details Form */}
          {currentStep === 2 && template && (
            <div>
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-3">{template.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {template.title} Details
                  </h2>
                  <p className="text-gray-600">{template.description}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {template.fields.map((field) => renderField(field))}
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Get Estimate
                    <Calculator className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Review & Estimate */}
          {currentStep === 3 && template && (
            <div>
              <div className="flex items-center mb-6">
                <div className="text-3xl mr-3">{template.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Project Estimate
                  </h2>
                  <p className="text-gray-600">Review your project details and cost breakdown</p>
                </div>
              </div>

              {isCalculating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Calculating your custom estimate...</p>
                </div>
              ) : estimate ? (
                <div className="space-y-6">
                  {/* Cost Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(estimate?.breakdown || {}).map(([key, rawValue]) => {
  // Normalize value to number when appropriate
  const value = typeof rawValue === 'number' ? rawValue : Number(rawValue || 0)

  const label = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())

  // Special-case labor hours to show units instead of currency
  if (key === 'laborHours') {
    return (
      <div key={key} className="flex justify-between text-sm">
        <span className="capitalize text-gray-600">{label}</span>
        <span className="font-medium">{value} hrs</span>
      </div>
    )
  }

  // Default: show currency
  return (
    <div key={key} className="flex justify-between text-sm">
      <span className="capitalize text-gray-600">{label}</span>
      <span className="font-medium">
        {value < 0 ? '-' : ''}${Math.abs(Math.round(value)).toLocaleString()}
      </span>
    </div>
  )
})}

                      <div className="border-t border-gray-300 pt-2 mt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Project Cost</span>
                          <span className="text-green-600">${estimate.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Commission Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Transparent Pricing</h4>
                        <p className="text-sm text-blue-700">
                          Platform commission (8-12%) and technician payout are calculated transparently. 
                          Technicians receive 67-88% of the project total based on their tier.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Project Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Template:</span>
                        <span className="ml-2 font-medium">{template.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Time:</span>
                        <span className="ml-2 font-medium">{template.estimatedTime}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Complexity:</span>
                        <span className="ml-2 font-medium capitalize">{template.complexity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium capitalize">{template.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Details
                    </button>
                    <div className="space-x-3">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Save Estimate
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Submit Project
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewProject
