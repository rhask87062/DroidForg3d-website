import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<string[]>(["tips", "featured"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subscribe = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await subscribe({ email, categories });
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (category: string) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-600"
          required
        />
        
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Subscribe to:</p>
          <div className="space-y-1">
            {[
              { id: "tips", label: "3D Printing Tips & Tricks" },
              { id: "featured", label: "Featured Model of the Week" },
              { id: "ai_news", label: "AI Generation Updates" },
              { id: "promotions", label: "Special Offers" },
            ].map((option) => (
              <label key={option.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={categories.includes(option.id)}
                  onChange={() => toggleCategory(option.id)}
                  className="rounded border-gray-700 text-orange-600 focus:ring-orange-600"
                />
                <span className="text-gray-300">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
