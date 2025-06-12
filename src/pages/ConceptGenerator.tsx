import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ConceptGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generator, setGenerator] = useState("stability");
  const [useUserApiKey, setUseUserApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadPrompt, setUploadPrompt] = useState("");
  const [settings, setSettings] = useState({
    style: "realistic",
    complexity: "medium",
  });
  
  const generateConceptImages = useAction(api.conceptImages.generateConceptImages);
  const uploadConceptImage = useMutation(api.conceptImages.uploadConceptImage);
  const selectConceptImage = useMutation(api.conceptImages.selectConceptImage);
  const deleteConceptImage = useMutation(api.conceptImages.deleteConceptImage);
  const generateUploadUrl = useMutation(api.models.generateUploadUrl);
  
  const freeGenerationsRemaining = useQuery(api.users.getFreeGenerationsRemaining);
  const userConceptImages = useQuery(api.conceptImages.getUserConceptImages);
  const selectedConceptImage = useQuery(api.conceptImages.getSelectedConceptImage);
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Check if user has API key for selected generator
    if (useUserApiKey && generator !== "droid") {
      const hasApiKey = currentUser?.profile?.apiKeys?.[generator as keyof typeof currentUser.profile.apiKeys];
      if (!hasApiKey) {
        toast.error(`Please add your ${generator} API key in settings first.`);
        return;
      }
    }

    setIsGenerating(true);
    try {
      await generateConceptImages({
        prompt: prompt.trim(),
        generator,
        useUserApiKey,
        settings,
      });
      toast.success("Concept images generated! Select one to proceed to 3D modeling.");
      setPrompt("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate concept images");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedImage || !uploadPrompt.trim()) return;

    try {
      // Get upload URL
      const postUrl = await generateUploadUrl();
      
      // Upload image
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": uploadedImage.type },
        body: uploadedImage,
      });
      
      const json = await result.json();
      if (!result.ok) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
      }

      // Get the image URL from storage
      const imageUrl = `https://your-storage-url.com/${json.storageId}`;
      
      await uploadConceptImage({
        prompt: uploadPrompt.trim(),
        imageUrl,
      });
      
      toast.success("Image uploaded successfully!");
      setUploadedImage(null);
      setUploadPrompt("");
      setShowUpload(false);
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSelectImage = async (imageId: string) => {
    try {
      await selectConceptImage({ conceptImageId: imageId as any });
      toast.success("Concept image selected! You can now generate a 3D model.");
    } catch (error) {
      toast.error("Failed to select image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteConceptImage({ conceptImageId: imageId as any });
      toast.success("Image deleted");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const generatorOptions = [
    { value: "stability", name: "Stability AI", description: "High-quality, consistent results" },
    { value: "openai", name: "DALL-E 3", description: "Creative and detailed images" },
  ];

  const hasApiKeys = currentUser?.profile?.apiKeys && 
    Object.values(currentUser.profile.apiKeys).some(key => key && key.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Concept Image Generator</h1>
          <p className="text-xl text-gray-600">
            Create or upload concept images to guide your 3D model generation
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-500">
              Free generations remaining: <span className="font-semibold text-orange-600">{freeGenerationsRemaining}</span>
            </span>
            <Link 
              to="/api-settings" 
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Configure API Keys →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Generate Concept Images</h2>
                <button
                  onClick={() => setShowUpload(!showUpload)}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  {showUpload ? "← Back to Generate" : "Upload Image Instead →"}
                </button>
              </div>

              {!showUpload ? (
                <form onSubmit={handleGenerate} className="space-y-6">
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your Concept
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the object you want to create in 3D..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Generator
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatorOptions.map((option) => (
                        <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="generator"
                            value={option.value}
                            checked={generator === option.value}
                            onChange={(e) => setGenerator(e.target.value)}
                            className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{option.name}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                            {!currentUser?.profile?.apiKeys?.[option.value as keyof typeof currentUser.profile.apiKeys] && (
                              <div className="text-xs text-red-500 mt-1">API key required</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {generator !== "droid" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="useUserApiKey"
                          checked={useUserApiKey}
                          onChange={(e) => setUseUserApiKey(e.target.checked)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="useUserApiKey" className="ml-2 text-sm text-gray-700">
                          Use my own API key (unlimited generations)
                        </label>
                      </div>
                      {!hasApiKeys && (
                        <p className="text-xs text-blue-600 mt-2">
                          <Link to="/api-settings" className="underline">Configure your API keys</Link> to enable unlimited generations
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Style
                      </label>
                      <select
                        value={settings.style}
                        onChange={(e) => setSettings(prev => ({ ...prev, style: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="realistic">Realistic</option>
                        <option value="stylized">Stylized</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="artistic">Artistic</option>
                        <option value="industrial">Industrial</option>
                        <option value="fantasy">Fantasy</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality
                      </label>
                      <select
                        value={settings.complexity}
                        onChange={(e) => setSettings(prev => ({ ...prev, complexity: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="standard">Standard</option>
                        <option value="detailed">High Detail</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating || !prompt.trim() || 
                      (!useUserApiKey && (freeGenerationsRemaining ?? 0) <= 0) ||
                      (useUserApiKey && !currentUser?.profile?.apiKeys?.[generator as keyof typeof currentUser.profile.apiKeys])}
                    className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? "Generating 4 Concept Images..." : "Generate Concept Images"}
                  </button>

                  {!useUserApiKey && (freeGenerationsRemaining ?? 0) <= 0 && (
                    <p className="text-sm text-red-600 text-center">
                      No free generations remaining. <Link to="/api-settings" className="underline">Add your API keys</Link> for unlimited access.
                    </p>
                  )}
                </form>
              ) : (
                <form onSubmit={handleUpload} className="space-y-6">
                  <div>
                    <label htmlFor="uploadPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                      Describe Your Image
                    </label>
                    <textarea
                      id="uploadPrompt"
                      value={uploadPrompt}
                      onChange={(e) => setUploadPrompt(e.target.value)}
                      placeholder="Describe what's in your image..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadedImage(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPG, PNG, WebP. Max size: 10MB
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!uploadedImage || !uploadPrompt.trim()}
                    className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Concept Image
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Settings Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Generator:</span>
                  <span className="font-medium">{generatorOptions.find(g => g.value === generator)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Style:</span>
                  <span className="font-medium capitalize">{settings.style}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quality:</span>
                  <span className="font-medium capitalize">{settings.complexity}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-orange-800">
                  Generate multiple concept images to choose the best one for 3D modeling. Clear, single-object images work best!
                </p>
              </div>

              {selectedConceptImage && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">✓ Selected Concept</h4>
                  <p className="text-sm text-green-800">
                    Ready to generate 3D model!
                  </p>
                  <Link 
                    to="/model-generator" 
                    className="inline-block mt-2 text-green-700 hover:text-green-800 font-medium text-sm"
                  >
                    Generate 3D Model →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Concept Images Gallery */}
        {userConceptImages && userConceptImages.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Concept Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userConceptImages.map((image) => (
                <div key={image._id} className={`border-2 rounded-lg p-4 transition-all ${
                  image.isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-orange-300'
                }`}>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={image.imageUrl} 
                      alt={image.prompt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        (e.target as HTMLImageElement).src = `https://picsum.photos/400/400?random=${image._id}`;
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.prompt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className={`px-2 py-1 rounded-full ${
                      image.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {image.status}
                    </span>
                    <span className="capitalize">{image.generator}</span>
                  </div>
                  <div className="flex gap-2">
                    {!image.isSelected ? (
                      <button
                        onClick={() => handleSelectImage(image._id)}
                        className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-orange-700 transition-colors"
                      >
                        Select
                      </button>
                    ) : (
                      <div className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs font-medium text-center">
                        Selected ✓
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image._id)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
