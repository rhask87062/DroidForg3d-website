import { useState, useEffect } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// You'll need to set your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here");

function CheckoutForm({ 
  orderData, 
  pricing, 
  onSuccess 
}: { 
  orderData: any; 
  pricing: any; 
  onSuccess: () => void; 
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  
  const createPaymentIntent = useAction(api.payments.createPaymentIntent);
  const createOrder = useMutation(api.orders.createOrder);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const result = await createPaymentIntent({
          amount: Math.round(pricing.total * 100), // Convert to cents
          orderData,
        });
        setClientSecret(result.clientSecret);
      } catch (error) {
        toast.error("Failed to initialize payment");
      }
    };

    if (pricing && orderData) {
      initializePayment();
    }
  }, [pricing, orderData]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        // Create the order in our backend
        await createOrder({
          ...orderData,
          stripePaymentIntentId: paymentIntent.id,
        });
        
        toast.success("Payment successful! Your order has been placed.");
        onSuccess();
      }
    } catch (error) {
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="bg-white p-4 rounded border">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${pricing.total}`}
      </button>
    </form>
  );
}

export function OrderSystem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reusedModelId = searchParams.get("reuse");
  
  const [selectedModel, setSelectedModel] = useState<string>(reusedModelId || "");
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("medium");
  const [material, setMaterial] = useState("pla");
  const [color, setColor] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });
  const [timelapseOptIn, setTimelapseOptIn] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const userModels = useQuery(api.models.getUserModels);
  const reusableModels = useQuery(api.models.getReusableModels, {});
  const pricing = useQuery(api.orders.calculatePricing, {
    type: "ai_generation",
    size,
    material,
    quantity,
    isReusedModel: !!reusedModelId,
  });

  const selectedModelData = reusedModelId 
    ? reusableModels?.find(m => m._id === reusedModelId)
    : userModels?.find(m => m._id === selectedModel);

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToCheckout = () => {
    if (!selectedModel || !shippingAddress.name || !shippingAddress.address1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    setShowCheckout(true);
  };

  const orderData = {
    items: [{
      type: "ai_generation",
      modelId: selectedModel as any,
      quantity,
      size,
      material,
      color,
      price: pricing?.unitPrice || 0,
      isReusedModel: !!reusedModelId,
    }],
    subtotal: pricing?.subtotal || 0,
    tax: pricing?.tax || 0,
    shipping: pricing?.shipping || 0,
    total: pricing?.total || 0,
    shippingAddress,
    timelapseOptIn,
  };

  const handlePaymentSuccess = () => {
    navigate("/dashboard");
  };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Order</h1>
            <p className="text-gray-600">Secure payment powered by Stripe</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {selectedModelData && (
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-gray-900">{selectedModelData.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedModelData.prompt}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="capitalize">{size}</span> • {material.toUpperCase()} • Qty: {quantity}
                    {color && <span> • Color: {color}</span>}
                  </div>
                </div>
              )}

              {pricing && (
                <div className="space-y-2 text-sm">
                  {!reusedModelId && (
                    <div className="flex justify-between">
                      <span>AI Generation Fee:</span>
                      <span>${pricing.generationFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Print Cost ({quantity}x):</span>
                    <span>${(pricing.subtotal - (reusedModelId ? 0 : pricing.generationFee)).toFixed(2)}</span>
                  </div>
                  {reusedModelId && pricing.savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings (30% off):</span>
                      <span>-${pricing.savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${pricing.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{pricing.shipping === 0 ? "FREE" : `$${pricing.shipping}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${pricing.total}</span>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                <div className="text-sm text-gray-600">
                  <p>{shippingAddress.name}</p>
                  <p>{shippingAddress.address1}</p>
                  {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                  <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p>{shippingAddress.country}</p>
                </div>
                
                {timelapseOptIn && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">
                        Timelapse video included (FREE)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  orderData={orderData}
                  pricing={pricing}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ← Back to order details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order 3D Print</h1>
          <p className="text-xl text-gray-600">
            Turn your AI-generated models into physical reality
          </p>
          {reusedModelId && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto">
              <span className="text-green-800 font-semibold">30% Off Reusable Model!</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Model
              </label>
              {reusedModelId ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">
                    {reusableModels?.find(m => m._id === reusedModelId)?.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {reusableModels?.find(m => m._id === reusedModelId)?.prompt}
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Reusable Model - 30% Off
                  </span>
                </div>
              ) : (
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Choose a model...</option>
                  {userModels?.filter(m => m.status === 'completed').map((model) => (
                    <option key={model._id} value={model._id}>
                      {model.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="small">Small (5cm) - ${pricing?.basePrice || 0}</option>
                  <option value="medium">Medium (10cm) - ${pricing?.basePrice || 0}</option>
                  <option value="large">Large (15cm) - ${pricing?.basePrice || 0}</option>
                  <option value="xlarge">X-Large (20cm) - ${pricing?.basePrice || 0}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="pla">PLA (Standard)</option>
                  <option value="abs">ABS (Durable)</option>
                  <option value="petg">PETG (Chemical Resistant)</option>
                  <option value="tpu">TPU (Flexible)</option>
                  <option value="wood">Wood Fill</option>
                  <option value="metal">Metal Fill</option>
                  <option value="resin">Resin (High Detail)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color (Optional)
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Red, Blue, Custom"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address1}
                    onChange={(e) => handleAddressChange('address1', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.address2}
                    onChange={(e) => handleAddressChange('address2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Print Options</h3>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="timelapse"
                  checked={timelapseOptIn}
                  onChange={(e) => setTimelapseOptIn(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <label htmlFor="timelapse" className="text-sm font-medium text-gray-900">
                    Include timelapse video of printing process (FREE)
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Get a cool timelapse video showing your model being printed!
                  </p>
                </div>
              </div>
            </div>

            {pricing && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  {!reusedModelId && (
                    <div className="flex justify-between">
                      <span>AI Generation Fee:</span>
                      <span>${pricing.generationFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Print Cost:</span>
                    <span>${pricing.discountedPrice.toFixed(2)} x {quantity}</span>
                  </div>
                  {reusedModelId && pricing.savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings (30% off):</span>
                      <span>-${pricing.savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${pricing.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{pricing.shipping === 0 ? "FREE" : `$${pricing.shipping}`}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${pricing.total}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={!selectedModel}
              className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
