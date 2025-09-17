import React, { useState } from 'react';
import {
  Text,
  Button,
  makeStyles,
  tokens,
  SearchBox,
  Dropdown,
  Option,
  Tab,
  TabList,
  TabValue,
  Badge,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Checkbox,
} from '@fluentui/react-components';
import {
  CheckmarkCircleRegular,
  DocumentRegular,
  ArrowSortRegular,
  MoreHorizontalRegular,
  EyeRegular,
  HistoryRegular,
  DismissCircleRegular,
  CommentRegular,
  ClockRegular,
  LocationRegular,
} from '@fluentui/react-icons';
import { ResizableTable, ColumnDefinition } from '../ui/ResizableTable';
import { FileTypeIcon } from '../ui/FileTypeIcon';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  searchAndFilter: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    alignItems: 'center',
  },
  tabContent: {
    marginTop: tokens.spacingVerticalL,
  },
  approvalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  empty: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  statCard: {
    padding: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'center',
  },
  statIcon: {
    fontSize: '24px',
    marginBottom: tokens.spacingVerticalS,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: tokens.fontWeightBold,
    marginBottom: tokens.spacingVerticalXS,
  },
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
});

// Mock data
const mockApprovals = [
  {
    id: '1',
    documentName: 'Employee Handbook 2024',
    documentId: 'doc-1',
    author: 'Sarah Johnson',
    authorEmail: 'sarah.johnson@company.com',
    submittedDate: '2024-09-10',
    dueDate: '2024-09-15',
    priority: 'high' as const,
    status: 'pending' as const,
    comments: 'Please review the updated policies and procedures section.',
    version: '2.1',
    approvers: [
      { id: '1', name: 'John Smith', email: 'john.smith@company.com', status: 'approved' as const, comment: 'Looks good', actionDate: '2024-09-11' },
      { id: '2', name: 'Mike Wilson', email: 'mike.wilson@company.com', status: 'pending' as const },
      { id: '3', name: 'Current User', email: 'current.user@company.com', status: 'pending' as const },
    ],
  },
  {
    id: '2',
    documentName: 'Safety Procedures Manual',
    documentId: 'doc-2',
    author: 'Lisa Brown',
    authorEmail: 'lisa.brown@company.com',
    submittedDate: '2024-09-05',
    dueDate: '2024-09-10',
    priority: 'urgent' as const,
    status: 'pending' as const,
    comments: 'Critical safety updates that need immediate review.',
    version: '1.8',
    approvers: [
      { id: '1', name: 'David Lee', email: 'david.lee@company.com', status: 'approved' as const, comment: 'Approved with minor suggestions', actionDate: '2024-09-06' },
      { id: '2', name: 'Emma Davis', email: 'emma.davis@company.com', status: 'rejected' as const, comment: 'Needs more detail in section 3', actionDate: '2024-09-07' },
      { id: '3', name: 'Current User', email: 'current.user@company.com', status: 'pending' as const },
    ],
  },
];

const mockCompletedApprovals = [
  {
    id: '4',
    documentName: 'Customer Service Guidelines',
    documentId: 'doc-4',
    author: 'Amanda Rodriguez',
    authorEmail: 'amanda.rodriguez@company.com',
    submittedDate: '2024-09-01',
    dueDate: '2024-09-08',
    priority: 'low' as const,
    status: 'approved' as const,
    comments: 'Standard customer service procedures update.',
    version: '1.5',
    approvers: [
      { id: '1', name: 'Kevin Park', email: 'kevin.park@company.com', status: 'approved' as const, comment: 'Approved', actionDate: '2024-09-02' },
      { id: '2', name: 'Rachel Green', email: 'rachel.green@company.com', status: 'approved' as const, comment: 'Good updates', actionDate: '2024-09-03' },
      { id: '3', name: 'Current User', email: 'current.user@company.com', status: 'approved' as const, comment: 'Approved after review', actionDate: '2024-09-04' },
    ],
  },
];

