import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SearchPanel } from './SearchPanel';
import {
  makeStyles,
} from '@fluentui/react-components';

export interface LayoutProps {
  children: React.ReactNode;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden', // Prevent window overflow
  },
  mainContent: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    minWidth: 0, // Allow flex shrinking
    overflow: 'hidden', // Prevent content overflow
  },
  content: {
    flex: '1',
    padding: '32px',
    overflow: 'auto', // Content area scrollable
    backgroundColor: '#fff',
    minHeight: 0, // Allow flex shrinking
    // Custom scrollbar styling
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#c1c1c1',
      borderRadius: '3px',
      border: 'none',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#a8a8a8',
    },
    '&::-webkit-scrollbar-thumb:active': {
      backgroundColor: '#8e8e8e',
    },
    // Firefox scrollbar
    scrollbarWidth: 'thin',
    scrollbarColor: '#c1c1c1 transparent',
  },
});

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return 'Dashboard';
    case '/approvers':
      return 'Document Approvers';
    case '/analytics':
      return 'Analytics & Reports';
    case '/approvals':
      return 'My Approvals';
    case '/sites':
      return 'BMS Sites';
    default:
      // Handle site detail pages
      if (pathname.startsWith('/sites/')) {
        return 'Site Details';
      }
      return 'BMS Teams App';
  }
};

const getSelectedMenuItem = (pathname: string) => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return 'home';
    case '/approvers':
      return 'approvers';
    case '/analytics':
      return 'metrics';
    case '/approvals':
      return 'approvals';
    case '/sites':
      return 'all-sites';
    default:
      // Handle site detail pages - extract site ID for sidebar selection
      if (pathname.startsWith('/sites/')) {
        const siteId = pathname.split('/')[2];
        return siteId || 'home';
      }
      return 'home';
  }
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const styles = useStyles();
  const location = useLocation();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [siteSearchQuery, setSiteSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const currentPage = getSelectedMenuItem(location.pathname);
  const pageTitle = getPageTitle(location.pathname);

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSiteSearchQuery('');
    }
  };

  const toggleGlobalSearch = () => {
    setIsGlobalSearchOpen(!isGlobalSearchOpen);
    if (!isGlobalSearchOpen) {
      setGlobalSearchQuery('');
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar
        selectedMenuItem={currentPage}
        isSearchActive={isSearchActive}
        onToggleSearch={toggleSearch}
        siteSearchQuery={siteSearchQuery}
        onSiteSearchChange={setSiteSearchQuery}
      />

      <div className={styles.mainContent}>
        <Header
          title={pageTitle}
          onSearchClick={toggleGlobalSearch}
        />
        
        <div className={styles.content}>
          {children}
        </div>
      </div>

      <SearchPanel
        isOpen={isGlobalSearchOpen}
        onClose={toggleGlobalSearch}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
      />
    </div>
  );
};
