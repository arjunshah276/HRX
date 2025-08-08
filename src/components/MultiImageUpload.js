import React, { useState, useCallback } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

const MultiImageUpload = ({ 
  fieldConfig, 
  value = [], 
  onChange, 
  error,
  disabled = false 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState([])

  const maxFiles = fieldConfig?.maxFiles || 5

  // Create preview URLs for uploaded files
  const createPreview = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve({
        file,
        url: e.target.result,
        id: Math.random().toString(36).substr(2, 9)
      })
      reader.readAsDataURL(file)
    })
  }, [])

  // Handle file selection (both drag and click)
  const handleFiles = useCallback(async (files) => {
    const fileArray = Array.from(files)
    const currentFiles = value || []
    
    // Check if adding new files would exceed the limit
    if (currentFiles.length + fileArray.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed. You can add ${maxFiles - currentFiles.length} more.`)
      return
    }

    // Filter for image files only
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length !== fileArray.length) {
      alert('Only image files are allowed.')
    }

    if (imageFiles.length === 0) return

    try {
      // Create previews for new files
      const newPreviews = await Promise.all(imageFiles.map(createPreview))
      
      // Update the form data with all files (existing + new)
      const updatedFiles = [...currentFiles, ...imageFiles]
      onChange(updatedFiles)
      
      // Update previews state
      setPreviews(prev => [...prev, ...newPreviews])
    } catch (error) {
      console.error('Error processing files:', error)
      alert('Error processing some files. Please try again.')
    }
  }, [value, onChange, maxFiles, createPreview])

  // Remove a specific file
  const removeFile = useCallback((indexToRemove) => {
    const currentFiles = value || []
    const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove)
    onChange(updatedFiles)
    
    // Update previews
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove))
  }, [value, onChange])

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles, disabled])

  // File input change handler
  const handleInputChange = useCallback((e) => {
    if (disabled) return
    
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
    
    // Reset the input value so the same file can be selected again if removed and re-added
    e.target.value = ''
  }, [handleFiles, disabled])

  // Initialize previews when component mounts or value changes
  React.useEffect(() => {
    const initializePreviews = async () => {
      if (!value || value.length === 0) {
        setPreviews([])
        return
      }

      const newPreviews = await Promise.all(
        value.map(async (file, index) => {
          if (file instanceof File) {
            return createPreview(file)
          } else if (typeof file === 'string') {
            // Handle URLs (for pre-existing images)
            return {
              file: null,
              url: file,
              id: `existing-${index}`
            }
          }
          return null
        })
      )

      setPreviews(newPreviews.filter(Boolean))
    }

    initializePreviews()
  }, [value, createPreview])

  const currentCount = (value || []).length

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 cursor-pointer'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById(`file-input-${fieldConfig?.id}`).click()}
      >
        <input
          id={`file-input-${fieldConfig?.id}`}
          type="file"
          multiple
          accept={fieldConfig?.accept || "image/*"}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-2">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {dragActive ? 'Drop images here' : 'Upload Images'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select
            </p>
          </div>
          <div className="text-xs text-gray-400">
            {currentCount} of {maxFiles} images uploaded
            {maxFiles - currentCount > 0 && (
              <span className="block">
                You can add {maxFiles - currentCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">
            Uploaded Images ({previews.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={preview.id || index} className="relative group">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                  <img
                    src={preview.url}
                    alt={`Upload ${index + 1}`}
                    className="h-24 w-full object-cover"
                  />
                </div>
                
                {/* Remove Button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* File Info */}
                <div className="mt-1">
                  <p className="text-xs text-gray-500 truncate">
                    {preview.file?.name || `Image ${index + 1}`}
                  </p>
                  {preview.file && (
                    <p className="text-xs text-gray-400">
                      {(preview.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      {currentCount === 0 && (
        <div className="text-center text-sm text-gray-500">
          <ImageIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
          <p>No images uploaded yet</p>
          <p>Supported formats: JPEG, PNG, GIF, WebP</p>
        </div>
      )}
    </div>
  )
}

export default MultiImageUpload

// Example usage in a form:
/*
const ProjectForm = () => {
  const [formData, setFormData] = useState({
    images: []
  })

  const handleImageChange = (files) => {
    setFormData(prev => ({
      ...prev,
      images: files
    }))
  }

  return (
    <form>
      <MultiImageUpload
        fieldConfig={{
          id: 'images',
          accept: 'image/*',
          maxFiles: 5
        }}
        value={formData.images}
        onChange={handleImageChange}
        error={null}
      />
    </form>
  )
}
*/
