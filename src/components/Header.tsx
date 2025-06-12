import { Link, useLocation } from "react-router-dom";
import { SignOutButton } from "../SignOutButton";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DF</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DROIDFORG3D</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/concept-generator"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/concept-generator") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Concept Images
            </Link>
            <Link
              to="/model-generator"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/model-generator") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              3D Generator
            </Link>
            <Link
              to="/gallery"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/gallery") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/order"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/order") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Order
            </Link>
            <Link
              to="/printer-network"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/printer-network") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Network
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/dashboard") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/api-settings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/api-settings") 
                  ? "text-orange-600 bg-orange-50" 
                  : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
              }`}
            >
              API Settings
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
