// Enhanced templates.js with labor hours, dynamic pricing, and logging

// Activity logging utility
export const logActivity = (action, data) => {
  const timestamp = new Date().toISOString()
  const userId = data.userId || 'anonymous'
  
  const logEntry = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp,
    userId,
    action,
    data,
    sessionId: sessionStorage.getItem('sessionId') || 'unknown'
  }
  
  // Store in localStorage (in production, send to backend)
  const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]')
  logs.push(logEntry)
  localStorage.setItem('activityLogs', JSON.stringify(logs))
  
  console.log('Activity Logged:', logEntry)
  return logEntry
}

// Initialize session
export const initializeSession = () => {
  if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', Math.random().toString(36).substr(2, 9))
  }
}

export const templates = {
  'deck-refresh': {
    id: 'deck-refresh',
    title: 'Deck Refresh',
    description: 'Revitalize your existing deck with new stain, repairs, and upgrades',
    category: 'exterior',
    estimatedTime: '1-2 days',
    complexity: 'medium',
    icon: '🏠',
    laborHours: {
      base: 8, // Base hours for standard deck
      perSqFt: 0.15, // Additional hours per sq ft
      conditions: {
        excellent: 1.0, // multiplier
        good: 1.2,
        fair: 1.5,
        poor: 2.0
      }
    },
    fields: [
      {
        id: 'deckLength',
        label: 'Deck Length',
        type: 'number',
        unit: 'feet',
        required: true,
        min: 8,
        max: 50,
        step: 1,
        placeholder: '20'
      },
      {
        id: 'deckWidth',
        label: 'Deck Width',
        type: 'number',
        unit: 'feet',
        required: true,
        min: 6,
        max: 30,
        step: 1,
        placeholder: '12'
      },
      {
        id: 'deckCondition',
        label: 'Current Deck Condition',
        type: 'select',
        required: true,
        options: [
          { value: 'excellent', label: 'Excellent - Just needs cleaning/staining' },
          { value: 'good', label: 'Good - Minor repairs needed' },
          { value: 'fair', label: 'Fair - Several boards need replacement' },
          { value: 'poor', label: 'Poor - Major structural repairs needed' }
        ]
      },
      {
        id: 'stainType',
        label: 'Stain/Finish Type',
        type: 'select',
        required: true,
        options: [
          { value: 'transparent', label: 'Transparent Stain' },
          { value: 'semi-transparent', label: 'Semi-Transparent Stain' },
          { value: 'solid', label: 'Solid Stain' },
          { value: 'paint', label: 'Exterior Paint' }
        ]
      },
      {
        id: 'railingRefresh',
        label: 'Include Railing Refresh',
        type: 'checkbox',
        required: false
      },
      {
        id: 'railingLength',
        label: 'Total Railing Length',
        type: 'number',
        unit: 'linear feet',
        required: false,
        min: 0,
        max: 200,
        step: 1,
        placeholder: '40',
        dependsOn: 'railingRefresh'
      },
      {
        id: 'pressureWashing',
        label: 'Include Pressure Washing',
        type: 'checkbox',
        required: false
      },
      {
        id: 'images',
        label: 'Upload Photos',
        type: 'file',
        accept: 'image/*',
        multiple: true,
        required: false,
        maxFiles: 5
      },
      {
        id: 'notes',
        label: 'Additional Notes',
        type: 'textarea',
        placeholder: 'Any specific requirements or concerns...',
        required: false
      }
    ],
    materials: {
      stain: {
        transparent: { pricePerSqFt: 3, description: 'Transparent wood stain' },
        'semi-transparent': { pricePerSqFt: 4, description: 'Semi-transparent wood stain' },
        solid: { pricePerSqFt: 5, description: 'Solid color wood stain' },
        paint: { pricePerSqFt: 6, description: 'Exterior deck paint' }
      },
      supplies: {
        brushes: { price: 45, description: 'Professional brushes and rollers' },
        sandpaper: { pricePerSqFt: 0.5, description: 'Sandpaper and prep materials' },
        cleaner: { price: 25, description: 'Deck cleaner and prep solution' }
      }
    },
    additionalServices: {
      railingRefresh: { laborHours: 1, materialCostPerFt: 3 },
      pressureWashing: { laborHours: 2, materialCost: 50 }
    }
  },

  'firepit': {
    id: 'firepit',
    title: 'Outdoor Firepit',
    description: 'Build a cozy firepit area with seating and basic landscaping',
    category: 'exterior',
    estimatedTime: '2-3 days',
    complexity: 'medium',
    icon: '🔥',
    laborHours: {
      base: 16, // Base hours for firepit installation
      seatingPrep: 2, // Hours per 10 sq ft of seating area
      landscaping: 4,
      lighting: 3
    },
    fields: [
      {
        id: 'firepitType',
        label: 'Firepit Type',
        type: 'select',
        required: true,
        options: [
          { value: 'stone-ring', label: 'Natural Stone Ring' },
          { value: 'brick-circle', label: 'Brick Circle' },
          { value: 'metal-insert', label: 'Metal Insert with Stone Surround' },
          { value: 'custom-built', label: 'Custom Built-in' }
        ]
      },
      {
        id: 'firepitSize',
        label: 'Firepit Diameter',
        type: 'select',
        required: true,
        options: [
          { value: '3ft', label: '3 feet - Intimate (4-6 people)' },
          { value: '4ft', label: '4 feet - Standard (6-8 people)' },
          { value: '5ft', label: '5 feet - Large (8-10 people)' },
          { value: '6ft', label: '6+ feet - Extra Large (10+ people)' }
        ]
      },
      {
        id: 'seatingArea',
        label: 'Seating Area Size',
        type: 'number',
        unit: 'diameter in feet',
        required: true,
        min: 8,
        max: 20,
        step: 1,
        placeholder: '12'
      },
      {
        id: 'seatingType',
        label: 'Seating Type',
        type: 'select',
        required: true,
        options: [
          { value: 'gravel-pad', label: 'Gravel Pad (bring your own chairs)' },
          { value: 'stone-benches', label: 'Built-in Stone Benches' },
          { value: 'log-benches', label: 'Natural Log Benches' },
          { value: 'paver-patio', label: 'Paver Patio Base' }
        ]
      },
      {
        id: 'landscaping',
        label: 'Basic Landscaping',
        type: 'checkbox',
        required: false,
        description: 'Includes decorative plants around the firepit area'
      },
      {
        id: 'lighting',
        label: 'Add Pathway Lighting',
        type: 'checkbox',
        required: false,
        description: 'Solar or low-voltage LED pathway lights'
      },
      {
        id: 'fuelType',
        label: 'Fuel Type',
        type: 'select',
        required: true,
        options: [
          { value: 'wood', label: 'Wood Burning (traditional)' },
          { value: 'gas', label: 'Natural Gas (requires gas line)' },
          { value: 'propane', label: 'Propane (portable tank)' }
        ]
      },
      {
        id: 'images',
        label: 'Upload Inspiration Photos',
        type: 'file',
        accept: 'image/*',
        multiple: true,
        required: false,
        maxFiles: 5
      },
      {
        id: 'location',
        label: 'Preferred Location in Yard',
        type: 'textarea',
        placeholder: 'Describe where you want the firepit...',
        required: false
      }
    ],
    materials: {
      firepit: {
        'stone-ring': { price: 800, description: 'Natural stone firepit ring' },
        'brick-circle': { price: 600, description: 'Brick circular firepit' },
        'metal-insert': { price: 1000, description: 'Metal insert with stone surround' },
        'custom-built': { price: 1500, description: 'Custom built-in firepit' }
      },
      seating: {
        'gravel-pad': { price: 150, description: 'Gravel and landscape fabric' },
        'stone-benches': { price: 400, description: 'Natural stone benches' },
        'log-benches': { price: 300, description: 'Natural log benches' },
        'paver-patio': { price: 600, description: 'Paver patio materials' }
      },
      addons: {
        landscaping: { price: 300, description: 'Plants and landscaping materials' },
        lighting: { price: 250, description: 'Pathway lighting kit' },
        gas: { price: 400, description: 'Gas line installation materials' },
        propane: { price: 200, description: 'Propane setup kit' }
      }
    }
  },

  // Add other templates following the same pattern...
  'lawn-mowing': {
    id: 'lawn-mowing',
    title: 'Lawn Mowing Service',
    description: 'Professional lawn care with customizable scheduling',
    category: 'maintenance',
    estimatedTime: '2-4 hours',
    complexity: 'low',
    icon: '🌱',
    laborHours: {
      base: 0, // Calculated based on area
      perSqFt: 0.002, // 0.002 hours per sq ft (500 sq ft = 1 hour)
      grassHeightMultiplier: {
        short: 1.0,
        medium: 1.3,
        tall: 1.6
      },
      terrainMultiplier: {
        flat: 1.0,
        'slight-slope': 1.2,
        steep: 1.5
      },
      obstacles: {
        trees: 0.5, // additional hours
        'flower-beds': 0.75,
        fence: 1.0,
        decorations: 0.25
      }
    },
    fields: [
      {
        id: 'lawnLength',
        label: 'Lawn Length',
        type: 'number',
        unit: 'feet',
        required: true,
        min: 10,
        max: 500,
        step: 1,
        placeholder: '50'
      },
      {
        id: 'lawnWidth',
        label: 'Lawn Width',
        type: 'number',
        unit: 'feet',
        required: true,
        min: 10,
        max: 500,
        step: 1,
        placeholder: '30'
      },
      // ... rest of the fields
    ],
    materials: {
      fuel: { price: 15, description: 'Fuel and equipment costs' },
      disposal: { pricePerService: 20, description: 'Grass clipping disposal' }
    }
  }
}

