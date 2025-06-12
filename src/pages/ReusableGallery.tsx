import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ReusableGallery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const reusableModels = useQuery(api.models.getReusableModels, {});
  const likeModel = useMutation(api.models.likeModel);
  const incrementReuse = useMutation(api.models.incrementModelReuse);

  const filteredModels = reusableModels?.filter(model => {
    const matchesSearch = model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           model.tags.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.likes + b.reuses) - (a.likes + a.reuses);
      case "recent":
        return b._creationTime - a._creationTime;
      case "most_reused":
        return b.reuses - a.reuses;
      default:
        return 0;
    }
  });

  const handleLike = async (modelId: string) => {
    try {
      await likeModel({ modelId: modelId as any });
    } catch (error) {
      toast.error("Failed to like model");
    }
  };

  const handleReuse = async (modelId: string) => {
    try {
      await incrementReuse({ modelId: modelId as any });
      toast.success("Model added to your reusable collection!");
    } catch (error) {
      toast.error("Failed to reuse model");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reusable Model Gallery</h1>
          <p className="text-xl text-gray-600 mb-6">
            Save on printing costs by reusing community-approved designs
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">30% Off Printing</span>
              <span>•</span>
              <span>No Generation Fees</span>
              <span>•</span>
              <span>Instant Download</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Categories</option>
                <option value="decorative">Decorative</option>
                <option value="functional">Functional</option>
                <option value="toys">Toys & Games</option>
                <option value="tools">Tools</option>
                <option value="art">Art & Sculpture</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="most_reused">Most Reused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels && filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <div key={model._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    30% OFF
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleLike(model._id)}
                      className="bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{model.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{model.prompt}</p>
                  
                  {/* Model Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {model.likes}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {model.reuses}
                      </span>
                    </div>
                    <span className="text-orange-600 font-semibold">by {model.generator}</span>
                  </div>

                  {/* Tags */}
                  {model.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {model.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Generation Data */}
                  {model.generationData && (
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <div className="flex justify-between">
                        <span>Print Time:</span>
                        <span>{Math.floor(model.generationData.printTime / 60)}h {model.generationData.printTime % 60}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span>File Size:</span>
                        <span>{model.generationData.fileSize}MB</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/order?reuse=${model._id}`}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors text-center"
                    >
                      Print Now
                    </Link>
                    <button
                      onClick={() => handleReuse(model._id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No models found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              to="/generate"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Create New Model
            </Link>
          </div>
        )}

        {/* Pricing Info */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reusable Model Pricing</h2>
            <p className="text-lg text-gray-600">
              Save money by printing pre-designed models from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Generation</h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>AI Generation Fee:</span>
                  <span className="font-semibold">$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Small Print (5cm):</span>
                  <span className="font-semibold">$15.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Print (10cm):</span>
                  <span className="font-semibold">$25.00</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total (Medium):</span>
                  <span className="text-orange-600">$30.00</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Reusable Model</h3>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  30% OFF
                </span>
              </div>
              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between">
                  <span>AI Generation Fee:</span>
                  <span className="line-through text-gray-400">$5.00</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Small Print (5cm):</span>
                  <span className="font-semibold">$10.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Medium Print (10cm):</span>
                  <span className="font-semibold">$17.50</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total (Medium):</span>
                  <span className="text-green-600">$17.50</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-green-600 font-semibold">Save $12.50!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
