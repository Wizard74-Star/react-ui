import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { getActiveBMSSites } from '../../data/bmsSites';
import {
  Text,
  makeStyles,
  tokens,
  Divider,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Badge,
  Tooltip,
  Button,
} from '@fluentui/react-components';
import {
  SignOutRegular,
  PeopleRegular,
  CheckmarkCircleRegular,
  HomeRegular,
  PersonRegular,
  SearchRegular,
  ChevronRightRegular,
  ChevronDownRegular,
  ChevronDownRegular as ExpandMoreRegular,
  ChevronUpRegular,
} from '@fluentui/react-icons';

export interface SidebarProps {
  selectedMenuItem: string;
  isSearchActive: boolean;
  onToggleSearch: () => void;
  siteSearchQuery: string;
  onSiteSearchChange: (query: string) => void;
}

const useStyles = makeStyles({
  sidebar: {
    width: '280px',
    backgroundColor: '#F5F5F5',
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: '100vh', // Fixed height to viewport
    overflow: 'hidden', // Prevent sidebar overflow
  },
  sidebarHeader: {
    padding: '8px 20px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: '#F5F5F5',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // Keep header anchored
  },
  sidebarNav: {
    flex: '1',
    padding: tokens.spacingVerticalM,
    overflow: 'auto', // Make navigation scrollable
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
  sidebarFooter: {
    padding: tokens.spacingVerticalL,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    flexShrink: 0, // Keep footer anchored
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: '12px 20px',
    backgroundColor: '#F5F5F5',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    margin: '0',
    flexShrink: 0, // Keep search container anchored
  },
  searchInput: {
    width: '100%',
    border: 'none',
    borderBottom: '2px solid #0078d4',
    backgroundColor: 'transparent',
    padding: '8px 0',
    fontSize: '14px',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#1b1b1b',
    outline: 'none',
    '::placeholder': {
      color: '#605e5c',
      fontSize: '14px',
    },
    ':focus': {
      borderBottomColor: '#0078d4',
    },
  },
  searchIcon: {
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  searchIconActive: {
    backgroundColor: '#e3f2fd',
    color: '#0078d4',
  },
  siteNameText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '180px',
  },
  showMoreButton: {
    width: '100%',
    justifyContent: 'center',
    marginTop: '8px',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: '500',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  sectionContent: {
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
  },
  chevronIcon: {
    transition: 'transform 0.2s ease',
    fontSize: '12px',
  },
  chevronRotated: {
    transform: 'rotate(90deg)',
  },
  siteItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  siteItemSelected: {
    backgroundColor: '#e3f2fd',
    borderLeft: `3px solid #0078d4`,
    paddingLeft: '9px',
    '&:hover': {
      backgroundColor: '#e3f2fd',
    },
  },
});

// BMS Sites data for filtering
const bmsSites = getActiveBMSSites().map(site => ({
  id: site.id,
  name: site.name,
  avatar: site.avatar,
  color: site.color
}));

export const Sidebar: React.FC<SidebarProps> = ({
  selectedMenuItem,
  isSearchActive,
  onToggleSearch,
  siteSearchQuery,
  onSiteSearchChange,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const styles = useStyles();
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    documentManagement: false,
    bmsSites: false,
  });
  const [showMoreSites, setShowMoreSites] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const handleMenuItemSelect = (itemId: string) => {
    // Navigate to the appropriate route for main navigation items
    switch (itemId) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'approvals':
        navigate('/approvals');
        break;
      case 'metrics':
        navigate('/analytics');
        break;
      case 'approvers':
        navigate('/approvers');
        break;
      default:
        // For site selections, navigate to site detail page
        if (itemId.startsWith('governance-') || itemId.startsWith('staffing-') || 
            itemId.startsWith('construction-') || itemId.startsWith('quality-') || 
            itemId.startsWith('work-health-') || itemId.startsWith('environmental-') || 
            itemId.startsWith('business-') || itemId.startsWith('finance-') || 
            itemId.startsWith('it-') || itemId.startsWith('training-')) {
          navigate(`/sites/${itemId}`);
        } else if (itemId === 'all-sites') {
          navigate('/sites');
        } else {
          console.log('Selected item:', itemId);
        }
        break;
    }
  };

  const filteredSites = bmsSites.filter(site => 
    site.name.toLowerCase().includes(siteSearchQuery.toLowerCase()) ||
    site.avatar.toLowerCase().includes(siteSearchQuery.toLowerCase())
  );

  // Show only 5 sites initially, or all if "Show more" is clicked
  const displayedSites = showMoreSites ? filteredSites : filteredSites.slice(0, 5);
  const hasMoreSites = filteredSites.length > 5;

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        {/* Compact BMS Logo like Teams */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              width: '21px',
              height: '21px',
            }}>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#f25022' }}></div>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#7fba00' }}></div>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#00a4ef' }}></div>
              <div style={{ width: '10px', height: '10px', backgroundColor: '#ffb900' }}></div>
            </div>
            <div>
              <Text style={{ fontSize: '16px', color: '#1b1b1b', fontWeight: '700' }}>
                BMS Teams
              </Text>
            </div>
          </div>
          
          {/* Search Icon */}
          <div 
            className={`${styles.searchIcon} ${isSearchActive ? styles.searchIconActive : ''}`}
            onClick={onToggleSearch}
            style={{
              ...(isSearchActive ? {
                backgroundColor: '#e3f2fd',
                color: '#0078d4'
              } : {}),
            }}
          >
            <SearchRegular style={{ fontSize: '16px' }} />
          </div>
        </div>
      </div>
      
      {/* Search Input - appears under header when search is active */}
      {isSearchActive && (
        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Filter by site name"
            value={siteSearchQuery}
            onChange={(e) => onSiteSearchChange(e.target.value)}
            autoFocus
          />
        </div>
      )}
      
      <div className={styles.sidebarNav}>
        {/* Main Navigation */}
        <div style={{ marginBottom: '8px' }}>
          <div 
            className={`${styles.siteItem} ${selectedMenuItem === 'home' ? styles.siteItemSelected : ''}`}
            onClick={() => handleMenuItemSelect('home')}
            style={{
              ...(selectedMenuItem === 'home' ? {
                backgroundColor: '#e3f2fd',
                borderLeft: '3px solid #0078d4',
                paddingLeft: '9px'
              } : {}),
            }}
            onMouseEnter={(e) => {
              if (selectedMenuItem !== 'home') {
                e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMenuItem !== 'home') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <HomeRegular style={{
              fontSize: '16px',
              color: selectedMenuItem === 'home' ? '#0078d4' : '#605e5c',
              marginRight: '12px',
            }} />
            <Text size={300} style={{ 
              color: selectedMenuItem === 'home' ? '#0078d4' : '#1b1b1b',
              fontWeight: selectedMenuItem === 'home' ? '600' : '400'
            }}>
              Dashboard
            </Text>
          </div>

          <div 
            className={`${styles.siteItem} ${selectedMenuItem === 'approvals' ? styles.siteItemSelected : ''}`}
            onClick={() => handleMenuItemSelect('approvals')}
            style={{
              ...(selectedMenuItem === 'approvals' ? {
                backgroundColor: '#e3f2fd',
                borderLeft: '3px solid #0078d4',
                paddingLeft: '9px'
              } : {}),
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (selectedMenuItem !== 'approvals') {
                e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMenuItem !== 'approvals') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <CheckmarkCircleRegular style={{
              fontSize: '16px',
              color: selectedMenuItem === 'approvals' ? '#0078d4' : '#605e5c',
              marginRight: '12px',
            }} />
            <Text size={300} style={{ 
              color: selectedMenuItem === 'approvals' ? '#0078d4' : '#1b1b1b',
              fontWeight: selectedMenuItem === 'approvals' ? '600' : '400'
            }}>
              My Approvals
            </Text>
            {selectedMenuItem !== 'approvals' && (
              <Badge 
                size="small" 
                color="danger"
                style={{ 
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                12
              </Badge>
            )}
          </div>

          {/* <div 
            className={`${styles.siteItem} ${selectedMenuItem === 'metrics' ? styles.siteItemSelected : ''}`}
            onClick={() => handleMenuItemSelect('metrics')}
            style={{
              ...(selectedMenuItem === 'metrics' ? {
                backgroundColor: '#e3f2fd',
                borderLeft: '3px solid #0078d4',
                paddingLeft: '9px'
              } : {}),
            }}
            onMouseEnter={(e) => {
              if (selectedMenuItem !== 'metrics') {
                e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedMenuItem !== 'metrics') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <DataBarVerticalRegular style={{
              fontSize: '16px',
              color: selectedMenuItem === 'metrics' ? '#0078d4' : '#605e5c',
              marginRight: '12px',
            }} />
            <Text size={300} style={{ 
              color: selectedMenuItem === 'metrics' ? '#0078d4' : '#1b1b1b',
              fontWeight: selectedMenuItem === 'metrics' ? '600' : '400'
            }}>
              Analytics
            </Text>
          </div> */}
        </div>

        <hr style={{ 
          border: 'none', 
          borderTop: `1px solid ${tokens.colorNeutralStroke2}`, 
          margin: '6px 0' 
        }} />

        {/* Document Management Section */}
        <div style={{ marginBottom: '6px' }}>
          <div 
            className={styles.sectionTitle}
            onClick={() => toggleSection('documentManagement')}
            style={{ marginBottom: '8px' }}
          >
            <Text 
              size={200} 
              weight="semibold" 
              style={{ 
                color: '#605e5c', 
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            >
              Document Management
            </Text>
            <ChevronRightRegular 
              className={`${styles.chevronIcon} ${!collapsedSections.documentManagement ? styles.chevronRotated : ''}`}
              style={{ color: '#605e5c' }}
            />
          </div>
          <div 
            className={styles.sectionContent}
            style={{ 
              maxHeight: collapsedSections.documentManagement ? '0px' : '200px',
              opacity: collapsedSections.documentManagement ? 0 : 1,
            }}
          >
            <div style={{ paddingLeft: '8px' }}>
              <div 
                className={`${styles.siteItem} ${selectedMenuItem === 'approvers' ? styles.siteItemSelected : ''}`}
                onClick={() => handleMenuItemSelect('approvers')}
                style={{
                  ...(selectedMenuItem === 'approvers' ? {
                    backgroundColor: '#e3f2fd',
                    borderLeft: '3px solid #0078d4',
                    paddingLeft: '9px'
                  } : {}),
                }}
                onMouseEnter={(e) => {
                  if (selectedMenuItem !== 'approvers') {
                    e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMenuItem !== 'approvers') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <PeopleRegular style={{
                  fontSize: '16px',
                  color: selectedMenuItem === 'approvers' ? '#0078d4' : '#605e5c',
                  marginRight: '12px',
                }} />
                <Text size={300} style={{ 
                  color: selectedMenuItem === 'approvers' ? '#0078d4' : '#1b1b1b',
                  fontWeight: selectedMenuItem === 'approvers' ? '600' : '400'
                }}>
                  Approvers
                </Text>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ 
          border: 'none', 
          borderTop: `1px solid ${tokens.colorNeutralStroke2}`, 
          margin: '6px 0' 
        }} />

        {/* BMS Sites Section */}
        <div style={{ marginBottom: '6px' }}>
          <div 
            className={styles.sectionTitle}
            onClick={() => toggleSection('bmsSites')}
            style={{ marginBottom: '8px' }}
          >
            <Text 
              size={200} 
              weight="semibold" 
              style={{ 
                color: '#605e5c', 
                fontSize: '14px',
                letterSpacing: '0.5px'
              }}
            >
              BMS Sites
            </Text>
            <ChevronRightRegular 
              className={`${styles.chevronIcon} ${!collapsedSections.bmsSites ? styles.chevronRotated : ''}`}
              style={{ color: '#605e5c' }}
            />
          </div>
          <div 
            className={styles.sectionContent}
            style={{ 
              maxHeight: collapsedSections.bmsSites ? '0px' : '1000px',
              opacity: collapsedSections.bmsSites ? 0 : 1,
            }}
          >
            <div style={{ paddingLeft: '8px' }}>
              {displayedSites.map((site) => (
                <Tooltip
                  key={site.id}
                  content={site.name}
                  relationship="description"
                >
                  <div 
                    className={`${styles.siteItem} ${selectedMenuItem === site.id ? styles.siteItemSelected : ''}`}
                    onClick={() => handleMenuItemSelect(site.id)}
                    style={{
                      ...(selectedMenuItem === site.id ? {
                        backgroundColor: '#e3f2fd',
                        borderLeft: '3px solid #0078d4',
                        paddingLeft: '9px'
                      } : {}),
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMenuItem !== site.id) {
                        e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMenuItem !== site.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      width: '21px',
                      minWidth: '21px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: site.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontSize: '9px',
                      color: 'white',
                      fontWeight: '600',
                      letterSpacing: '-0.5px'
                    }}>
                      {site.avatar}
                    </div>
                    <Text 
                      size={300} 
                      className={styles.siteNameText}
                      style={{ 
                        color: selectedMenuItem === site.id ? '#0078d4' : '#1b1b1b',
                        fontWeight: selectedMenuItem === site.id ? '600' : '400'
                      }}
                    >
                      {site.name}
                    </Text>
                  </div>
                </Tooltip>
              ))}
              
              {/* See all sites - always visible */}
              <Tooltip
                content="See all sites"
                relationship="description"
              >
                <div 
                  className={`${styles.siteItem} ${selectedMenuItem === 'all-sites' ? styles.siteItemSelected : ''}`}
                  onClick={() => handleMenuItemSelect('all-sites')}
                  style={{
                    ...(selectedMenuItem === 'all-sites' ? {
                      backgroundColor: '#e3f2fd',
                      borderLeft: '3px solid #0078d4',
                      paddingLeft: '9px'
                    } : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMenuItem !== 'all-sites') {
                      e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMenuItem !== 'all-sites') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    width: '21px',
                    minWidth: '21px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: '#6264a7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '9px',
                    color: 'white',
                    fontWeight: '600',
                    letterSpacing: '-0.5px'
                  }}>
                    ALL
                  </div>
                  <Text 
                    size={300} 
                    className={styles.siteNameText}
                    style={{ 
                      color: selectedMenuItem === 'all-sites' ? '#0078d4' : '#1b1b1b',
                      fontWeight: selectedMenuItem === 'all-sites' ? '600' : '400'
                    }}
                  >
                    See all sites
                  </Text>
                </div>
              </Tooltip>

              {/* Show More/Hide Button */}
              {hasMoreSites && (
                <Button
                  appearance="transparent"
                  className={styles.showMoreButton}
                  onClick={() => setShowMoreSites(!showMoreSites)}
                  icon={showMoreSites ? <ChevronUpRegular /> : <ExpandMoreRegular />}
                  iconPosition="after"
                  size="small"
                >
                  {showMoreSites ? 'Hide' : `Show more (${filteredSites.length - 5})`}
                </Button>
              )}
            </div>
          </div>
        </div>

        <hr style={{ 
          border: 'none', 
          borderTop: `1px solid ${tokens.colorNeutralStroke2}`, 
          margin: '6px 0' 
        }} />

      </div>
      
      <div className={styles.sidebarFooter}>
        <Menu>
          <MenuTrigger>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Avatar size={32} name={user?.displayName} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#1b1b1b',
                  marginBottom: '2px'
                }}>
                  {user?.displayName || 'User'}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#605e5c',
                  lineHeight: '1.2'
                }}>
                  Available • BMS Administrator
                </div>
              </div>
              <ChevronDownRegular style={{ 
                fontSize: '12px', 
                color: '#605e5c',
                marginLeft: '8px'
              }} />
            </div>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<PersonRegular />}>Profile</MenuItem>
              <Divider />
              <MenuItem icon={<SignOutRegular />} onClick={handleLogout}>
                Sign Out
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </div>
  );
};
