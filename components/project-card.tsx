import React from "react"

interface ProjectCardProps {
  title: string
  description: string
  features?: string[]
  children?: React.ReactNode
}

export default function ProjectCard({ title, description, features, children }: ProjectCardProps) {
  return (
    <div className="my-12 p-8 border border-gray-200 rounded-lg">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          
          {features && features.length > 0 && (
            <ul className="list-disc pl-5 space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="text-gray-600">
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="md:w-1/2 bg-gray-50 rounded-lg p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
