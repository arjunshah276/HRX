import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ImageUploader from './MultiImageUpload'
import MapInput from './MapInput'
import { Calculator, Upload, Map, MessageSquare } from 'lucide-react'

const TemplateForm = ({ template, onSubmit, initialData = {} }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData
  })
  const [images, setImages] = useState([])
  const [mapData, setMapData] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const watchedFields = watch()

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      images: images,
      mapData: mapData,
      templateId: template.id
    }
    onSubmit(formData)
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'number':
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="number"
                step={field.step || "0.01"}
                min={field.min || 0}
                max={field.max}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={field.placeholder}
                {...register(field.name, { 
                  required: field.required ? `${field.label} is required` : false,
                  min: field.min ? { value: field.min, message: `Minimum value is ${field.min}` } : undefined,
                  max: field.max ? { value: field.max, message: `Maximum value is ${field.max}` } : undefined
                })}
              />
              {field.unit && (
                <span className="absolute right-3 top-2 text-gray-500 text-sm">
                  {field.unit}
                </span>
              )}
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register(field.name, { 
                required: field.required ? `${field.label} is required` : false 
              })}
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.name} className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register(field.name)}
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 'radio':
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    {...register(field.name, { 
                      required: field.required ? `${field.label} is required` : false 
                    })}
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              rows={field.rows || 3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
              {...register(field.name, { 
                required: field.required ? `${field.label} is required` : false 
              })}
            />
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        )

      case 'range':
        const currentValue = watchedFields[field.name] || field.min || 0
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}: {currentValue}{field.unit}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              {...register(field.name, { 
                required: field.required ? `${field.label} is required` : false 
              })}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{field.min}{field.unit}</span>
              <span>{field.max}{field.unit}</span>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
        )

      default:
        return (
          <div key={field.name} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={field.placeholder}
              {...register(field.name, { 
                required: field.required ? `${field.label} is required` : false 
              })}
            />
            {field.description && (
              <p className="text-xs text-gray-500 mt-1">{field.description}</p>
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
            )}
          </div>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Form Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center mb-2">
          <div className="text-2xl mr-3">{template.icon}</div>
          <h2 className="text-xl font-bold text-gray-900">{template.title}</h2>
        </div>
        <p className="text-gray-600">{template.description}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Calculator className="w-4 h-4 mr-1" />
          <span>Estimated time: {template.estimatedTime}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Dynamic Form Fields */}
        {template.formFields.map(renderField)}

        {/* Image Upload Section */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Project Images</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Upload photos of the area to help contractors provide accurate estimates
          </p>
          <MultiImageUpload 
            onUpload={setImages}
            maxFiles={5}
            acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
          />
        </div>

        {/* Map Section (for applicable templates) */}
        {(template.id === 'lawn-mowing' || template.id === 'pressure-washing' || template.id === 'garden-bed') && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Map className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Area Mapping</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showMap ? 'Hide Map' : 'Draw on Map'}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Draw the area on the map for more accurate measurements and pricing
            </p>
            {showMap && (
              <MapInput 
                onAreaChange={setMapData}
                initialData={mapData}
              />
            )}
          </div>
        )}

        {/* Additional Notes */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Additional Notes</h3>
          </div>
          <textarea
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any specific requirements, preferences, or questions for contractors..."
            {...register('additionalNotes')}
          />
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Generate Estimate
          </button>
        </div>
      </form>
    </div>
  )
}

export default TemplateForm
