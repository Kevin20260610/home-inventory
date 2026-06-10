import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  MapPin,
  Tags,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/items', label: '物品管理', icon: Package },
  { path: '/locations', label: '位置管理', icon: MapPin },
  { path: '/categories', label: '分类管理', icon: Tags },
  { path: '/search', label: '搜索', icon: Search },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-surface shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-40
          transform transition-transform duration-300 ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-text-primary">
                  家庭物品
                </h1>
                <p className="text-xs text-text-secondary">管理系统</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary hover:bg-background hover:text-text-primary'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-text-secondary text-center">
              HomeInventory v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
