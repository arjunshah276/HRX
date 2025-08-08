// Example integration of activity logging in various components

import React, { useState, useEffect } from 'react'
import { useActivityLogger, logProjectFunnel, logRegistrationFunnel } from './utils/ActivityLogger'

// 1. Template Selection Component with Logging
const TemplateSelector = ({ templates, onTemplateSelect }) => {
  const activityLogger = useActivityLogger()
  const [viewStartTime, setViewStartTime] = useState(Date.now())

  useEffect(() => {
    activityLogger.logPageView('TemplateSelector')
  }, [])

  const handleTemplateView = (template) => {
    const timeSpent = Date.now() - viewStartTime
    logProjectFunnel.templateView(template.id, {
      templateName: template.title,
      category: template.category,
      timeSpent: Math.round(timeSpent / 1000)
    })
    setViewStartTime(Date.now())
  }

  const handleTemplateSelect = (template) => {
    const timeSpent = Date.now() - viewStartTime
    logProjectFunnel.templateSelect(template.id, {
      templateName: template.title,
      category: template.category,
      timeSpent: Math.round(timeSpent / 1000),
      alternativesViewed: templates.length
    })
    onTemplateSelect(template)
  }

  return (
    <div className="template-grid">
      {templates.map(template => (
        <div 
          key={template.id}
          className="template-card"
          onClick={() => handleTemplateSelect(template)}
          onMouseEnter={() => handleTemplateView(template)}
        >
          <div className="template-icon">{template.icon}</div>
          <h3>{template.title}</h3>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  )
}

// 2. Project Form Component with Field-Level Logging
const ProjectForm = ({ template, onFormSubmit }) => {
  const activityLogger = useActivityLogger()
  const [formData, setFormData] = useState({})
  const [fieldInteractions, setFieldInteractions] = useState({})
  const [formStartTime] = useState(Date.now())

  useEffect(() => {
    activityLogger.logPageView('ProjectForm', { templateId: template.id })
  }, [template.id])

  const handleFieldFocus = (fieldId) => {
    setFieldInteractions(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], focusTime: Date.now() }
    }))

    activityLogger.logFormFieldInteraction(fieldId, 'focus', {
      fieldType: template.fields.find(f => f.id === fieldId)?.type,
      templateId: template.id
    })
  }

  const handleFieldBlur = (fieldId) => {
    const interaction = fieldInteractions[fieldId]
    if (interaction?.focusTime) {
      const timeSpent = Date.now() - interaction.focusTime
      activityLogger.logFormFieldInteraction(fieldId, 'blur', {
        fieldType: template.fields.find(f => f.id === fieldId)?.type,
        timeSpent: Math.round(timeSpent / 1000),
        templateId: template.id
      })
    }
  }

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    const field = template.fields.find(f => f.id === fieldId)
    const isValid = validateField(field, value)
    
    activityLogger.logFormFieldInteraction(fieldId, 'change', {
      fieldType: field?.type,
      hasValue: !!value,
      isValid,
      templateId: template.id,
      sensitive: field?.type === 'password' || fieldId.includes('phone')
    })

    // Log form progress
    const completedFields = Object.keys(formData).filter(key => formData[key]).length
    const totalFields = template.fields.filter(f => f.required).length
    const completion = Math.round((completedFields / totalFields) * 100)
    
    logProjectFunnel.formProgress(completion, {
      templateId: template.id,
      fieldsCompleted: completedFields,
      totalFields: totalFields,
      timeSpent: Math.round((Date.now() - formStartTime) / 1000)
    })
  }

  const handleImageUpload = (files) => {
    const startTime = Date.now()
    
    // Simulate upload process
    setTimeout(() => {
      const uploadDuration = Date.now() - startTime
      activityLogger.logImageUpload({
        fileCount: files.length,
        totalSize: Array.from(files).reduce((sum, file) => sum + file.size, 0),
        fileTypes: [...new Set(Array.from(files).map(file => file.type))],
        uploadDuration: Math.round(uploadDuration / 1000),
        success: true,
        templateId: template.id
      })
    }, 1000)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const formDuration = Date.now() - formStartTime
    
    logProjectFunnel.estimate({
      templateId: template.id,
      formData,
      formCompletionTime: Math.round(formDuration / 1000),
      fieldsCompleted: Object.keys(formData).length
    })
    
    onFormSubmit(formData)
  }

  const validateField = (field, value) => {
    if (field?.required && !value) return false
    if (field?.min && parseFloat(value) < field.min) return false
    if (field?.max && parseFloat(value) > field.max) return false
    return true
  }

  return (
    <form onSubmit={handleFormSubmit}>
      {template.fields.map(field => (
        <div key={field.id} className="form-field">
          <label>{field.label}</label>
          {field.type === 'file' && field.multiple ? (
            <input
              type="file"
              multiple
              accept={field.accept}
              onChange={(e) => handleImageUpload(e.target.files)}
              onFocus={() => handleFieldFocus(field.id)}
              onBlur={() => handleFieldBlur(field.id)}
            />
          ) : (
            <input
              type={field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => handleFieldFocus(field.id)}
              onBlur={() => handleFieldBlur(field.id)}
              required={field.required}
            />
          )}
        </div>
      ))}
      <button type="submit">Generate Estimate</button>
    </form>
  )
}

