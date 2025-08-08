import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'

const ImageUploader = ({ 
  onUpload, 
  maxFiles = 5, 
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ""
}) => {
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState([])
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    const errors = []
    
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
    }
    
    if (!acceptedTypes.includes(file.type)) {
      errors.push(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`)
    }
    
    return errors
  }

  const processFiles = (newFiles) => {
    const fileArray = Array.from(newFiles)
    const validFiles = []
    const allErrors = []

    fileArray.forEach((file) => {
      const fileErrors = validateFile(file)
      if (fileErrors.length === 0) {
        validFiles.push({
          file,
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: URL.createObjectURL(file)
        })
      } else {
        allErrors.push(`${file.name}: ${fileErrors.join(', ')}`)
      }
    })

    if (files.length + validFiles.length > maxFiles) {
      allErrors.push(`Maximum ${maxFiles} files allowed`)
      return
    }

    if (allErrors.length > 0) {
      setErrors(allErrors)
      setTimeout(() => setErrors([]), 5000)
      return
    }

    const updatedFiles = [...files, ...validFiles]
    setFiles(updatedFiles)
    onUpload(updatedFiles.map(f => f.file))
  }

  const removeFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onUpload(updatedFiles.map(f => f.file))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e) => {
    processFiles(e.target.files)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => files.length < maxFiles && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={files.length >= maxFiles}
        />
        
        <div className="flex flex-col items-center">
          <Upload className={`w-8 h-8 mb-2 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-sm font-medium text-gray-900 mb-1">
            {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">
            {acceptedTypes.join(', ').toUpperCase()} up to {Math.round(maxSize / 1024 / 1024)}MB each
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {files.length}/{maxFiles} files uploaded
          </p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800">Upload Errors:</h4>
              <ul className="mt-1 text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index} className="list-disc list-inside">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Uploaded Files ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 mr-3">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id)
                  }}
                  className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '45%'}}></div>
            </div>
            <span className="ml-3 text-sm text-gray-600">Uploading...</span>
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          Photo Guidelines:
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Take photos from multiple angles</li>
          <li>• Include overall area and close-up details</li>
          <li>• Ensure good lighting and clear visibility</li>
          <li>• Show any obstacles or special conditions</li>
          <li>• Photos help contractors provide accurate quotes</li>
        </ul>
      </div>
    </div>
  )
}

export default ImageUploader