// Enhanced cost calculation with detailed breakdown
export const calculateProjectEstimate = (templateId, formData, userId) => {
  // Log the estimation activity
  logActivity('ESTIMATE_CALCULATED', {
    templateId,
    formData: { ...formData, images: formData.images?.length || 0 }, // Don't log actual images
    userId
  })

  const template = templates[templateId]
  if (!template) return null

  let materials = []
  let transportation = 50 // Base transportation cost
  let disposal = 0
  let totalLaborHours = 0
  let estimatedMaterialCost = 0

  switch (templateId) {
    case 'deck-refresh':
      const deckArea = parseFloat(formData.deckLength || 0) * parseFloat(formData.deckWidth || 0)
      
      // Calculate labor hours
      totalLaborHours = template.laborHours.base + 
        (deckArea * template.laborHours.perSqFt * 
         template.laborHours.conditions[formData.deckCondition])

      // Materials
      const stainInfo = template.materials.stain[formData.stainType]
      const stainCost = deckArea * stainInfo.pricePerSqFt
      materials.push({
        item: stainInfo.description,
        quantity: `${deckArea.toFixed(0)} sq ft`,
        unitPrice: stainInfo.pricePerSqFt,
        totalPrice: stainCost
      })

      const sandpaperCost = deckArea * template.materials.supplies.sandpaper.pricePerSqFt
      materials.push({
        item: template.materials.supplies.sandpaper.description,
        quantity: `${deckArea.toFixed(0)} sq ft`,
        unitPrice: template.materials.supplies.sandpaper.pricePerSqFt,
        totalPrice: sandpaperCost
      })

      materials.push({
        item: template.materials.supplies.brushes.description,
        quantity: '1 set',
        unitPrice: template.materials.supplies.brushes.price,
        totalPrice: template.materials.supplies.brushes.price
      })

      materials.push({
        item: template.materials.supplies.cleaner.description,
        quantity: '1',
        unitPrice: template.materials.supplies.cleaner.price,
        totalPrice: template.materials.supplies.cleaner.price
      })

      estimatedMaterialCost = materials.reduce((sum, item) => sum + item.totalPrice, 0)

      // Additional services
      if (formData.railingRefresh && formData.railingLength) {
        const railingCost = parseFloat(formData.railingLength) * template.additionalServices.railingRefresh.materialCostPerFt
        totalLaborHours += template.additionalServices.railingRefresh.laborHours
        materials.push({
          item: 'Railing refresh materials',
          quantity: `${formData.railingLength} ft`,
          unitPrice: template.additionalServices.railingRefresh.materialCostPerFt,
          totalPrice: railingCost
        })
        estimatedMaterialCost += railingCost
      }

      if (formData.pressureWashing) {
        totalLaborHours += template.additionalServices.pressureWashing.laborHours
        materials.push({
          item: 'Pressure washing supplies',
          quantity: '1',
          unitPrice: template.additionalServices.pressureWashing.materialCost,
          totalPrice: template.additionalServices.pressureWashing.materialCost
        })
        estimatedMaterialCost += template.additionalServices.pressureWashing.materialCost
      }

      disposal = 75 // Deck project disposal cost
      break

    case 'firepit':
      const seatingAreaSqFt = Math.PI * Math.pow(parseFloat(formData.seatingArea || 0) / 2, 2)
      
      // Calculate labor hours
      totalLaborHours = template.laborHours.base + 
        (seatingAreaSqFt / 10 * template.laborHours.seatingPrep)

      // Firepit materials
      const firepitInfo = template.materials.firepit[formData.firepitType]
      materials.push({
        item: firepitInfo.description,
        quantity: '1',
        unitPrice: firepitInfo.price,
        totalPrice: firepitInfo.price
      })

      // Seating materials
      const seatingInfo = template.materials.seating[formData.seatingType]
      materials.push({
        item: seatingInfo.description,
        quantity: '1',
        unitPrice: seatingInfo.price,
        totalPrice: seatingInfo.price
      })

      estimatedMaterialCost = firepitInfo.price + seatingInfo.price

      // Add-ons
      if (formData.landscaping) {
        totalLaborHours += template.laborHours.landscaping
        const landscapingCost = template.materials.addons.landscaping.price
        materials.push({
          item: template.materials.addons.landscaping.description,
          quantity: '1',
          unitPrice: landscapingCost,
          totalPrice: landscapingCost
        })
        estimatedMaterialCost += landscapingCost
      }

      if (formData.lighting) {
        totalLaborHours += template.laborHours.lighting
        const lightingCost = template.materials.addons.lighting.price
        materials.push({
          item: template.materials.addons.lighting.description,
          quantity: '1',
          unitPrice: lightingCost,
          totalPrice: lightingCost
        })
        estimatedMaterialCost += lightingCost
      }

      // Fuel type additions
      if (formData.fuelType === 'gas') {
        totalLaborHours += 4 // Gas line installation
        const gasCost = template.materials.addons.gas.price
        materials.push({
          item: template.materials.addons.gas.description,
          quantity: '1',
          unitPrice: gasCost,
          totalPrice: gasCost
        })
        estimatedMaterialCost += gasCost
      } else if (formData.fuelType === 'propane') {
        const propaneCost = template.materials.addons.propane.price
        materials.push({
          item: template.materials.addons.propane.description,
          quantity: '1',
          unitPrice: propaneCost,
          totalPrice: propaneCost
        })
        estimatedMaterialCost += propaneCost
      }

      disposal = 150 // Firepit project disposal cost
      transportation = 75 // Higher transport cost for heavy materials
      break

    // Add other template calculations...
  }

    // --- after switch block ends (inside calculateProjectEstimate) ---

  // Ensure numeric values
  estimatedMaterialCost = Math.round(estimatedMaterialCost || 0)
  transportation = Math.round(transportation || 0)
  disposal = Math.round(disposal || 0)
  totalLaborHours = Math.round((totalLaborHours || 0) * 10) / 10

  // Prepare a breakdown object (currency values are in USD)
  const breakdown = {
    materialCost: estimatedMaterialCost,
    transportation,
    disposal,
    // laborHours is shown separately (not converted to money because contractor rate varies)
    laborHours: totalLaborHours
  }

  // Subtotal excludes platform fee & tax; labor cost not included because it needs a contractor rate
  const subtotal = estimatedMaterialCost + transportation + disposal

  // Create a "total" field to satisfy UI expectations (pre-labor)
  const total = Math.round(subtotal)

  return {
    templateId,
    materials,
    laborHours: totalLaborHours, // hours (number)
    transportation,
    disposal,
    materialCost: estimatedMaterialCost,
    complexity: template.complexity,
    estimatedTime: template.estimatedTime,
    // New fields expected by frontend:
    breakdown,
    total
  }

}