// 3. Registration Component with Funnel Tracking
const RegistrationForm = ({ userType = 'customer' }) => {
  const activityLogger = useActivityLogger()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [registrationStartTime] = useState(Date.now())

  useEffect(() => {
    logRegistrationFunnel.start(userType, {
      referrer: document.referrer,
      campaign: new URLSearchParams(window.location.search).get('utm_campaign')
    })
  }, [userType])

  const handleStepComplete = (stepNumber, stepData) => {
    const stepDuration = Date.now() - registrationStartTime
    logRegistrationFunnel.step(`step_${stepNumber}`, stepNumber, {
      ...stepData,
      stepDuration: Math.round(stepDuration / 1000),
      fieldsCompleted: Object.keys(formData).length
    })
  }

  const handleRegistrationComplete = (userId) => {
    const totalDuration = Date.now() - registrationStartTime
    logRegistrationFunnel.complete(userId, userType, Math.round(totalDuration / 1000), {
      completedFields: Object.keys(formData),
      totalSteps: 3
    })
  }

  const handleRegistrationAbandon = (reason) => {
    logRegistrationFunnel.abandon(`step_${currentStep}`, reason, {
      timeSpent: Math.round((Date.now() - registrationStartTime) / 1000),
      fieldsCompleted: Object.keys(formData).length
    })
  }

  // Component renders steps...
  return (
    <div className="registration-form">
      {/* Registration form content */}
    </div>
  )
}

// 4. Error Boundary with Logging
class ErrorBoundaryWithLogging extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    const activityLogger = new (require('./utils/ActivityLogger').default)()
    activityLogger.logError(error, {
      component: this.props.componentName || 'Unknown',
      errorInfo,
      severity: 'critical',
      userId: this.props.userId
    })
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

// 5. Performance Monitoring Hook
const usePerformanceLogging = (componentName) => {
  const activityLogger = useActivityLogger()

  useEffect(() => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime

      activityLogger.logPerformance('component_render_time', {
        value: Math.round(renderTime),
        component: componentName,
        unit: 'ms'
      })
    }
  }, [componentName])

  const logCustomPerformance = (metric, value, unit = 'ms') => {
    activityLogger.logPerformance(metric, {
      value,
      unit,
      component: componentName
    })
  }

  return { logCustomPerformance }
}

// 6. Search Component with Logging
const SearchComponent = () => {
  const activityLogger = useActivityLogger()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [results, setResults] = useState([])

  const handleSearch = (query) => {
    setSearchQuery(query)
    
    // Simulate search
    const mockResults = performSearch(query, filters)
    setResults(mockResults)

    activityLogger.logSearch(query, {
      resultsCount: mockResults.length,
      filters,
      responseTime: 150, // Mock response time
      hasResults: mockResults.length > 0
    })
  }

  const handleFilterChange = (filterType, filterValue) => {
    const newFilters = { ...filters, [filterType]: filterValue }
    setFilters(newFilters)

    const mockResults = performSearch(searchQuery, newFilters)
    setResults(mockResults)

    activityLogger.logFilterUsed(filterType, filterValue, {
      resultsCount: mockResults.length,
      activeFilters: newFilters,
      searchQuery
    })
  }

  const performSearch = (query, currentFilters) => {
    // Mock search logic
    return []
  }

  return (
    <div className="search-component">
      {/* Search UI */}
    </div>
  )
}

// 7. Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const activityLogger = useActivityLogger()
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    const sessionAnalytics = activityLogger.getSessionAnalytics()
    setAnalytics(sessionAnalytics)
  }, [])

  const exportUserData = () => {
    const userData = activityLogger.exportUserData()
    
    // Create downloadable file
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `user-activity-${userData.userId}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    
    activityLogger.log('DATA_EXPORTED', {
      exportType: 'user_activity',
      recordCount: userData.totalActions
    })
  }

  if (!analytics) return <div>Loading analytics...</div>

  return (
    <div className="analytics-dashboard">
      <h2>Session Analytics</h2>
      <div className="analytics-grid">
        <div className="metric">
          <h3>Session Duration</h3>
          <p>{Math.round(analytics.sessionDuration / 60000)} minutes</p>
        </div>
        <div className="metric">
          <h3>Pages Visited</h3>
          <p>{analytics.pagesVisited}</p>
        </div>
        <div className="metric">
          <h3>Interactions</h3>
          <p>{analytics.interactionsCount}</p>
        </div>
        <div className="metric">
          <h3>Engagement Score</h3>
          <p>{analytics.userEngagement}/100</p>
        </div>
        <div className="metric">
          <h3>Conversion Step</h3>
          <p>{analytics.conversionStep}</p>
        </div>
      </div>
      <button onClick={exportUserData}>
        Export User Data
      </button>
    </div>
  )
}

// 8. Admin logging cleanup utility
const AdminLogManager = () => {
  const activityLogger = useActivityLogger()
  const [logStats, setLogStats] = useState(null)

  const cleanupOldLogs = () => {
    const result = activityLogger.cleanupOldLogs(30) // Keep 30 days
    setLogStats(result)
    alert(`Cleaned up ${result.logsRemoved} old logs. ${result.logsRemaining} logs remaining.`)
  }

  return (
    <div className="admin-log-manager">
      <h3>Log Management</h3>
      <button onClick={cleanupOldLogs}>
        Cleanup Old Logs (30+ days)
      </button>
      {logStats && (
        <div className="log-stats">
          <p>Total logs processed: {logStats.totalLogs}</p>
          <p>Logs removed: {logStats.logsRemoved}</p>
          <p>Logs remaining: {logStats.logsRemaining}</p>
        </div>
      )}
    </div>
  )
}

export {
  TemplateSelector,
  ProjectForm,
  RegistrationForm,
  ErrorBoundaryWithLogging,
  usePerformanceLogging,
  SearchComponent,
  AnalyticsDashboard,
  AdminLogManager
}
