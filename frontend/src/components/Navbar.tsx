import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../slices/authSlice';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
            LegalDoc
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/templates" className="text-gray-700 hover:text-blue-600">
              Templates
            </Link>
            <Link to="/settings" className="text-gray-700 hover:text-blue-600">
              Settings
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <UserCircleIcon className="w-6 h-6 text-gray-700" />
              <span className="text-gray-700">{user?.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/dashboard" className="block py-2 text-gray-700">
              Dashboard
            </Link>
            <Link to="/templates" className="block py-2 text-gray-700">
              Templates
            </Link>
            <Link to="/settings" className="block py-2 text-gray-700">
              Settings
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
