import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignInForm } from "./SignInForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AboutUs } from "./pages/AboutUs";
import { Contact } from "./pages/Contact";
import { Blog } from "./pages/Blog";
import { Gallery } from "./pages/Gallery";
import { ReusableGallery } from "./pages/ReusableGallery";
import { ModelGenerator } from "./pages/ModelGenerator";
import { ConceptGenerator } from "./pages/ConceptGenerator";
import { OrderSystem } from "./pages/OrderSystem";
import { ProcessTracking } from "./pages/ProcessTracking";
import { PrinterNetwork } from "./pages/PrinterNetwork";
import { Dashboard } from "./pages/Dashboard";
import { MeetDroid } from "./pages/MeetDroid";
import { MeetForge } from "./pages/MeetForge";
import { ApiSettings } from "./pages/ApiSettings";
import { SplashPage } from "./pages/SplashPage";
import { EnhancedSplashPage } from "./pages/EnhancedSplashPage";
import { SplashRouter } from "./components/SplashRouter";
import { VisitTracker } from "./lib/visitTracker";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

function App() {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user should see splash page
    const shouldShow = VisitTracker.shouldShowSplash();
    setShowSplash(shouldShow);
    
    if (shouldShow) {
      // Increment visit count for this session
      VisitTracker.incrementVisitCount();
    }
  }, []);

  // Show loading while determining splash page visibility
  if (showSplash === null) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </main>
    );
  }

  // Always use Router and Routes, redirect to /splash if splash is needed
  return (
    <main className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          {/* Splash screen route */}
          <Route path="/splash" element={
            <SplashRouter>
              <EnhancedSplashPage />
            </SplashRouter>
          } />

          {/* Main app routes */}
          <Route path="/*" element={
            <>
              <AuthLoading>
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
                </div>
              </AuthLoading>
              <Unauthenticated>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                  <SignInForm />
                </div>
              </Unauthenticated>
              <Authenticated>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/gallery" element={<Gallery />} />
                      <Route path="/reusable-gallery" element={<ReusableGallery />} />
                      <Route path="/concept-generator" element={<ConceptGenerator />} />
                      <Route path="/model-generator" element={<ModelGenerator />} />
                      <Route path="/order" element={<OrderSystem />} />
                      <Route path="/tracking/:orderId" element={<ProcessTracking />} />
                      <Route path="/printer-network" element={<PrinterNetwork />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/meet-droid" element={<MeetDroid />} />
                      <Route path="/meet-forge" element={<MeetForge />} />
                      <Route path="/api-settings" element={<ApiSettings />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Authenticated>
            </>
          } />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </main>
  );
}

export default App;

