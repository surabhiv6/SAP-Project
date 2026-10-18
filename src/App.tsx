/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PrototypeDisclaimerModal } from './components/common/PrototypeDisclaimerModal';

import { DashboardView } from './views/DashboardView';
import { ProductReceivingView } from './views/ProductReceivingView';
import { SmartSortingView } from './views/SmartSortingView';
import { AutomaticFeedingView } from './views/AutomaticFeedingView';
import { QualityInspectionView } from './views/QualityInspectionView';
import { BatchInventoryView } from './views/BatchInventoryView';
import { ExpiryMonitoringView } from './views/ExpiryMonitoringView';
import { StorageChamberView } from './views/StorageChamberView';
import { DestinationPlannerView } from './views/DestinationPlannerView';
import { SmartLoadingView } from './views/SmartLoadingView';
import { TruckMonitoringView } from './views/TruckMonitoringView';
import { RiskDetectionView } from './views/RiskDetectionView';
import { RecoveryCentreView } from './views/RecoveryCentreView';
import { DeliveryManagementView } from './views/DeliveryManagementView';
import { SustainabilityReportsView } from './views/SustainabilityReportsView';
import { SystemSettingsView } from './views/SystemSettingsView';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'receiving':
        return <ProductReceivingView />;
      case 'sorting':
        return <SmartSortingView />;
      case 'feeder':
        return <AutomaticFeedingView />;
      case 'inspection':
        return <QualityInspectionView />;
      case 'inventory':
        return <BatchInventoryView />;
      case 'expiry':
        return <ExpiryMonitoringView />;
      case 'storage':
        return <StorageChamberView />;
      case 'destination':
        return <DestinationPlannerView />;
      case 'loading':
        return <SmartLoadingView />;
      case 'trucks':
        return <TruckMonitoringView />;
      case 'risks':
        return <RiskDetectionView />;
      case 'recovery':
        return <RecoveryCentreView />;
      case 'delivery':
        return <DeliveryManagementView />;
      case 'sustainability':
        return <SustainabilityReportsView />;
      case 'settings':
        return <SystemSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/70 flex flex-col lg:flex-row antialiased">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpenMobile && (
        <div
          onClick={() => setSidebarOpenMobile(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpenMobile}
        onCloseMobile={() => setSidebarOpenMobile(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpenMobile(prev => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Global Footer */}
        <footer className="px-6 py-4 border-t border-neutral-200/90 text-xs text-neutral-500 bg-white flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-[11px] text-neutral-500">
            GREEN RESILIENCE AI · Student Innovation Project Demonstration Prototype
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Multi-Product Supply Chain Architecture</span>
            <span aria-hidden="true">·</span>
            <span>7 Product Categories</span>
          </div>
        </footer>
      </div>

      {/* Disclosures & Architecture Limitations Modal */}
      <PrototypeDisclaimerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
