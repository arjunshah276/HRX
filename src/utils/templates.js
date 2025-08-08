// templates.js - Template configurations and cost calculation logic

export const templates = {
  'deck-refresh': {
    id: 'deck-refresh',
    title: 'Deck Refresh',
    description: 'Revitalize your existing deck with new stain, repairs, and upgrades',
    category: 'exterior',
    estimatedTime: '1-2 days',
    complexity: 'medium',
    icon: '🏠',
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
          { value: 'transparent', label: 'Transparent Stain - $3/sq ft' },
          { value: 'semi-transparent', label: 'Semi-Transparent Stain - $4/sq ft' },
          { value: 'solid', label: 'Solid Stain - $5/sq ft' },
          { value: 'paint', label: 'Exterior Paint - $6/sq ft' }
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
    pricing: {
      baseCost: 50, // Base project cost
      materials: {
        transparent: 3,
        'semi-transparent': 4,
        solid: 5,
        paint: 6
      },
      labor: {
        excellent: 8, // per sq ft
        good: 10,
        fair: 12,
        poor: 15
      },
      addons: {
        railingRefresh: 8, // per linear foot
        pressureWashing: 2 // per sq ft
      }
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
    fields: [
      {
        id: 'firepitType',
        label: 'Firepit Type',
        type: 'select',
        required: true,
        options: [
          { value: 'stone-ring', label: 'Natural Stone Ring - $800 base' },
          { value: 'brick-circle', label: 'Brick Circle - $600 base' },
          { value: 'metal-insert', label: 'Metal Insert with Stone Surround - $1000 base' },
          { value: 'custom-built', label: 'Custom Built-in - $1500 base' }
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
          { value: 'gravel-pad', label: 'Gravel Pad (bring your own chairs) - Free' },
          { value: 'stone-benches', label: 'Built-in Stone Benches - $400' },
          { value: 'log-benches', label: 'Natural Log Benches - $300' },
          { value: 'paver-patio', label: 'Paver Patio Base - $600' }
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
          { value: 'gas', label: 'Natural Gas (requires gas line) - +$400' },
          { value: 'propane', label: 'Propane (portable tank) - +$200' }
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
        placeholder: 'Describe where you want the firepit (e.g., back corner, center of yard, near deck)...',
        required: false
      }
    ],
    pricing: {
      baseCost: {
        'stone-ring': 800,
        'brick-circle': 600,
        'metal-insert': 1000,
        'custom-built': 1500
      },
      sizeMultiplier: {
        '3ft': 1.0,
        '4ft': 1.2,
        '5ft': 1.4,
        '6ft': 1.6
      },
      seatingCost: {
        'gravel-pad': 0,
        'stone-benches': 400,
        'log-benches': 300,
        'paver-patio': 600
      },
      addons: {
        landscaping: 300,
        lighting: 250,
        gas: 400,
        propane: 200
      },
      laborPerSqFt: 15 // for seating area preparation
    }
  },

  'lawn-mowing': {
    id: 'lawn-mowing',
    title: 'Lawn Mowing Service',
    description: 'Professional lawn care with customizable scheduling',
    category: 'maintenance',
    estimatedTime: '2-4 hours',
    complexity: 'low',
    icon: '🌱',
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
      {
        id: 'grassHeight',
        label: 'Current Grass Height',
        type: 'select',
        required: true,
        options: [
          { value: 'short', label: '1-3 inches (regular maintenance)' },
          { value: 'medium', label: '3-6 inches (overgrown)' },
          { value: 'tall', label: '6+ inches (very overgrown)' }
        ]
      },
      {
        id: 'terrainType',
        label: 'Terrain Type',
        type: 'select',
        required: true,
        options: [
          { value: 'flat', label: 'Flat - Easy to mow' },
          { value: 'slight-slope', label: 'Slight slope - Some hills' },
          { value: 'steep', label: 'Steep slopes - Difficult terrain' }
        ]
      },
      {
        id: 'obstacles',
        label: 'Obstacles in Yard',
        type: 'checkbox-group',
        required: false,
        options: [
          { value: 'trees', label: 'Many trees to mow around' },
          { value: 'flower-beds', label: 'Flower beds requiring trimming' },
          { value: 'fence', label: 'Fence line trimming needed' },
          { value: 'decorations', label: 'Garden decorations/features' }
        ]
      },
      {
        id: 'edging',
        label: 'Include Edging',
        type: 'checkbox',
        required: false,
        description: 'Clean edges along walkways and driveways'
      },
      {
        id: 'cleanup',
        label: 'Grass Cleanup',
        type: 'select',
        required: true,
        options: [
          { value: 'bag', label: 'Bag and remove clippings - +$20' },
          { value: 'mulch', label: 'Mulch clippings (leave on lawn) - Free' }
        ]
      },
      {
        id: 'frequency',
        label: 'Service Frequency',
        type: 'select',
        required: true,
        options: [
          { value: 'one-time', label: 'One-time service' },
          { value: 'weekly', label: 'Weekly (10% discount)' },
          { value: 'bi-weekly', label: 'Bi-weekly (5% discount)' },
          { value: 'monthly', label: 'Monthly' }
        ]
      },
      {
        id: 'images',
        label: 'Upload Yard Photos',
        type: 'file',
        accept: 'image/*',
        multiple: true,
        required: false,
        maxFiles: 3
      },
      {
        id: 'notes',
        label: 'Special Instructions',
        type: 'textarea',
        placeholder: 'Any specific areas to avoid, gate codes, pet considerations...',
        required: false
      }
    ],
    pricing: {
      baseRate: 0.08, // per sq ft
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
        trees: 15,
        'flower-beds': 20,
        fence: 25,
        decorations: 10
      },
      addons: {
        edging: 30,
        bag: 20
      },
      frequencyDiscount: {
        'one-time': 0,
        weekly: 0.1,
        'bi-weekly': 0.05,
        monthly: 0
      }
    }
  },

  'garden-bed': {
    id: 'garden-bed',
    title: 'Garden Bed Installation',
    description: 'Create beautiful garden beds with plants and flowers',
    category: 'landscaping',
    estimatedTime: '1 day',
    complexity: 'medium',
    icon: '🌸',
    fields: [
      {
        id: 'bedShape',
        label: 'Garden Bed Shape',
        type: 'select',
        required: true,
        options: [
          { value: 'rectangular', label: 'Rectangular' },
          { value: 'circular', label: 'Circular' },
          { value: 'curved', label: 'Curved/Organic Shape' },
          { value: 'custom', label: 'Custom Design' }
        ]
      },
      {
        id: 'bedLength',
        label: 'Bed Length',
        type: 'number',
        unit: 'feet',
        required: true,
        min: 3,
        max: 50,
        step: 1,
        placeholder: '8'
      },
      {
        id: 'bedWidth',
        label: 'Bed Width',
        type: 'number',
        unit: 'feet',
        required: true,
        min: 2,
        max: 20,
        step: 1,
        placeholder: '4'
      },
      {
        id: 'soilPrep',
        label: 'Soil Preparation',
        type: 'select',
        required: true,
        options: [
          { value: 'basic', label: 'Basic - Remove grass/weeds only' },
          { value: 'enhanced', label: 'Enhanced - Add compost and soil amendments' },
          { value: 'premium', label: 'Premium - Complete soil replacement' }
        ]
      },
      {
        id: 'edgingType',
        label: 'Bed Edging',
        type: 'select',
        required: true,
        options: [
          { value: 'none', label: 'No edging - $0' },
          { value: 'plastic', label: 'Plastic edging - $3/linear foot' },
          { value: 'metal', label: 'Metal edging - $5/linear foot' },
          { value: 'stone', label: 'Natural stone - $8/linear foot' },
          { value: 'brick', label: 'Brick edging - $6/linear foot' }
        ]
      },
      {
        id: 'plantType',
        label: 'Plant Selection',
        type: 'select',
        required: true,
        options: [
          { value: 'annuals', label: 'Annual flowers (seasonal) - $8/sq ft' },
          { value: 'perennials', label: 'Perennial flowers (return yearly) - $12/sq ft' },
          { value: 'shrubs', label: 'Shrubs and bushes - $15/sq ft' },
          { value: 'mixed', label: 'Mixed plants (shrubs + flowers) - $18/sq ft' }
        ]
      },
      {
        id: 'mulching',
        label: 'Mulch Type',
        type: 'select',
        required: true,
        options: [
          { value: 'wood-chips', label: 'Wood chips - $2/sq ft' },
          { value: 'bark-mulch', label: 'Bark mulch - $3/sq ft' },
          { value: 'decorative-stone', label: 'Decorative stone - $4/sq ft' },
          { value: 'rubber-mulch', label: 'Rubber mulch - $5/sq ft' }
        ]
      },
      {
        id: 'irrigation',
        label: 'Watering System',
        type: 'select',
        required: false,
        options: [
          { value: 'none', label: 'No irrigation system' },
          { value: 'drip', label: 'Drip irrigation system - +$200' },
          { value: 'sprinkler', label: 'Sprinkler heads - +$300' }
        ]
      },
      {
        id: 'sunExposure',
        label: 'Sun Exposure',
        type: 'select',
        required: true,
        options: [
          { value: 'full-sun', label: 'Full sun (6+ hours)' },
          { value: 'partial-sun', label: 'Partial sun (4-6 hours)' },
          { value: 'shade', label: 'Shade (less than 4 hours)' }
        ]
      },
      {
        id: 'images',
        label: 'Upload Location Photos',
        type: 'file',
        accept: 'image/*',
        multiple: true,
        required: false,
        maxFiles: 5
      },
      {
        id: 'colorPreference',
        label: 'Color Preferences',
        type: 'textarea',
        placeholder: 'Preferred colors, themes, or specific plants you like...',
        required: false
      }
    ],
    pricing: {
      soilPrep: {
        basic: 3,
        enhanced: 5,
        premium: 8
      },
      edgingCost: {
        none: 0,
        plastic: 3,
        metal: 5,
        stone: 8,
        brick: 6
      },
      plantCost: {
        annuals: 8,
        perennials: 12,
        shrubs: 15,
        mixed: 18
      },
      mulchCost: {
        'wood-chips': 2,
        'bark-mulch': 3,
        'decorative-stone': 4,
        'rubber-mulch': 5
      },
      irrigation: {
        none: 0,
        drip: 200,
        sprinkler: 300
      },
      labor: 12 // base labor per sq ft
    }
  },

  'pressure-washing': {
    id: 'pressure-washing',
    title: 'Pressure Washing Service',
    description: 'Deep clean driveways, decks, and exterior surfaces',
    category: 'maintenance',
    estimatedTime: '3-6 hours',
    complexity: 'low',
    icon: '💧',
    fields: [
      {
        id: 'surfaceType',
        label: 'Primary Surface to Clean',
        type: 'checkbox-group',
        required: true,
        options: [
          { value: 'driveway', label: 'Driveway/Walkway' },
          { value: 'deck', label: 'Deck/Patio' },
          { value: 'siding', label: 'House Siding' },
          { value: 'fence', label: 'Fence' },
          { value: 'concrete', label: 'Concrete surfaces' }
        ]
      },
      {
        id: 'totalArea',
        label: 'Total Area to Clean',
        type: 'number',
        unit: 'square feet',
        required: true,
        min: 50,
        max: 5000,
        step: 50,
        placeholder: '500'
      },
      {
        id: 'dirtLevel',
        label: 'Dirt/Stain Level',
        type: 'select',
        required: true,
        options: [
          { value: 'light', label: 'Light - Regular maintenance cleaning' },
          { value: 'moderate', label: 'Moderate - Some stains and buildup' },
          { value: 'heavy', label: 'Heavy - Significant stains/algae/mold' }
        ]
      },
      {
        id: 'accessDifficulty',
        label: 'Access Difficulty',
        type: 'select',
        required: true,
        options: [
          { value: 'easy', label: 'Easy - Clear access, flat surfaces' },
          { value: 'moderate', label: 'Moderate - Some obstacles or elevation' },
          { value: 'difficult', label: 'Difficult - Tight spaces, multiple levels' }
        ]
      },
      {
        id: 'specialCleaning',
        label: 'Special Cleaning Needs',
        type: 'checkbox-group',
        required: false,
        options: [
          { value: 'oil-stains', label: 'Oil stain removal - +$50' },
          { value: 'rust-removal', label: 'Rust stain treatment - +$75' },
          { value: 'mold-mildew', label: 'Mold/mildew treatment - +$100' },
          { value: 'graffiti', label: 'Graffiti removal - +$150' }
        ]
      },
      {
        id: 'seasonalFactors',
        label: 'Seasonal Considerations',
        type: 'select',
        required: false,
        options: [
          { value: 'none', label: 'No seasonal factors' },
          { value: 'winter-salt', label: 'Winter salt damage cleanup' },
          { value: 'spring-pollen', label: 'Spring pollen/organic buildup' },
          { value: 'fall-leaves', label: 'Fall leaf stain removal' }
        ]
      },
      {
        id: 'waterSource',
        label: 'Water Source Access',
        type: 'select',
        required: true,
        options: [
          { value: 'hose-available', label: 'Garden hose available on property' },
          { value: 'need-water', label: 'Need to bring water (+$50)' }
        ]
      },
      {
        id: 'sealingService',
        label: 'Post-Cleaning Sealing',
        type: 'select',
        required: false,
        options: [
          { value: 'none', label: 'No sealing service' },
          { value: 'concrete-sealer', label: 'Concrete sealer application - +$1.50/sq ft' },
          { value: 'deck-sealer', label: 'Deck stain/sealer - +$2.00/sq ft' }
        ]
      },
      {
        id: 'images',
        label: 'Upload Before Photos',
        type: 'file',
        accept: 'image/*',
        multiple: true,
        required: false,
        maxFiles: 5
      },
      {
        id: 'notes',
        label: 'Additional Details',
        type: 'textarea',
        placeholder: 'Specific problem areas, delicate surfaces to avoid, timing preferences...',
        required: false
      }
    ],
    pricing: {
      baseRate: {
        light: 0.15,
        moderate: 0.20,
        heavy: 0.30
      },
      accessMultiplier: {
        easy: 1.0,
        moderate: 1.2,
        difficult: 1.5
      },
      specialCleaning: {
        'oil-stains': 50,
        'rust-removal': 75,
        'mold-mildew': 100,
        graffiti: 150
      },
      waterSource: {
        'hose-available': 0,
        'need-water': 50
      },
      sealing: {
        none: 0,
        'concrete-sealer': 1.5,
        'deck-sealer': 2.0
      }
    }
  }
}

