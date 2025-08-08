// ActivityLogger.js - Comprehensive logging system for all user activities

export class ActivityLogger {
  constructor() {
    this.sessionId = this.initializeSession()
    this.startTime = new Date().toISOString()
    this.pageViews = []
    this.interactions = []
  }

  // Initialize or get existing session
  initializeSession() {
    let sessionId = sessionStorage.getItem('hrx_session_id')
    if (!sessionId) {
      sessionId = this.generateId()
      sessionStorage.setItem('hrx_session_id', sessionId)
      sessionStorage.setItem('hrx_session_start', new Date().toISOString())
      
      this.log('SESSION_STARTED', {
        sessionId,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct'
      })
    }
    return sessionId
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  // Core logging method
  log(action, data = {}) {
    const timestamp = new Date().toISOString()
    const userId = this.getCurrentUserId()
    
    const logEntry = {
      id: this.generateId(),
      timestamp,
      sessionId: this.sessionId,
      userId,
      action,
      data: {
        ...data,
        url: window.location.href,
        path: window.location.pathname,
        userAgent: navigator.userAgent
      }
    }

    // Store locally (in production, send to backend)
    this.storeLog(logEntry)
    
    // Also track in memory for session analytics
    this.addToSessionTracking(logEntry)
    
    console.log('🔍 Activity Logged:', logEntry)
    return logEntry
  }

  storeLog(logEntry) {
    try {
      const logs = JSON.parse(localStorage.getItem('hrx_activity_logs') || '[]')
      logs.push(logEntry)
      
      // Keep only last 1000 entries to prevent storage overflow
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000)
      }
      
      localStorage.setItem('hrx_activity_logs', JSON.stringify(logs))
    } catch (error) {
      console.error('Failed to store activity log:', error)
    }
  }

  addToSessionTracking(logEntry) {
    if (logEntry.action.includes('PAGE_')) {
      this.pageViews.push(logEntry)
    } else {
      this.interactions.push(logEntry)
    }
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('hrx_current_user') || '{}')
    return user.id || 'anonymous'
  }

  // Specific logging methods for different activities

  // Authentication & Registration
  logRegistrationStart(data = {}) {
    return this.log('REGISTRATION_STARTED', {
      registrationType: data.type || 'standard',
      referralCode: data.referralCode || null,
      ...data
    })
  }

  logRegistrationStep(step, data = {}) {
    return this.log('REGISTRATION_STEP', {
      step,
      stepNumber: data.stepNumber || 0,
      fieldsCompleted: data.fieldsCompleted || [],
      errors: data.errors || [],
      timeSpent: data.timeSpent || 0,
      ...data
    })
  }

  logRegistrationCompleted(data = {}) {
    return this.log('REGISTRATION_COMPLETED', {
      userId: data.userId,
      userType: data.userType,
      registrationDuration: data.duration,
      completedFields: data.completedFields || [],
      skippedFields: data.skippedFields || [],
      ...data
    })
  }

  logLogin(data = {}) {
    return this.log('LOGIN', {
      loginMethod: data.method || 'email',
      success: data.success !== false,
      attempts: data.attempts || 1,
      ...data
    })
  }

  logLogout(data = {}) {
    const sessionDuration = Date.now() - new Date(sessionStorage.getItem('hrx_session_start')).getTime()
    return this.log('LOGOUT', {
      sessionDuration: Math.round(sessionDuration / 1000), // in seconds
      pagesVisited: this.pageViews.length,
      interactionsCount: this.interactions.length,
      ...data
    })
  }

  // Template & Project Activities
  logTemplateViewed(templateId, data = {}) {
    return this.log('TEMPLATE_VIEWED', {
      templateId,
      templateName: data.templateName,
      category: data.category,
      timeSpent: data.timeSpent || 0,
      ...data
    })
  }

  logTemplateSelected(templateId, data = {}) {
    return this.log('TEMPLATE_SELECTED', {
      templateId,
      templateName: data.templateName,
      category: data.category,
      selectionReason: data.reason || null,
      ...data
    })
  }

  logFormFieldInteraction(fieldId, action, data = {}) {
    return this.log('FORM_FIELD_INTERACTION', {
      fieldId,
      action, // 'focus', 'blur', 'change', 'error'
      fieldType: data.fieldType,
      value: data.sensitive ? '[REDACTED]' : data.value,
      validationError: data.error || null,
      timeSpent: data.timeSpent || 0,
      ...data
    })
  }

  logFormProgress(formId, data = {}) {
    return this.log('FORM_PROGRESS', {
      formId,
      completionPercentage: data.completion || 0,
      fieldsCompleted: data.fieldsCompleted || 0,
      totalFields: data.totalFields || 0,
      currentStep: data.currentStep || 1,
      errors: data.errors || [],
      timeSpent: data.timeSpent || 0,
      ...data
    })
  }

  logImageUpload(data = {}) {
    return this.log('IMAGE_UPLOAD', {
      fileCount: data.fileCount || 1,
      totalSize: data.totalSize || 0,
      fileTypes: data.fileTypes || [],
      uploadDuration: data.duration || 0,
      success: data.success !== false,
      errors: data.errors || [],
      ...data
    })
  }

  logEstimateGenerated(data = {}) {
    return this.log('ESTIMATE_GENERATED', {
      projectId: data.projectId,
      templateId: data.templateId,
      estimatedCost: data.estimatedCost,
      laborHours: data.laborHours,
      materialCost: data.materialCost,
      complexity: data.complexity,
      generationTime: data.generationTime || 0,
      ...data
    })
  }

  // Contractor Activities
  logContractorViewed(contractorId, data = {}) {
    return this.log('CONTRACTOR_VIEWED', {
      contractorId,
      contractorName: data.contractorName,
      hourlyRate: data.hourlyRate,
      rating: data.rating,
      specialties: data.specialties || [],
      ...data
    })
  }

  logContractorSelected(contractorId, data = {}) {
    return this.log('CONTRACTOR_SELECTED', {
      contractorId,
      contractorName: data.contractorName,
      hourlyRate: data.hourlyRate,
      estimatedCost: data.estimatedCost,
      selectionReason: data.reason || null,
      alternativesViewed: data.alternativesViewed || 0,
      ...data
    })
  }

  logQuoteRequested(data = {}) {
    return this.log('QUOTE_REQUESTED', {
      projectId: data.projectId,
      contractorIds: data.contractorIds || [],
      contractorCount: data.contractorIds?.length || 0,
      baseEstimate: data.baseEstimate,
      specialRequirements: data.specialRequirements || [],
      ...data
    })
  }

  logQuoteReceived(data = {}) {
    return this.log('QUOTE_RECEIVED', {
      projectId: data.projectId,
      contractorId: data.contractorId,
      quotedAmount: data.quotedAmount,
      originalEstimate: data.originalEstimate,
      variance: data.variance || 0,
      responseTime: data.responseTime || 0,
      message: data.message || null,
      ...data
    })
  }

  logContractorFinalized(data = {}) {
    return this.log('CONTRACTOR_FINALIZED', {
      projectId: data.projectId,
      contractorId: data.contractorId,
      finalAmount: data.finalAmount,
      decisionFactors: data.decisionFactors || [],
      quotesConsidered: data.quotesConsidered || 0,
      decisionTime: data.decisionTime || 0,
      ...data
    })
  }

  // Page Navigation & User Journey
  logPageView(page, data = {}) {
    const now = Date.now()
    const previousPageView = this.pageViews[this.pageViews.length - 1]
    const timeOnPreviousPage = previousPageView 
      ? now - new Date(previousPageView.timestamp).getTime()
      : 0

    return this.log('PAGE_VIEW', {
      page,
      previousPage: previousPageView?.data?.page || null,
      timeOnPreviousPage: Math.round(timeOnPreviousPage / 1000),
      loadTime: data.loadTime || 0,
      ...data
    })
  }

  logUserJourney() {
    return {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - new Date(sessionStorage.getItem('hrx_session_start')).getTime(),
      pagesVisited: this.pageViews.map(pv => ({
        page: pv.data.page,
        timestamp: pv.timestamp,
        timeSpent: pv.data.timeOnPreviousPage || 0
      })),
      totalInteractions: this.interactions.length,
      interactionTypes: [...new Set(this.interactions.map(i => i.action))],
      conversionFunnel: this.getConversionFunnelData(),
      dropOffPoints: this.getDropOffPoints()
    }
  }

  // Conversion funnel tracking
  getConversionFunnelData() {
    const funnelSteps = [
      'PAGE_VIEW',
      'TEMPLATE_VIEWED',
      'TEMPLATE_SELECTED', 
      'FORM_PROGRESS',
      'ESTIMATE_GENERATED',
      'CONTRACTOR_VIEWED',
      'QUOTE_REQUESTED',
      'CONTRACTOR_FINALIZED'
    ]

    const completedSteps = funnelSteps.map(step => ({
      step,
      completed: this.interactions.some(i => i.action === step) || this.pageViews.some(p => p.action === step),
      timestamp: this.interactions.find(i => i.action === step)?.timestamp || 
                 this.pageViews.find(p => p.action === step)?.timestamp || null
    }))

    return completedSteps
  }

  getDropOffPoints() {
    const criticalActions = [
      'REGISTRATION_STARTED',
      'TEMPLATE_SELECTED',
      'FORM_PROGRESS',
      'ESTIMATE_GENERATED',
      'QUOTE_REQUESTED'
    ]

    return criticalActions.map(action => {
      const started = this.interactions.filter(i => i.action === action).length > 0
      const nextAction = this.getNextExpectedAction(action)
      const completed = nextAction ? this.interactions.filter(i => i.action === nextAction).length > 0 : true

      return {
        action,
        started,
        completed,
        dropOff: started && !completed
      }
    })
  }

  getNextExpectedAction(action) {
    const flow = {
      'REGISTRATION_STARTED': 'REGISTRATION_COMPLETED',
      'TEMPLATE_SELECTED': 'FORM_PROGRESS',
      'FORM_PROGRESS': 'ESTIMATE_GENERATED',
      'ESTIMATE_GENERATED': 'CONTRACTOR_VIEWED',
      'QUOTE_REQUESTED': 'CONTRACTOR_FINALIZED'
    }
    return flow[action] || null
  }

  // Error & Performance Tracking
  logError(error, data = {}) {
    return this.log('ERROR', {
      errorType: error.name || 'Unknown',
      errorMessage: error.message || 'No message',
      errorStack: error.stack || null,
      component: data.component || 'Unknown',
      action: data.action || 'Unknown',
      severity: data.severity || 'error',
      userId: this.getCurrentUserId(),
      ...data
    })
  }

  logPerformance(metric, data = {}) {
    return this.log('PERFORMANCE', {
      metric,
      value: data.value,
      unit: data.unit || 'ms',
      page: data.page || window.location.pathname,
      ...data
    })
  }

  // Search & Filter Activities
  logSearch(query, data = {}) {
    return this.log('SEARCH', {
      query: query.toLowerCase(),
      resultsCount: data.resultsCount || 0,
      filters: data.filters || {},
      sortBy: data.sortBy || null,
      page: data.page || 1,
      ...data
    })
  }

  logFilterUsed(filterType, filterValue, data = {}) {
    return this.log('FILTER_USED', {
      filterType,
      filterValue,
      resultsCount: data.resultsCount || 0,
      otherActiveFilters: data.activeFilters || {},
      ...data
    })
  }

  // Business Intelligence Methods
  getSessionAnalytics() {
    const logs = this.getAllLogs()
    const sessionLogs = logs.filter(log => log.sessionId === this.sessionId)
    
    return {
      sessionId: this.sessionId,
      totalActions: sessionLogs.length,
      uniqueActions: [...new Set(sessionLogs.map(log => log.action))].length,
      sessionDuration: Date.now() - new Date(sessionStorage.getItem('hrx_session_start')).getTime(),
      pagesVisited: this.pageViews.length,
      interactionsCount: this.interactions.length,
      errorCount: sessionLogs.filter(log => log.action === 'ERROR').length,
      conversionStep: this.getCurrentConversionStep(),
      userEngagement: this.calculateEngagementScore()
    }
  }

  getCurrentConversionStep() {
    const steps = [
      'PAGE_VIEW',
      'TEMPLATE_VIEWED',
      'TEMPLATE_SELECTED',
      'FORM_PROGRESS', 
      'ESTIMATE_GENERATED',
      'CONTRACTOR_VIEWED',
      'QUOTE_REQUESTED',
      'CONTRACTOR_FINALIZED'
    ]

    let currentStep = 'VISITOR'
    for (let i = steps.length - 1; i >= 0; i--) {
      if (this.interactions.some(action => action.action === steps[i]) || 
          this.pageViews.some(page => page.action === steps[i])) {
        currentStep = steps[i]
        break
      }
    }
    
    return currentStep
  }

  calculateEngagementScore() {
    const sessionDuration = Date.now() - new Date(sessionStorage.getItem('hrx_session_start')).getTime()
    const durationMinutes = sessionDuration / (1000 * 60)
    const pagesPerMinute = this.pageViews.length / Math.max(durationMinutes, 1)
    const interactionsPerMinute = this.interactions.length / Math.max(durationMinutes, 1)
    
    // Simple engagement scoring algorithm
    let score = 0
    if (durationMinutes > 1) score += 20
    if (durationMinutes > 5) score += 20
    if (this.pageViews.length > 3) score += 20
    if (this.interactions.length > 10) score += 20
    if (pagesPerMinute < 3 && pagesPerMinute > 0.5) score += 10 // Not too fast, not too slow
    if (interactionsPerMinute > 2) score += 10

    return Math.min(score, 100)
  }

  getAllLogs() {
    try {
      return JSON.parse(localStorage.getItem('hrx_activity_logs') || '[]')
    } catch (error) {
      console.error('Failed to retrieve activity logs:', error)
      return []
    }
  }

  // Data Export & Analytics
  exportUserData(userId = null) {
    const targetUserId = userId || this.getCurrentUserId()
    const allLogs = this.getAllLogs()
    const userLogs = allLogs.filter(log => log.userId === targetUserId)
    
    return {
      userId: targetUserId,
      totalSessions: [...new Set(userLogs.map(log => log.sessionId))].length,
      totalActions: userLogs.length,
      dateRange: {
        first: userLogs.length > 0 ? userLogs[0].timestamp : null,
        last: userLogs.length > 0 ? userLogs[userLogs.length - 1].timestamp : null
      },
      actionBreakdown: this.getActionBreakdown(userLogs),
      conversionFunnel: this.getUserConversionFunnel(userLogs),
      timeSpentByPage: this.getTimeSpentByPage(userLogs),
      logs: userLogs
    }
  }

  getActionBreakdown(logs) {
    const breakdown = {}
    logs.forEach(log => {
      breakdown[log.action] = (breakdown[log.action] || 0) + 1
    })
    return breakdown
  }

  getUserConversionFunnel(logs) {
    const funnelSteps = [
      'REGISTRATION_STARTED',
      'REGISTRATION_COMPLETED',
      'TEMPLATE_VIEWED',
      'TEMPLATE_SELECTED',
      'ESTIMATE_GENERATED',
      'CONTRACTOR_VIEWED',
      'QUOTE_REQUESTED',
      'CONTRACTOR_FINALIZED'
    ]

    return funnelSteps.map(step => ({
      step,
      count: logs.filter(log => log.action === step).length,
      firstOccurrence: logs.find(log => log.action === step)?.timestamp || null,
      lastOccurrence: logs.filter(log => log.action === step).pop()?.timestamp || null
    }))
  }

  getTimeSpentByPage(logs) {
    const pageViews = logs.filter(log => log.action === 'PAGE_VIEW')
    const timeByPage = {}
    
    pageViews.forEach(pageView => {
      const page = pageView.data.page
      const timeSpent = pageView.data.timeOnPreviousPage || 0
      timeByPage[page] = (timeByPage[page] || 0) + timeSpent
    })
    
    return timeByPage
  }

  // Clean up old logs (call periodically)
  cleanupOldLogs(daysToKeep = 30) {
    try {
      const allLogs = this.getAllLogs()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
      
      const recentLogs = allLogs.filter(log => 
        new Date(log.timestamp) > cutoffDate
      )
      
      localStorage.setItem('hrx_activity_logs', JSON.stringify(recentLogs))
      
      return {
        totalLogs: allLogs.length,
        logsRemoved: allLogs.length - recentLogs.length,
        logsRemaining: recentLogs.length
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error)
      return null
    }
  }
}

