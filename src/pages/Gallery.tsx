import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Gallery() {
  const publicModels = useQuery(api.models.getPublicModels, {});

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Gallery</h1>
          <p className="text-xl text-gray-600">
            Discover amazing 3D models created by our community
          </p>
        </div>

        {publicModels && publicModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicModels.map((model) => (
              <div key={model._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{model.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{model.prompt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">by {model.generator}</span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>❤️ {model.likes}</span>
                      <span>⬇️ {model.downloads}</span>
                    </div>
                  </div>
                  {model.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {model.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No models yet</h3>
            <p className="text-gray-600">Be the first to share your creation with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
}