// Cost calculation utilities
export const calculateProjectCost = (templateId, formData) => {
  const template = templates[templateId]
  if (!template) return null

  let totalCost = 0
  let breakdown = {}

  switch (templateId) {
    case 'deck-refresh':
      const deckArea = parseFloat(formData.deckLength || 0) * parseFloat(formData.deckWidth || 0)
      const materialCost = template.pricing.materials[formData.stainType] || 0
      const laborCost = template.pricing.labor[formData.deckCondition] || 0
      
      totalCost += template.pricing.baseCost
      totalCost += deckArea * (materialCost + laborCost)
      
      breakdown.baseCost = template.pricing.baseCost
      breakdown.materials = deckArea * materialCost
      breakdown.labor = deckArea * laborCost
      
      if (formData.railingRefresh && formData.railingLength) {
        const railingCost = parseFloat(formData.railingLength) * template.pricing.addons.railingRefresh
        totalCost += railingCost
        breakdown.railingRefresh = railingCost
      }
      
      if (formData.pressureWashing) {
        const washingCost = deckArea * template.pricing.addons.pressureWashing
        totalCost += washingCost
        breakdown.pressureWashing = washingCost
      }
      break

    case 'firepit':
      const seatingArea = Math.PI * Math.pow(parseFloat(formData.seatingArea || 0) / 2, 2)
      const baseFirepitCost = template.pricing.baseCost[formData.firepitType] || 0
      const sizeMultiplier = template.pricing.sizeMultiplier[formData.firepitSize] || 1
      const seatingCost = template.pricing.seatingCost[formData.seatingType] || 0
      
      totalCost += baseFirepitCost * sizeMultiplier
      totalCost += seatingArea * template.pricing.laborPerSqFt
      totalCost += seatingCost
      
      breakdown.firepit = baseFirepitCost * sizeMultiplier
      breakdown.seatingPrep = seatingArea * template.pricing.laborPerSqFt
      breakdown.seating = seatingCost
      
      if (formData.landscaping) {
        totalCost += template.pricing.addons.landscaping
        breakdown.landscaping = template.pricing.addons.landscaping
      }
      if (formData.lighting) {
        totalCost += template.pricing.addons.lighting
        breakdown.lighting = template.pricing.addons.lighting
      }
      if (formData.fuelType === 'gas') {
        totalCost += template.pricing.addons.gas
        breakdown.gasLine = template.pricing.addons.gas
      }
      if (formData.fuelType === 'propane') {
        totalCost += template.pricing.addons.propane
        breakdown.propaneSetup = template.pricing.addons.propane
      }
      break

    case 'lawn-mowing':
      const lawnArea = parseFloat(formData.lawnLength || 0) * parseFloat(formData.lawnWidth || 0)
      let baseLawnCost = lawnArea * template.pricing.baseRate
      
      const heightMultiplier = template.pricing.grassHeightMultiplier[formData.grassHeight] || 1
      const terrainMultiplier = template.pricing.terrainMultiplier[formData.terrainType] || 1
      
      baseLawnCost *= heightMultiplier * terrainMultiplier
      totalCost += baseLawnCost
      
      breakdown.mowing = baseLawnCost
      
      // Add obstacle costs
      if (formData.obstacles && Array.isArray(formData.obstacles)) {
        formData.obstacles.forEach(obstacle => {
          if (template.pricing.obstacles[obstacle]) {
            totalCost += template.pricing.obstacles[obstacle]
            breakdown[obstacle] = template.pricing.obstacles[obstacle]
          }
        })
      }
      
      if (formData.edging) {
        totalCost += template.pricing.addons.edging
        breakdown.edging = template.pricing.addons.edging
      }
      
      if (formData.cleanup === 'bag') {
        totalCost += template.pricing.addons.bag
        breakdown.cleanup = template.pricing.addons.bag
      }
      
      // Apply frequency discount
      const discount = template.pricing.frequencyDiscount[formData.frequency] || 0
      if (discount > 0) {
        const discountAmount = totalCost * discount
        totalCost -= discountAmount
        breakdown.discount = -discountAmount
      }
      break

    case 'garden-bed':
      const bedArea = parseFloat(formData.bedLength || 0) * parseFloat(formData.bedWidth || 0)
      const perimeter = 2 * (parseFloat(formData.bedLength || 0) + parseFloat(formData.bedWidth || 0))
      
      // Soil preparation
      const soilCost = bedArea * template.pricing.soilPrep[formData.soilPrep]
      totalCost += soilCost
      breakdown.soilPrep = soilCost
      
      // Edging
      if (formData.edgingType !== 'none') {
        const edgingCost = perimeter * template.pricing.edgingCost[formData.edgingType]
        totalCost += edgingCost
        breakdown.edging = edgingCost
      }
      
      // Plants
      const plantCost = bedArea * template.pricing.plantCost[formData.plantType]
      totalCost += plantCost
      breakdown.plants = plantCost
      
      // Mulch
      const mulchCost = bedArea * template.pricing.mulchCost[formData.mulching]
      totalCost += mulchCost
      breakdown.mulch = mulchCost
      
      // Labor
      const laborC = bedArea * template.pricing.labor
      totalCost += laborC
      breakdown.labor = laborC
      
      // Irrigation
      if (formData.irrigation && formData.irrigation !== 'none') {
        const irrigationCost = template.pricing.irrigation[formData.irrigation]
        totalCost += irrigationCost
        breakdown.irrigation = irrigationCost
      }
      break

    case 'pressure-washing':
      const area = parseFloat(formData.totalArea || 0)
      const baseRate = template.pricing.baseRate[formData.dirtLevel] || 0
      const accessMultiplier = template.pricing.accessMultiplier[formData.accessDifficulty] || 1
      
      let washingCost = area * baseRate * accessMultiplier
      totalCost += washingCost
      breakdown.washing = washingCost
      
      // Special cleaning
      if (formData.specialCleaning && Array.isArray(formData.specialCleaning)) {
        formData.specialCleaning.forEach(service => {
          if (template.pricing.specialCleaning[service]) {
            totalCost += template.pricing.specialCleaning[service]
            breakdown[service] = template.pricing.specialCleaning[service]
          }
        })
      }
      
      // Water source
      if (formData.waterSource === 'need-water') {
        totalCost += template.pricing.waterSource['need-water']
        breakdown.waterService = template.pricing.waterSource['need-water']
      }
      
      // Sealing
      if (formData.sealingService && formData.sealingService !== 'none') {
        const sealingCost = area * template.pricing.sealing[formData.sealingService]
        totalCost += sealingCost
        breakdown.sealing = sealingCost
      }
      break
  }

  return {
    total: Math.round(totalCost),
    breakdown
  }
}

// Commission calculation for technicians
export const calculateTechnicianPayout = (projectTotal, commissionRate) => {
  const platformCommission = projectTotal * (commissionRate / 100)
  const technicianPayout = projectTotal - platformCommission
  
  return {
    projectTotal,
    platformCommission: Math.round(platformCommission),
    technicianPayout: Math.round(technicianPayout),
    commissionRate
  }
}

export default templates