// Calculate platform fee with cap
export const calculatePlatformFee = (subtotal) => {
  const feeRate = 0.10 // 10%
  const maxFee = 399 // $399 cap for projects up to $30k
  const feeThreshold = 30000 // $30k threshold

  if (subtotal > feeThreshold) {
    // Special pricing above $30k - would need backend logic
    return Math.round(subtotal * 0.05) // 5% for larger projects
  }

  const calculatedFee = subtotal * feeRate
  return Math.min(calculatedFee, maxFee)
}

// Calculate total project cost with contractor's hourly rate
export const calculateProjectTotal = (estimate, contractorHourlyRate) => {
  const laborCost = estimate.laborHours * contractorHourlyRate
  const subtotal = estimate.materialCost + laborCost + estimate.transportation + estimate.disposal
  const platformFee = calculatePlatformFee(subtotal)
  const gst = (subtotal + platformFee) * 0.05 // 5% GST
  const total = subtotal + platformFee + gst

  return {
    materialCost: estimate.materialCost,
    laborCost: Math.round(laborCost),
    laborHours: estimate.laborHours,
    hourlyRate: contractorHourlyRate,
    transportation: estimate.transportation,
    disposal: estimate.disposal,
    subtotal: Math.round(subtotal),
    platformFee: Math.round(platformFee),
    gst: Math.round(gst),
    total: Math.round(total)
  }
}

// Mock contractor data with hourly rates
export const mockContractors = [
  {
    id: 'contractor-1',
    name: 'Mike Johnson',
    hourlyRate: 65,
    rating: 4.9,
    completedJobs: 127,
    specialties: ['Deck Refresh', 'Outdoor Projects'],
    availability: '2 days',
    distance: '3.2 miles',
    reviews: 89,
    profileImage: '/api/placeholder/64/64'
  },
  {
    id: 'contractor-2',
    name: 'Sarah Wilson',
    hourlyRate: 55,
    rating: 4.8,
    completedJobs: 94,
    specialties: ['Garden Design', 'Landscaping'],
    availability: '1 week',
    distance: '5.1 miles',
    reviews: 72,
    profileImage: '/api/placeholder/64/64'
  },
  {
    id: 'contractor-3',
    name: 'David Chen',
    hourlyRate: 75,
    rating: 4.7,
    completedJobs: 156,
    specialties: ['Pressure Washing', 'Maintenance'],
    availability: '3 days',
    distance: '7.8 miles',
    reviews: 134,
    profileImage: '/api/placeholder/64/64'
  }
]

export default templates
