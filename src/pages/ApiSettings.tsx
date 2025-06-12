import { useState, useEffect } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function ApiSettings() {
  const [apiKeys, setApiKeys] = useState({
    meshy: "",
    tripo: "",
    ai3dStudio: "",
    neroic: "",
    alpha3d: "",
    sloyd: "",
    ponzu: "",
    openai: "",
    stability: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const updateApiKeys = useMutation(api.users.updateApiKeys);
  const testApiKey = useAction(api.models.testApiConnection);
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser?.profile?.apiKeys) {
      setApiKeys(prev => ({
        ...prev,
        ...currentUser.profile!.apiKeys,
      }));
    }
  }, [currentUser]);

  const handleApiKeyChange = (service: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateApiKeys({ apiKeys });
      toast.success("API keys saved successfully!");
    } catch (error) {
      toast.error("Failed to save API keys");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (service: string) => {
    if (!apiKeys[service as keyof typeof apiKeys]) {
      toast.error("Please enter an API key first");
      return;
    }

    try {
      const result = await testApiKey({ 
        service, 
        apiKey: apiKeys[service as keyof typeof apiKeys] 
      });
      setTestResults(prev => ({ ...prev, [service]: result.status }));
      toast.success(`${service} connection test successful!`);
    } catch (error) {
      setTestResults(prev => ({ ...prev, [service]: "failed" }));
      toast.error(`${service} connection test failed`);
    }
  };

  const apiServices = [
    {
      key: "meshy",
      name: "Meshy",
      description: "High-quality 3D model generation from text and images",
      website: "https://meshy.ai",
      pricing: "Free tier: 200 credits/month, Pro: $20/month",
      features: ["Text to 3D", "Image to 3D", "High quality meshes", "Fast generation"]
    },
    {
      key: "tripo",
      name: "Tripo AI",
      description: "Advanced 3D model generation with excellent detail",
      website: "https://tripo3d.ai",
      pricing: "Free tier: 10 generations/day, Pro: $30/month",
      features: ["Text to 3D", "Image to 3D", "Animation support", "High resolution"]
    },
    {
      key: "ai3dStudio",
      name: "3D AI Studio",
      description: "Professional 3D model generation platform",
      website: "https://3daistudio.com",
      pricing: "Free tier: 5 generations/month, Pro: $25/month",
      features: ["Text to 3D", "Style control", "Professional quality", "Batch processing"]
    },
    {
      key: "neroic",
      name: "Neroic",
      description: "AI-powered 3D content creation",
      website: "https://neroic.com",
      pricing: "Contact for pricing",
      features: ["Custom models", "Enterprise features", "API access", "High volume"]
    },
    {
      key: "alpha3d",
      name: "Alpha3D",
      description: "Generative AI platform for 3D digital assets",
      website: "https://alpha3d.io",
      pricing: "Free tier: 10 generations/month, Pro: $40/month",
      features: ["Text to 3D", "Asset optimization", "Game-ready models", "AR/VR support"]
    },
    {
      key: "sloyd",
      name: "Sloyd",
      description: "Real-time 3D model generation for games and apps",
      website: "https://sloyd.ai",
      pricing: "Free tier: 100 generations/month, Pro: $15/month",
      features: ["Real-time generation", "Game assets", "Customizable", "Unity integration"]
    },
    {
      key: "ponzu",
      name: "Ponzu (Self-hosted)",
      description: "Open-source 3D model generation (requires local setup)",
      website: "https://github.com/ponzu-cms/ponzu",
      pricing: "Free (self-hosted)",
      features: ["Open source", "Self-hosted", "Customizable", "No API limits"]
    },
    {
      key: "openai",
      name: "OpenAI (Enhancement)",
      description: "Used for prompt enhancement and optimization",
      website: "https://openai.com",
      pricing: "Pay per use",
      features: ["Prompt enhancement", "Description optimization", "Quality improvement"]
    },
    {
      key: "stability",
      name: "Stability AI",
      description: "Stable Diffusion 3D and image generation",
      website: "https://stability.ai",
      pricing: "Free tier: 25 generations/month, Pro: $20/month",
      features: ["Stable Diffusion 3D", "High quality", "Consistent results", "Fast generation"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Settings</h1>
          <p className="text-xl text-gray-600">
            Configure your 3D generation service API keys
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🔑 API Key Management</h2>
            <p className="text-gray-600">
              Add your API keys to unlock unlimited generations and access premium features.
              Your keys are encrypted and stored securely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {apiServices.map((service) => (
              <div key={service.key} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  {testResults[service.key] && (
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      testResults[service.key] === "success" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {testResults[service.key] === "success" ? "✓ Connected" : "✗ Failed"}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKeys[service.key as keyof typeof apiKeys] || ""}
                      onChange={(e) => handleApiKeyChange(service.key, e.target.value)}
                      placeholder={`Enter your ${service.name} API key...`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <button
                      onClick={() => handleTestConnection(service.key)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Test
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pricing:</span>
                    <span className="font-medium">{service.pricing}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {service.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2">
                    <a 
                      href={service.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 text-sm"
                    >
                      Get API Key →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save API Keys"}
            </button>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Usage Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Start with free tiers to test quality</li>
                <li>• Use multiple services for different use cases</li>
                <li>• Monitor your usage to avoid overages</li>
                <li>• Keep API keys secure and rotate regularly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Recommendations</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Meshy:</strong> Best for beginners and general use</li>
                <li>• <strong>Tripo:</strong> Highest quality for professional work</li>
                <li>• <strong>Sloyd:</strong> Perfect for game development</li>
                <li>• <strong>Alpha3D:</strong> Great for AR/VR applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