// Singleton instance
export const activityLogger = new ActivityLogger()

// React Hook for easy integration
export const useActivityLogger = () => {
  return activityLogger
}

// HOC for automatic page view tracking
export const withActivityTracking = (WrappedComponent) => {
  return function ActivityTrackedComponent(props) {
    const React = window.React || require('react')
    
    React.useEffect(() => {
      const pageName = WrappedComponent.displayName || WrappedComponent.name || 'UnknownPage'
      activityLogger.logPageView(pageName, {
        props: Object.keys(props),
        loadTime: performance.now()
      })
    }, [])

    return React.createElement(WrappedComponent, props)
  }
}

// Utility functions for common logging scenarios
export const logRegistrationFunnel = {
  start: (type = 'standard', data = {}) => 
    activityLogger.logRegistrationStart({ type, ...data }),
  
  step: (stepName, stepNumber, data = {}) => 
    activityLogger.logRegistrationStep(stepName, { stepNumber, ...data }),
  
  complete: (userId, userType, duration, data = {}) => 
    activityLogger.logRegistrationCompleted({ userId, userType, duration, ...data }),
  
  abandon: (step, reason, data = {}) => 
    activityLogger.log('REGISTRATION_ABANDONED', { step, reason, ...data })
}

export const logProjectFunnel = {
  templateView: (templateId, data = {}) => 
    activityLogger.logTemplateViewed(templateId, data),
  
  templateSelect: (templateId, data = {}) => 
    activityLogger.logTemplateSelected(templateId, data),
  
  formProgress: (completion, data = {}) => 
    activityLogger.logFormProgress('project-form', { completion, ...data }),
  
  estimate: (projectData, data = {}) => 
    activityLogger.logEstimateGenerated({ ...projectData, ...data }),
  
  contractorView: (contractorId, data = {}) => 
    activityLogger.logContractorViewed(contractorId, data),
  
  quoteRequest: (contractorIds, projectId, data = {}) => 
    activityLogger.logQuoteRequested({ contractorIds, projectId, ...data }),
  
  contractorSelect: (contractorId, projectId, data = {}) => 
    activityLogger.logContractorFinalized({ contractorId, projectId, ...data })
}

// Error boundary integration
export const logErrorBoundary = (error, errorInfo, componentStack) => {
  activityLogger.logError(error, {
    component: 'ErrorBoundary',
    componentStack,
    errorInfo,
    severity: 'critical'
  })
}

export default ActivityLogger