export const ApprovalsPage: React.FC = () => {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<TabValue>('pending');
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleApprove = (id: string, comment: string = '') => {
    const approval = mockApprovals.find(a => a.id === id) || mockCompletedApprovals.find(a => a.id === id);
    if (approval) {
      const confirmMessage = comment 
        ? `Approve "${approval.documentName}" with comment: "${comment}"?`
        : `Approve "${approval.documentName}"?`;
      
      if (window.confirm(confirmMessage)) {
        alert(`Successfully approved "${approval.documentName}"!`);
      }
    }
  };

  const handleReject = (id: string, comment: string = '') => {
    const approval = mockApprovals.find(a => a.id === id) || mockCompletedApprovals.find(a => a.id === id);
    if (approval) {
      const reason = comment || window.prompt(`Reason for rejecting "${approval.documentName}":`);
      if (reason && reason.trim()) {
        alert(`Successfully rejected "${approval.documentName}" with reason: "${reason}"`);
      }
    }
  };

  const handleViewDocument = (documentId: string) => {
    window.open(`https://company.sharepoint.com/Documents/${documentId}`, '_blank');
  };

  const handleViewHistory = (id: string) => {
    const approval = mockApprovals.find(a => a.id === id) || mockCompletedApprovals.find(a => a.id === id);
    if (approval) {
      const historyText = approval.approvers
        .map(approver => `${approver.name}: ${approver.status} ${approver.actionDate ? `(${approver.actionDate})` : ''}${approver.comment ? ` - "${approver.comment}"` : ''}`)
        .join('\n');
      
      alert(`Approval History for "${approval.documentName}":\n\n${historyText}`);
    }
  };

  const handleAddComment = (id: string, comment: string = '') => {
    const approval = mockApprovals.find(a => a.id === id) || mockCompletedApprovals.find(a => a.id === id);
    if (approval) {
      const newComment = comment || window.prompt(`Add comment to "${approval.documentName}":`);
      if (newComment && newComment.trim()) {
        alert(`Comment added to "${approval.documentName}": "${newComment}"`);
      }
    }
  };

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortBy(columnKey);
    setSortDirection(direction);
  };

  const handleApprovalSelect = (approvalId: string, checked: boolean) => {
    if (checked) {
      setSelectedApprovals(prev => [...prev, approvalId]);
    } else {
      setSelectedApprovals(prev => prev.filter(id => id !== approvalId));
    }
  };

  const handleSelectAll = (approvals: any[]) => {
    setSelectedApprovals(approvals.map(approval => approval.id));
  };

  const handleDeselectAll = () => {
    setSelectedApprovals([]);
  };

  const filteredAndSortedApprovals = mockApprovals
    .filter(approval => {
      const matchesSearch = approval.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           approval.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || approval.status === filterStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const filteredAndSortedCompletedApprovals = mockCompletedApprovals
    .filter(approval => {
      const matchesSearch = approval.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           approval.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Define table columns for approvals matching SharePoint structure
  const approvalColumns: ColumnDefinition[] = [
    {
      key: 'select',
      title: '',
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      resizable: false,
      renderHeader: () => (
        <Checkbox
          checked={selectedApprovals.length === filteredAndSortedApprovals.length && filteredAndSortedApprovals.length > 0}
          onChange={(_, data) => {
            if (data.checked) {
              handleSelectAll(filteredAndSortedApprovals);
            } else {
              handleDeselectAll();
            }
          }}
        />
      ),
      render: (_, item: any) => (
        <Checkbox
          checked={selectedApprovals.includes(item.id)}
          onChange={(_, data) => handleApprovalSelect(item.id, !!data.checked)}
        />
      ),
    },
    {
      key: 'documentName',
      title: 'Name',
      width: 300,
      minWidth: 200,
      sortable: true,
      render: (_, item: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
          <FileTypeIcon fileType="docx" size={24} />
          <div>
            <Text weight="semibold">{item.documentName}</Text>
            <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
              Version {item.version}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'submittedDate',
      title: 'Modified',
      width: 120,
      minWidth: 100,
      sortable: true,
      render: (_, item: any) => (
        <Text size={200}>{new Date(item.submittedDate).toLocaleDateString()}</Text>
      ),
    },
    {
      key: 'author',
      title: 'Modified By',
      width: 150,
      minWidth: 120,
      sortable: true,
      render: (_, item: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <Avatar size={20} name={item.author} />
          <Text size={200}>{item.author}</Text>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Approval Status',
      width: 130,
      minWidth: 100,
      sortable: true,
      render: (_, item: any) => (
        <Badge 
          color={
            item.status === 'approved' ? 'success' :
            item.status === 'rejected' ? 'danger' : 'warning'
          } 
          size="small"
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'documentId',
      title: 'Document Number',
      width: 140,
      minWidth: 120,
      render: (_, item: any) => (
        <Text size={200} weight="semibold" style={{ fontFamily: 'monospace' }}>
          {item.documentId.toUpperCase()}
        </Text>
      ),
    },
    {
      key: 'notifyOnUpdate',
      title: 'Notify on Update',
      width: 120,
      minWidth: 100,
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: tokens.colorNeutralForeground3 }}>—</span>
        </div>
      ),
    },
    {
      key: 'state',
      title: 'State',
      width: 100,
      minWidth: 80,
      render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <LocationRegular style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }} />
          <Text size={200}>VIC</Text>
        </div>
      ),
    },
    {
      key: 'version',
      title: 'Version',
      width: 80,
      minWidth: 70,
      render: (_, item: any) => (
        <Text size={200} weight="semibold">{item.version}</Text>
      ),
    },
    {
      key: 'branch',
      title: 'Branch',
      width: 120,
      minWidth: 100,
      render: () => (
        <Text size={200}>Victoria</Text>
      ),
    },
    {
      key: 'departments',
      title: 'Departments',
      width: 150,
      minWidth: 120,
      render: (_, item: any) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          <Badge color="subtle" size="small">
            {item.priority === 'urgent' || item.priority === 'high' ? 'Safety' : 'General'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'approvers',
      title: 'Approvers',
      width: 120,
      minWidth: 100,
      render: (_, item: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          {item.approvers.slice(0, 3).map((approver: any, index: number) => (
            <Avatar key={index} size={20} name={approver.name} />
          ))}
          {item.approvers.length > 3 && (
            <Text size={100}>+{item.approvers.length - 3}</Text>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      width: 100,
      minWidth: 80,
      sortable: true,
      render: (_, item: any) => (
        <Badge 
          color={
            item.priority === 'urgent' ? 'danger' :
            item.priority === 'high' ? 'warning' :
            item.priority === 'medium' ? 'brand' : 'subtle'
          } 
          size="small"
        >
          {item.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      width: 120,
      minWidth: 100,
      sortable: true,
      render: (_, item: any) => {
        const isOverdue = new Date(item.dueDate) < new Date();
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
            <ClockRegular style={{ 
              fontSize: '12px', 
              color: isOverdue ? tokens.colorPaletteRedForeground1 : tokens.colorNeutralForeground3 
            }} />
            <Text size={200} style={{ color: isOverdue ? tokens.colorPaletteRedForeground1 : 'inherit' }}>
              {new Date(item.dueDate).toLocaleDateString()}
            </Text>
          </div>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      resizable: false,
      render: (_, item: any) => (
        <Menu>
          <MenuTrigger>
            <Button
              appearance="transparent"
              icon={<MoreHorizontalRegular />}
              size="small"
            />
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem 
                icon={<EyeRegular />}
                onClick={() => handleViewDocument(item.documentId)}
              >
                View Document
              </MenuItem>
              <MenuItem 
                icon={<HistoryRegular />}
                onClick={() => handleViewHistory(item.id)}
              >
                View History
              </MenuItem>
              <MenuItem 
                icon={<CommentRegular />}
                onClick={() => handleAddComment(item.id, '')}
              >
                Add Comment
              </MenuItem>
              {item.status === 'pending' && (
                <>
                  <MenuItem 
                    icon={<CheckmarkCircleRegular />}
                    onClick={() => handleApprove(item.id, '')}
                  >
                    Approve
                  </MenuItem>
                  <MenuItem 
                    icon={<DismissCircleRegular />}
                    onClick={() => handleReject(item.id, '')}
                  >
                    Reject
                  </MenuItem>
                </>
              )}
            </MenuList>
          </MenuPopover>
        </Menu>
      ),
    },
  ];

  const pendingCount = mockApprovals.length;
  const completedCount = mockCompletedApprovals.length;
  const overdueCount = mockApprovals.filter(a => new Date(a.dueDate) < new Date()).length;
  const urgentCount = mockApprovals.filter(a => a.priority === 'urgent').length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* <div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1b1b1b', marginBottom: '8px' }}>
            My Approvals
          </div>
          <Caption1>Review and approve documents assigned to you</Caption1>
        </div> */}
        {/* <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
          <Button appearance="secondary" icon={<SearchRegular />}>
            Advanced Search
          </Button>
          <Button appearance="secondary" icon={<FilterRegular />}>
            Filter Options
          </Button>
        </div> */}
      </div>

      {/* Statistics */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <CheckmarkCircleRegular className={styles.statIcon} style={{ color: tokens.colorBrandForeground1 }} />
          <div className={styles.statValue}>{pendingCount}</div>
          <div className={styles.statLabel}>Pending Approvals</div>
        </div>
        <div className={styles.statCard}>
          <CheckmarkCircleRegular className={styles.statIcon} style={{ color: tokens.colorPaletteGreenForeground1 }} />
          <div className={styles.statValue}>{completedCount}</div>
          <div className={styles.statLabel}>Completed This Week</div>
        </div>
        <div className={styles.statCard}>
          <DocumentRegular className={styles.statIcon} style={{ color: tokens.colorPaletteRedForeground1 }} />
          <div className={styles.statValue}>{overdueCount}</div>
          <div className={styles.statLabel}>Overdue</div>
        </div>
        <div className={styles.statCard}>
          <DocumentRegular className={styles.statIcon} style={{ color: tokens.colorPaletteYellowForeground1 }} />
          <div className={styles.statValue}>{urgentCount}</div>
          <div className={styles.statLabel}>Urgent Priority</div>
        </div>
      </div>

      <div className={styles.searchAndFilter}>
        <SearchBox
          placeholder="Search documents or authors..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          style={{ flex: 1, maxWidth: '400px' }}
        />
        <Dropdown
          value={filterPriority === 'all' ? 'All Priorities' : 
                 filterPriority === 'urgent' ? 'Urgent' :
                 filterPriority === 'high' ? 'High' :
                 filterPriority === 'medium' ? 'Medium' : 'Low'}
          onOptionSelect={(_, data) => setFilterPriority(data.optionValue || 'all')}
        >
          <Option value="all">All Priorities</Option>
          <Option value="urgent">Urgent</Option>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
          <Option value="low">Low</Option>
        </Dropdown>
        <Button appearance="secondary" icon={<ArrowSortRegular />}>
          Sort
        </Button>
      </div>

      <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(data.value)}>
        <Tab value="pending">
          Pending ({pendingCount})
        </Tab>
        <Tab value="completed">
          Completed ({completedCount})
        </Tab>
      </TabList>

        <div className={styles.tabContent}>
          {selectedTab === 'pending' && (
            <>
              {filteredAndSortedApprovals.length === 0 ? (
                <div className={styles.empty}>
                  <CheckmarkCircleRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
                  <Text>No pending approvals</Text>
                  <Text size={200}>You're all caught up!</Text>
                </div>
              ) : (
                <ResizableTable
                  columns={approvalColumns}
                  data={filteredAndSortedApprovals}
                  aria-label="Pending approvals table"
                  onColumnResize={(columnKey, width) => {
                    console.log(`Column ${columnKey} resized to ${width}px`);
                  }}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
              )}
            </>
          )}

          {selectedTab === 'completed' && (
            <>
              {filteredAndSortedCompletedApprovals.length === 0 ? (
                <div className={styles.empty}>
                  <DocumentRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
                  <Text>No completed approvals</Text>
                  <Text size={200}>Completed approvals will appear here</Text>
                </div>
              ) : (
                <ResizableTable
                  columns={approvalColumns}
                  data={filteredAndSortedCompletedApprovals}
                  aria-label="Completed approvals table"
                  onColumnResize={(columnKey, width) => {
                    console.log(`Column ${columnKey} resized to ${width}px`);
                  }}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
              )}
            </>
          )}
        </div>
    </div>
  );
};
