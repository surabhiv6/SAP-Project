import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  PackagePlus,
  GitFork,
  ArrowRightLeft,
  CheckCircle2,
  Boxes,
  ClockAlert,
  ThermometerSnowflake,
  MapPin,
  Truck,
  Navigation,
  AlertTriangle,
  RotateCcw,
  ClipboardCheck,
  BarChart3,
  Sliders,
  Leaf,
} from 'lucide-react';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile?: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, risks, products, feederState } = useApp();

  const activeRiskCount = risks.filter(r => r.status === 'active').length;
  const unsortedCount = products.filter(p => p.sortedStatus === 'unsorted').length;
  const hopperQueueCount = feederState.queue.length;

  const sections: NavSection[] = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'receiving', label: 'Product Receiving', icon: PackagePlus, badge: unsortedCount > 0 ? unsortedCount : undefined },
        { id: 'inventory', label: 'Batch & Inventory', icon: Boxes },
      ],
    },
    {
      title: 'Sorting & Inspection',
      items: [
        { id: 'sorting', label: 'Smart Sorting Machine', icon: GitFork },
        { id: 'feeder', label: 'Automatic Feeding', icon: ArrowRightLeft, badge: hopperQueueCount > 0 ? hopperQueueCount : undefined },
        { id: 'inspection', label: 'Quality Inspection', icon: CheckCircle2 },
        { id: 'expiry', label: 'Expiry & Remaining Life', icon: ClockAlert },
      ],
    },
    {
      title: 'Storage & Logistics',
      items: [
        { id: 'storage', label: 'Storage Monitoring', icon: ThermometerSnowflake },
        { id: 'destination', label: 'Destination Planner', icon: MapPin },
        { id: 'loading', label: 'Smart Loading', icon: Truck },
        { id: 'trucks', label: 'Truck Monitoring', icon: Navigation },
      ],
    },
    {
      title: 'Resilience & Analysis',
      items: [
        { id: 'risks', label: 'Risk Detection', icon: AlertTriangle, badge: activeRiskCount > 0 ? activeRiskCount : undefined },
        { id: 'recovery', label: 'Recovery Centre', icon: RotateCcw },
        { id: 'delivery', label: 'Delivery Management', icon: ClipboardCheck },
        { id: 'sustainability', label: 'Sustainability Reports', icon: BarChart3 },
        { id: 'settings', label: 'System Settings', icon: Sliders },
      ],
    },
  ];

  const handleSelect = (tab: NavTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-neutral-200/90 flex flex-col transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-neutral-200/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-neutral-900 text-sm tracking-tight leading-none">
              GREEN RESILIENCE
            </div>
            <div className="text-[10px] text-emerald-800 font-semibold tracking-wider uppercase mt-1">
              Multi-Product AI Core
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((sec, sIdx) => (
          <div key={sIdx}>
            <div className="px-3 mb-1 text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
              {sec.title}
            </div>
            <nav className="space-y-0.5">
              {sec.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-700' : 'text-neutral-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                          item.id === 'risks'
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3.5 border-t border-neutral-200/90 bg-neutral-50/70 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span className="truncate">Local Storage Model</span>
          <span className="font-mono text-emerald-700 font-medium">Ready</span>
        </div>
      </div>
    </aside>
  );
};
