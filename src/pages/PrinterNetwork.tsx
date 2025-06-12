import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function PrinterNetwork() {
  const [showApplication, setShowApplication] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "US",
      },
    },
    printerInfo: {
      brand: "",
      model: "",
      yearPurchased: new Date().getFullYear(),
      materials: [] as string[],
      maxBuildVolume: {
        x: 0,
        y: 0,
        z: 0,
      },
      hasEnclosure: false,
      additionalEquipment: [] as string[],
    },
    experience: {
      yearsExperience: 0,
      previousCommercialWork: false,
      specializations: [] as string[],
      portfolioUrls: [] as string[],
    },
    availability: {
      hoursPerWeek: 0,
      preferredSchedule: "",
      vacationPlanning: "",
    },
    motivation: "",
  });

  const submitApplication = useMutation(api.printers.submitPrinterApplication);
  const userApplication = useQuery(api.printers.getUserPrinterApplication);
  const printerStats = useQuery(api.printers.getPrinterStats);
  const activePrinters = useQuery(api.printers.getActivePrinters);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitApplication(formData);
      toast.success("Application submitted successfully! We'll review it within 48 hours.");
      setShowApplication(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    }
  };

  const handleMaterialToggle = (material: string) => {
    setFormData(prev => ({
      ...prev,
      printerInfo: {
        ...prev.printerInfo,
        materials: prev.printerInfo.materials.includes(material)
          ? prev.printerInfo.materials.filter(m => m !== material)
          : [...prev.printerInfo.materials, material]
      }
    }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        specializations: prev.experience.specializations.includes(specialization)
          ? prev.experience.specializations.filter(s => s !== specialization)
          : [...prev.experience.specializations, specialization]
      }
    }));
  };

  if (showApplication) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Our Printer Network</h1>
            <p className="text-xl text-gray-600">
              Become part of the world's first fully automated 3D printing network
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Printer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Printer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Printer Brand *</label>
                    <input
                      type="text"
                      value={formData.printerInfo.brand}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        printerInfo: { ...prev.printerInfo, brand: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                    <input
                      type="text"
                      value={formData.printerInfo.model}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        printerInfo: { ...prev.printerInfo, model: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supported Materials *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["PLA", "ABS", "PETG", "TPU", "Wood Fill", "Metal Fill", "Resin", "Nylon"].map((material) => (
                      <label key={material} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.printerInfo.materials.includes(material)}
                          onChange={() => handleMaterialToggle(material)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of 3D Printing Experience *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.experience.yearsExperience}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        experience: { ...prev.experience, yearsExperience: parseInt(e.target.value) }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.experience.previousCommercialWork}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        experience: { ...prev.experience, previousCommercialWork: e.target.checked }
                      }))}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Previous commercial 3D printing work</label>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Miniatures", "Prototypes", "Functional Parts", "Art/Decorative", "Jewelry", "Medical", "Automotive", "Aerospace"].map((spec) => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.experience.specializations.includes(spec)}
                          onChange={() => handleSpecializationToggle(spec)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours per week available *</label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={formData.availability.hoursPerWeek}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        availability: { ...prev.availability, hoursPerWeek: parseInt(e.target.value) }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Schedule</label>
                    <select
                      value={formData.availability.preferredSchedule}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        availability: { ...prev.availability, preferredSchedule: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select schedule</option>
                      <option value="flexible">Flexible</option>
                      <option value="weekdays">Weekdays only</option>
                      <option value="weekends">Weekends only</option>
                      <option value="evenings">Evenings</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to join our printer network? *
                </label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Tell us about your motivation to join our automated network..."
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowApplication(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Global Printer Network</h1>
          <p className="text-xl text-gray-600">
            The world's first fully automated distributed 3D printing network
          </p>
        </div>

        {/* Network Stats */}
        {printerStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{printerStats.activePrinters}</div>
              <div className="text-gray-600">Active Printers</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{Object.keys(printerStats.printersByCountry).length}</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{printerStats.totalCompletedOrders}</div>
              <div className="text-gray-600">Orders Completed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{printerStats.averageRating.toFixed(1)}</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        )}

        {/* Application Status or CTA */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          {userApplication ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Application Status</h2>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                userApplication.status === "approved" ? "bg-green-100 text-green-800" :
                userApplication.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {userApplication.status.charAt(0).toUpperCase() + userApplication.status.slice(1)}
              </div>
              <p className="text-gray-600 mt-4">
                {userApplication.status === "pending" && "We're reviewing your application. You'll hear from us within 48 hours."}
                {userApplication.status === "approved" && "Congratulations! You're now part of our printer network."}
                {userApplication.status === "rejected" && "Unfortunately, your application wasn't approved this time. You can reapply in 30 days."}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Network</h2>
              <p className="text-gray-600 mb-6">
                Earn money by providing 3D printing services through our fully automated platform
              </p>
              <button
                onClick={() => setShowApplication(true)}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Apply to Join Network
              </button>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Our DROID Network Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Automated Assignment</h3>
              <p className="text-gray-600">Our AI automatically assigns orders to the nearest qualified printer based on capabilities and location.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Competitive Earnings</h3>
              <p className="text-gray-600">Earn 60-80% commission on each print job with transparent pricing and instant payments.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Overhead</h3>
              <p className="text-gray-600">No marketing, customer service, or business development required. Just print and earn.</p>
            </div>
          </div>
        </div>

        {/* Commission Structure */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Commission Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Standard Materials</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>PLA, ABS, PETG:</span>
                  <span className="font-semibold">70% commission</span>
                </div>
                <div className="flex justify-between">
                  <span>TPU, Flexible:</span>
                  <span className="font-semibold">75% commission</span>
                </div>
                <div className="flex justify-between">
                  <span>Wood/Metal Fill:</span>
                  <span className="font-semibold">80% commission</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Services</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Resin Printing:</span>
                  <span className="font-semibold">75% commission</span>
                </div>
                <div className="flex justify-between">
                  <span>Multi-color:</span>
                  <span className="font-semibold">80% commission</span>
                </div>
                <div className="flex justify-between">
                  <span>Rush Orders:</span>
                  <span className="font-semibold">85% commission</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              * Commissions are calculated after material costs and platform fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
