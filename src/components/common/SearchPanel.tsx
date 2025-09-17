import React from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  SearchRegular,
  DismissRegular,
} from '@fluentui/react-icons';

export interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const useStyles = makeStyles({
  searchPanel: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100vh',
    backgroundColor: '#ffffff',
    borderLeft: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
  },
  searchPanelHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchPanelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1b1b1b',
  },
  searchPanelContent: {
    flex: 1,
    padding: '20px',
    overflow: 'auto',
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
  searchInputContainer: {
    position: 'relative',
    marginBottom: '20px',
  },
  globalSearchInput: {
    width: 'calc(100% - 100px)',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '4px',
    padding: '12px 40px 12px 16px',
    fontSize: '14px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#1b1b1b',
    outline: 'none',
  },
  searchInputIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#605e5c',
    fontSize: '16px',
  },
  searchFilter: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e3f2fd',
    color: '#0078d4',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  searchEmptyState: {
    textAlign: 'center',
    marginTop: '80px',
    color: '#605e5c',
  },
  closeButton: {
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
});

export const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
}) => {
  const styles = useStyles();

  if (!isOpen) return null;

  return (
    <div className={styles.searchPanel}>
      <div className={styles.searchPanelHeader}>
        <div className={styles.searchPanelTitle}>Find in BMS</div>
        <div 
          className={styles.closeButton}
          onClick={onClose}
        >
          <DismissRegular style={{ fontSize: '16px' }} />
        </div>
      </div>
      
      <div className={styles.searchPanelContent}>
        <div className={styles.searchInputContainer}>
          <SearchRegular className={styles.searchInputIcon} />

          <input
            className={styles.globalSearchInput}
            type="text"
            placeholder="Enter a search keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#0078d4'}
            onBlur={(e) => e.target.style.borderColor = tokens.colorNeutralStroke1}
            autoFocus
          />
        </div>
        
        <div className={styles.searchFilter}>
          BMS Documents
        </div>
        
        <div className={styles.searchEmptyState}>
          <img 
            src="/src/assets/search-keywords-l-standard.svg" 
            alt="Search" 
            style={{ 
              width: '120px', 
              height: '120px', 
              marginBottom: '16px',
              opacity: 0.8
            }} 
          />
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Search in this BMS
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
            Find documents, sites, and approvals shared in this BMS system.
          </div>
        </div>
      </div>
    </div>
  );
};
