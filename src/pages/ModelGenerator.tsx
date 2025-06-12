import { useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ModelGenerator() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [generator, setGenerator] = useState("droid");
  const [useUserApiKey, setUseUserApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEnhancedPrompt, setShowEnhancedPrompt] = useState(false);
  const [currentModelId, setCurrentModelId] = useState<string | null>(null);
  const [enhancedPromptText, setEnhancedPromptText] = useState("");
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [settings, setSettings] = useState({
    style: "realistic",
    complexity: "medium",
    size: "medium",
    material: "pla",
    printability: "optimized",
    supports: true,
    hollowFill: 20,
  });
  
  const generateModel = useAction(api.models.generateModel);
  const executeModelGeneration = useAction(api.models.executeModelGeneration);
  const freeGenerationsRemaining = useQuery(api.users.getFreeGenerationsRemaining);
  const userModels = useQuery(api.models.getUserModels);
  const currentUser = useQuery(api.users.getCurrentUser);
  const selectedConceptImage = useQuery(api.conceptImages.getSelectedConceptImage);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !title.trim()) return;

    // Check if user has API key for selected generator
    if (useUserApiKey && generator !== "droid") {
      const hasApiKey = currentUser?.profile?.apiKeys?.[generator as keyof typeof currentUser.profile.apiKeys];
      if (!hasApiKey) {
        toast.error(`Please add your ${generator} API key in settings first.`);
        return;
      }
    }

    setIsGenerating(true);
    setOriginalPrompt(prompt.trim()); // Store original prompt
    try {
      const modelId = await generateModel({
        prompt: prompt.trim(),
        title: title.trim(),
        generator,
        useUserApiKey,
        conceptImageId: selectedConceptImage?._id,
        settings,
      });
      setCurrentModelId(modelId);
      // Fetch the newly created model to get the enhanced prompt
      const newModel = userModels?.find(m => m._id === modelId);
      if (newModel?.enhancedDescription) {
        setEnhancedPromptText(newModel.enhancedDescription);
        setShowEnhancedPrompt(true);
      } else {
        toast.success("Model generation started! Check your dashboard for updates.");
        setPrompt("");
        setTitle("");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate model");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmGeneration = async () => {
    if (!currentModelId || !enhancedPromptText.trim()) return;

    setIsGenerating(true);
    try {
      await executeModelGeneration({
        modelId: currentModelId,
        enhancedPrompt: enhancedPromptText.trim(),
        generator,
        useUserApiKey,
        settings,
      });
      toast.success("Model generation confirmed and started!");
      setPrompt("");
      setTitle("");
      setShowEnhancedPrompt(false);
      setCurrentModelId(null);
      setEnhancedPromptText("");
      setOriginalPrompt("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to confirm generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelEnhancement = () => {
    setShowEnhancedPrompt(false);
    setCurrentModelId(null);
    setEnhancedPromptText("");
    setOriginalPrompt("");
    toast.info("Prompt enhancement cancelled.");
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generatorOptions = [
    { value: "droid", name: "DROID (Default)", description: "Our optimized AI system" },
    { value: "meshy", name: "Meshy", description: "High-quality text/image to 3D" },
    { value: "tripo", name: "Tripo AI", description: "Advanced 3D generation" },
    { value: "ai3dStudio", name: "3D AI Studio", description: "Professional quality" },
    { value: "alpha3d", name: "Alpha3D", description: "Game-ready assets" },
    { value: "sloyd", name: "Sloyd", description: "Real-time generation" },
    { value: "ponzu", name: "Ponzu", description: "Open-source (self-hosted)" },
    { value: "stability", name: "Stability AI", description: "Stable Diffusion 3D" },
  ];

  const hasApiKeys = currentUser?.profile?.apiKeys && 
    Object.values(currentUser.profile.apiKeys).some(key => key && key.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Model Generator</h1>
          <p className="text-xl text-gray-600">
            Transform your ideas into 3D models with the power of AI
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
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Model Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Give your model a name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Model
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe what you want to create in detail..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {selectedConceptImage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-900 mb-2">Selected Concept Image</h3>
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedConceptImage.imageUrl} 
                        alt={selectedConceptImage.prompt}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://picsum.photos/64/64?random=${selectedConceptImage._id}`;
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-green-800 line-clamp-2">{selectedConceptImage.prompt}</p>
                        <p className="text-xs text-green-600 mt-1">This image will guide the 3D generation</p>
                      </div>
                      <Link 
                        to="/concept-generator" 
                        className="text-green-700 hover:text-green-800 text-xs font-medium"
                      >
                        Change →
                      </Link>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Generator
                  </label>
                  <select
                    value={generator}
                    onChange={(e) => setGenerator(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {generatorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name} - {option.description}
                      </option>
                    ))}
                  </select>
                  {generator !== "droid" && !currentUser?.profile?.apiKeys?.[generator as keyof typeof currentUser.profile.apiKeys] && (
                    <p className="text-xs text-red-500 mt-1">
                      API key required. <Link to="/api-settings" className="underline">Configure now</Link>
                    </p>
                  )}
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
                      onChange={(e) => handleSettingChange("style", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="realistic">Realistic</option>
                      <option value="stylized">Stylized</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="organic">Organic</option>
                      <option value="geometric">Geometric</option>
                      <option value="artistic">Artistic</option>
                      <option value="industrial">Industrial</option>
                      <option value="fantasy">Fantasy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complexity
                    </label>
                    <select
                      value={settings.complexity}
                      onChange={(e) => handleSettingChange("complexity", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="simple">Simple (Low poly)</option>
                      <option value="medium">Medium (Balanced)</option>
                      <option value="detailed">Detailed (High poly)</option>
                      <option value="intricate">Intricate (Ultra detail)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Size
                    </label>
                    <select
                      value={settings.size}
                      onChange={(e) => handleSettingChange("size", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="small">Small (5cm)</option>
                      <option value="medium">Medium (10cm)</option>
                      <option value="large">Large (15cm)</option>
                      <option value="xlarge">X-Large (20cm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material Focus
                    </label>
                    <select
                      value={settings.material}
                      onChange={(e) => handleSettingChange("material", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="pla">PLA Optimized</option>
                      <option value="abs">ABS Optimized</option>
                      <option value="petg">PETG Optimized</option>
                      <option value="resin">Resin Optimized</option>
                      <option value="flexible">Flexible Materials</option>
                      <option value="metal">Metal Fill</option>
                      <option value="wood">Wood Fill</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Printability
                    </label>
                    <select
                      value={settings.printability}
                      onChange={(e) => handleSettingChange("printability", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="optimized">Print Optimized</option>
                      <option value="standard">Standard</option>
                      <option value="detailed">Detail Priority</option>
                      <option value="supportFree">Support-free</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hollow Fill: {settings.hollowFill}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={settings.hollowFill}
                      onChange={(e) => handleSettingChange("hollowFill", parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Hollow</span>
                      <span>Solid</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="supports"
                      checked={settings.supports}
                      onChange={(e) => handleSettingChange("supports", e.target.checked)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="supports" className="ml-2 text-sm text-gray-700">
                      Generate with support structures in mind
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGenerating || !prompt.trim() || !title.trim() || 
                    (!useUserApiKey && (freeGenerationsRemaining ?? 0) <= 0) ||
                    (useUserApiKey && generator !== "droid" && !currentUser?.profile?.apiKeys?.[generator as keyof typeof currentUser.profile.apiKeys])}
                  className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? "Generating..." : "Generate 3D Model"}
                </button>
              </form>

              {showEnhancedPrompt && (
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Review Enhanced Prompt</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Our AI has enhanced your prompt for optimal 3D model generation. Please review it before proceeding.
                  </p>
                  <div className="bg-white p-4 rounded-md border border-gray-300 mb-4">
                    <p className="text-sm text-gray-800 font-medium mb-2">Original Prompt:</p>
                    <p className="text-sm text-gray-600 italic mb-4">{originalPrompt}</p>
                    <p className="text-sm text-gray-800 font-medium mb-2">Enhanced Prompt:</p>
                    <textarea
                      value={enhancedPromptText}
                      onChange={(e) => setEnhancedPromptText(e.target.value)}
                      rows={6}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={handleCancelEnhancement}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmGeneration}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? "Confirming..." : "Confirm & Generate"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Model List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Generated Models</h2>
              {userModels && userModels.length > 0 ? (
                <ul className="space-y-4">
                  {userModels.map((model) => (
                    <li key={model._id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {model.imageUrl ? (
                          <img 
                            src={model.imageUrl} 
                            alt={model.title}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/64/64?random=${model._id}`;
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-800">{model.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{model.prompt}</p>
                        <p className="text-xs text-gray-500 mt-1">Status: <span className="font-medium text-orange-600">{model.status}</span></p>
                      </div>
                      <Link to={`/model/${model._id}`} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        View →
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No models generated yet. Start creating!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

