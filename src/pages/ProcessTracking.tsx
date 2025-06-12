import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

export function ProcessTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = useQuery(api.orders.getOrderById, { 
    orderId: orderId as Id<"orders"> 
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
            <p className="text-gray-600 mt-2">Please check your order number and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const productionSteps = order.productionSteps || [
    { step: "Order Received", status: "completed", timestamp: order._creationTime, details: "Order confirmed and payment processed" },
    { step: "AI Processing", status: order.status === "paid" ? "in_progress" : "pending", timestamp: Date.now(), details: "DROID AI analyzing model requirements" },
    { step: "Printer Assignment", status: "pending", timestamp: 0, details: "Selecting optimal printer from global network" },
    { step: "Production Queue", status: "pending", timestamp: 0, details: "Added to automated production queue" },
    { step: "3D Printing", status: "pending", timestamp: 0, details: "Physical production in progress" },
    { step: "Quality Control", status: "pending", timestamp: 0, details: "Automated quality verification" },
    { step: "Packaging", status: "pending", timestamp: 0, details: "Automated packaging and labeling" },
    { step: "Shipped", status: "pending", timestamp: 0, details: "Package dispatched for delivery" },
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "in_progress":
        return (
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Tracking</h1>
          <p className="text-xl text-gray-600">
            Real-time visibility into your automated production process
          </p>
          <div className="mt-4 bg-white rounded-lg p-4 inline-block shadow-sm">
            <span className="text-sm text-gray-500">Order Number: </span>
            <span className="font-semibold text-gray-900">{order.orderNumber}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Production Timeline</h2>
            <div className="text-sm text-gray-500">
              Powered by DROID Automation
            </div>
          </div>

          <div className="space-y-6">
            {productionSteps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${
                      step.status === "completed" ? "text-green-700" :
                      step.status === "in_progress" ? "text-orange-700" :
                      "text-gray-500"
                    }`}>
                      {step.step}
                    </h3>
                    {step.timestamp > 0 && (
                      <span className="text-sm text-gray-500">
                        {new Date(step.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{step.details}</p>
                  {step.status === "in_progress" && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Highlights */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🤖 Fully Automated Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI-powered model optimization
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Automated printer selection
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Real-time quality monitoring
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Zero human intervention required
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Global network optimization
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sustainable cost structure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
