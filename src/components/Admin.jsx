import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Users, Package, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function Admin() {
  // Define base and active styles for NavLink for the new sidebar layout
  const navLinkBaseClasses = "flex items-center gap-4 text-md font-medium px-4 py-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const getNavLinkClasses = ({ isActive }) =>
    `${navLinkBaseClasses} ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-700'
    }`;

  return (
    <div className="flex min-h-screen bg-gray-100/50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white shadow-lg flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-20 border-b">
            <LayoutDashboard className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4">
            <ul className="space-y-3">
                <li>
                    <NavLink to="/admin" end className={getNavLinkClasses}>
                        <Users size={20} />
                        <span>Users</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/products" className={getNavLinkClasses}>
                        <Package size={20} />
                        <span>Products</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/orders" className={getNavLinkClasses}>
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </NavLink>
                </li>
            </ul>
        </nav>

        {/* Sidebar Footer (Optional) */}
        <div className="p-4 border-t">
            <p className="text-center text-xs text-gray-500">&copy; 2025 Homera</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <div className="w-full h-full">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
