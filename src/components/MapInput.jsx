import React, { useEffect, useRef, useState } from 'react'
import { MapPin, Square, Trash2, RotateCcw } from 'lucide-react'

// Mock implementation since we don't have Mapbox in this environment
// In real app, this would use Mapbox GL JS + Mapbox Draw
const MapInput = ({ onAreaChange, initialData = null }) => {
  const mapRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnAreas, setDrawnAreas] = useState([])
  const [totalArea, setTotalArea] = useState(0)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Mock coordinates for Vancouver, BC
  const [center, setCenter] = useState([-123.1207, 49.2827])
  const [zoom, setZoom] = useState(15)

  useEffect(() => {
    // In real implementation, initialize Mapbox here
    // This is a mock setup
    setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    // Cleanup function
    return () => {
      // Cleanup map instance
    }
  }, [])

  const startDrawing = () => {
    setIsDrawing(true)
    // In real app: map.getCanvas().style.cursor = 'crosshair'
  }

  const clearDrawings = () => {
    setDrawnAreas([])
    setTotalArea(0)
    setIsDrawing(false)
    onAreaChange(null)
  }

  const mockDrawArea = () => {
    // Simulate drawing a rectangular area
    const newArea = {
      id: Date.now(),
      coordinates: [
        [-123.125, 49.285],
        [-123.115, 49.285],
        [-123.115, 49.280],
        [-123.125, 49.280],
        [-123.125, 49.285]
      ],
      area: Math.random() * 1000 + 500 // Mock area in sq ft
    }

    const updatedAreas = [...drawnAreas, newArea]
    setDrawnAreas(updatedAreas)
    
    const total = updatedAreas.reduce((sum, area) => sum + area.area, 0)
    setTotalArea(total)
    
    setIsDrawing(false)
    
    onAreaChange({
      areas: updatedAreas,
      totalArea: total,
      center: center,
      zoom: zoom
    })
  }

  const removeArea = (areaId) => {
    const updatedAreas = drawnAreas.filter(area => area.id !== areaId)
    setDrawnAreas(updatedAreas)
    
    const total = updatedAreas.reduce((sum, area) => sum + area.area, 0)
    setTotalArea(total)
    
    onAreaChange(updatedAreas.length > 0 ? {
      areas: updatedAreas,
      totalArea: total,
      center: center,
      zoom: zoom
    } : null)
  }

  return (
    <div className="w-full">
      {/* Map Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Draw areas to calculate measurements
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={isDrawing ? mockDrawArea : startDrawing}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isDrawing
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Square className="w-4 h-4 mr-1" />
            {isDrawing ? 'Click to Place' : 'Draw Area'}
          </button>
          {drawnAreas.length > 0 && (
            <button
              onClick={clearDrawings}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-64 bg-gray-100 rounded-lg border border-gray-300 relative overflow-hidden"
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Mock Map Background */}
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 relative">
                {/* Mock streets */}
                <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-400"></div>
                <div className="absolute top-2/3 left-0 w-full h-1 bg-gray-400"></div>
                <div className="absolute left-1/4 top-0 w-1 h-full bg-gray-400"></div>
                <div className="absolute left-3/4 top-0 w-1 h-full bg-gray-400"></div>

                {/* Mock buildings */}
                <div className="absolute top-8 left-8 w-12 h-8 bg-gray-300 shadow-sm"></div>
                <div className="absolute top-12 right-12 w-16 h-12 bg-gray-300 shadow-sm"></div>
                <div className="absolute bottom-8 left-1/3 w-10 h-10 bg-gray-300 shadow-sm"></div>

                {/* Drawn areas */}
                {drawnAreas.map((area, index) => (
                  <div
                    key={area.id}
                    className="absolute bg-blue-500 bg-opacity-30 border-2 border-blue-500 cursor-pointer"
                    style={{
                      top: `${20 + index * 15}%`,
                      left: `${30 + index * 10}%`,
                      width: '25%',
                      height: '20%'
                    }}
                    onClick={() => removeArea(area.id)}
                    title="Click to remove area"
                  >
                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                      {Math.round(area.area)} sq ft
                    </div>
                  </div>
                ))}

                {/* Drawing cursor indicator */}
                {isDrawing && (
                  <div className="absolute inset-0 cursor-crosshair flex items-center justify-center">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm animate-pulse">
                      Click anywhere to place area
                    </div>
                  </div>
                )}
              </div>

              {/* Map attribution */}
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                Mock Map
              </div>
            </>
          )}
        </div>
      </div>

      {/* Area Summary */}
      {drawnAreas.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            Area Summary
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Total Areas:</span>
              <span className="ml-2 font-medium">{drawnAreas.length}</span>
            </div>
            <div>
              <span className="text-blue-700">Total Size:</span>
              <span className="ml-2 font-medium">{Math.round(totalArea)} sq ft</span>
            </div>
          </div>
          
          {/* Individual areas list */}
          <div className="mt-3 space-y-1">
            {drawnAreas.map((area, index) => (
              <div key={area.id} className="flex items-center justify-between text-xs">
                <span className="text-blue-700">Area {index + 1}:</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{Math.round(area.area)} sq ft</span>
                  <button
                    onClick={() => removeArea(area.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">
          How to use:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click "Draw Area" to start measuring</li>
          <li>• Click on the map to place measurement areas</li>
          <li>• Click on drawn areas to remove them</li>
          <li>• Multiple areas will be added together</li>
          <li>• This helps contractors provide accurate quotes</li>
        </ul>
      </div>

      {/* Real implementation note */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        <p>
          In production: This would use Mapbox GL JS for real satellite imagery and precise measurements
        </p>
      </div>
    </div>
  )
}

export default MapInput
