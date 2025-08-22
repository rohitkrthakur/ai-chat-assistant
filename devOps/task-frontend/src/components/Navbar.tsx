import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ListTodo } from "lucide-react";

export default function Navbar() {
  const auth = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3">
          <ListTodo className="text-white" size={28} />
          <span className="font-extrabold text-2xl tracking-tight text-white drop-shadow">
            Task Manager
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {auth?.token ? (
            <button
              onClick={auth.logout}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm border border-white/20"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm border border-white/20"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
          {auth?.token ? (
            <button
              onClick={() => {
                auth.logout();
                setIsOpen(false);
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm border border-white/20"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm border border-white/20"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
