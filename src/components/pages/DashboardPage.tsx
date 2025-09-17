import React, { useState } from 'react';
import { 
  DocumentsDueSoonCard, 
  OverdueDocumentsCard, 
  PendingApprovalsCard, 
  CompletedThisMonthCard 
} from '../ui/MetricCard';
import { BulkActionBar } from '../ui/BulkActionBar';
import { ResizableTable, ColumnDefinition } from '../ui/ResizableTable';
import { 
  generateSharePointDocuments, 
  getApprovalStatusBadge,
  formatDate,
  SharePointDocument
} from '../../data/documentData';
import { FileTypeIcon } from '../ui/FileTypeIcon';
import {
  makeStyles,
  tokens,
  Button,
  SearchBox,
  Dropdown,
  Option,
  Checkbox,
  Badge,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Text,
} from '@fluentui/react-components';
import {
  FilterRegular,
  // DocumentRegular, // Not used in table view
  MoreHorizontalRegular,
  EyeRegular,
  PeopleRegular,
  HistoryRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  AlertRegular,
  LocationRegular,
  // BranchRegular, // Not used currently
  BuildingRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: '0 0 auto',
  },
  tableSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1b1b1b',
    marginBottom: '12px',
  },
  welcomeSubtitle: {
    fontSize: '16px',
    color: '#605e5c',
    lineHeight: '1.5',
    maxWidth: '600px',
    margin: '0 auto',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalXL,
  },
  section: {
    marginBottom: tokens.spacingVerticalXL,
  },
  sectionHeader: {
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
    padding: '16px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  documentsTable: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
  },
  tableRow: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  statusBadge: {
    minWidth: '80px',
    textAlign: 'center',
  },
  actionButton: {
    minWidth: '32px',
    height: '32px',
  },
});

// Generate SharePoint-style documents for dashboard
const mockDocuments = generateSharePointDocuments('dashboard', 25);

// Helper function removed - using getApprovalStatusBadge from documentData

export const DashboardPage: React.FC = () => {
  const styles = useStyles();
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSelectAll = () => {
    setSelectedDocuments(mockDocuments.map(doc => doc.id));
  };

  const handleDeselectAll = () => {
    setSelectedDocuments([]);
  };

  const handleBulkAssignApprovers = (approvers: string[]) => {
    if (selectedDocuments.length === 0 || approvers.length === 0) return;
    
    const selectedDocs = filteredAndSortedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    alert(`Assigned ${approvers.length} approver(s) to ${selectedDocs.length} document(s):\n${approvers.join(', ')}`);
    setSelectedDocuments([]);
  };

  const handleBulkApprove = () => {
    if (selectedDocuments.length === 0) return;
    
    const selectedDocs = filteredAndSortedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const pendingDocs = selectedDocs.filter(doc => doc.approvalStatus === 'Pending');
    
    if (pendingDocs.length === 0) {
      alert('No pending documents selected for approval.');
      return;
    }
    
    if (window.confirm(`Approve ${pendingDocs.length} document(s)?`)) {
      alert(`Successfully approved ${pendingDocs.length} document(s)!`);
      setSelectedDocuments([]);
    }
  };

  const handleBulkReject = () => {
    if (selectedDocuments.length === 0) return;
    
    const selectedDocs = filteredAndSortedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const pendingDocs = selectedDocs.filter(doc => doc.approvalStatus === 'Pending');
    
    if (pendingDocs.length === 0) {
      alert('No pending documents selected for rejection.');
      return;
    }
    
    const reason = window.prompt(`Reason for rejecting ${pendingDocs.length} document(s):`);
    if (reason && reason.trim()) {
      alert(`Successfully rejected ${pendingDocs.length} document(s) with reason: "${reason}"`);
      setSelectedDocuments([]);
    }
  };

  const handleBulkExport = () => {
    if (selectedDocuments.length === 0) return;
    
    const selectedDocs = filteredAndSortedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const csvContent = [
      ['Name', 'Document Number', 'Modified By', 'Approval Status', 'Version'].join(','),
      ...selectedDocs.map(doc => [
        `"${doc.name}"`, doc.documentNumber, `"${doc.modifiedBy}"`, doc.approvalStatus, doc.version
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard_documents_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setSelectedDocuments([]);
  };

  const handleViewDocument = (documentId: string) => {
    const doc = filteredAndSortedDocuments.find(d => d.id === documentId);
    if (doc) {
      window.open(`https://company.sharepoint.com/Documents/${doc.name}`, '_blank');
    }
  };

  const handleManageApprovers = (documentId: string) => {
    alert(`Approver management for document ${documentId} would open here.`);
  };

  const handleViewHistory = (documentId: string) => {
    alert(`Document history for ${documentId} would display here with version changes, approvals, and comments.`);
  };

  const handleApprove = (documentId: string) => {
    const doc = filteredAndSortedDocuments.find(d => d.id === documentId);
    if (doc && doc.approvalStatus === 'Pending') {
      if (window.confirm(`Approve document "${doc.name}"?`)) {
        alert(`Successfully approved "${doc.name}"!`);
      }
    }
  };

  const handleReject = (documentId: string) => {
    const doc = filteredAndSortedDocuments.find(d => d.id === documentId);
    if (doc && doc.approvalStatus === 'Pending') {
      const reason = window.prompt(`Reason for rejecting "${doc.name}":`);
      if (reason && reason.trim()) {
        alert(`Successfully rejected "${doc.name}" with reason: "${reason}"`);
      }
    }
  };

  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortBy(columnKey);
    setSortDirection(direction);
  };

  const isAllSelected = selectedDocuments.length === mockDocuments.length && mockDocuments.length > 0;
  // const isIndeterminate = selectedDocuments.length > 0 && selectedDocuments.length < mockDocuments.length;

  const filteredAndSortedDocuments = mockDocuments
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.modifiedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.departments.some(dept => dept.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || doc.approvalStatus.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let aValue = a[sortBy as keyof SharePointDocument];
      let bValue = b[sortBy as keyof SharePointDocument];
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Define table columns with resizable functionality
  const columns: ColumnDefinition[] = [
    {
      key: 'select',
      title: '',
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      resizable: false,
      renderHeader: () => (
        <Checkbox
          checked={isAllSelected}
          onChange={(_, data) => {
            if (data.checked) {
              handleSelectAll();
            } else {
              handleDeselectAll();
            }
          }}
        />
      ),
      render: (_, item: SharePointDocument) => (
        <Checkbox
          checked={selectedDocuments.includes(item.id)}
          onChange={(_, data) => handleDocumentSelect(item.id, !!data.checked)}
        />
      ),
    },
    {
      key: 'name',
      title: 'Name',
      width: 300,
      minWidth: 200,
      sortable: true,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
          <FileTypeIcon fileType={item.fileType} size={24} />
          <div>
            <Text weight="semibold">{item.name}</Text>
            <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>
              {item.fileSize}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'modified',
      title: 'Modified',
      width: 120,
      minWidth: 100,
      sortable: true,
      render: (_, item: SharePointDocument) => (
        <Text size={200}>{formatDate(item.modified)}</Text>
      ),
    },
    {
      key: 'modifiedBy',
      title: 'Modified By',
      width: 150,
      minWidth: 120,
      sortable: true,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <Avatar size={20} name={item.modifiedBy} />
          <Text size={200}>{item.modifiedBy}</Text>
        </div>
      ),
    },
    {
      key: 'approvalStatus',
      title: 'Approval Status',
      width: 130,
      minWidth: 100,
      sortable: true,
      render: (_, item: SharePointDocument) => {
        const statusBadge = getApprovalStatusBadge(item.approvalStatus);
        return (
          <Badge color={statusBadge.color} size="small">
            {statusBadge.text}
          </Badge>
        );
      },
    },
    {
      key: 'documentNumber',
      title: 'Document Number',
      width: 140,
      minWidth: 120,
      render: (_, item: SharePointDocument) => (
        <Text size={200} weight="semibold" style={{ fontFamily: 'monospace' }}>
          {item.documentNumber}
        </Text>
      ),
    },
    {
      key: 'notifyOnUpdate',
      title: 'Notify on Update',
      width: 120,
      minWidth: 100,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item.notifyOnUpdate ? (
            <AlertRegular style={{ fontSize: '14px', color: tokens.colorPaletteYellowForeground1 }} />
          ) : (
            <span style={{ color: tokens.colorNeutralForeground3 }}>—</span>
          )}
        </div>
      ),
    },
    {
      key: 'state',
      title: 'State',
      width: 100,
      minWidth: 80,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <LocationRegular style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }} />
          <Text size={200}>{item.state}</Text>
        </div>
      ),
    },
    {
      key: 'version',
      title: 'Version',
      width: 80,
      minWidth: 70,
      render: (_, item: SharePointDocument) => (
        <Text size={200} weight="semibold">{item.version}</Text>
      ),
    },
    {
      key: 'branch',
      title: 'Branch',
      width: 120,
      minWidth: 100,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          <BuildingRegular style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }} />
          <Text size={200}>{item.branch}</Text>
        </div>
      ),
    },
    {
      key: 'departments',
      title: 'Departments',
      width: 150,
      minWidth: 120,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
          {item.departments.map((dept, index) => (
            <Badge key={index} color="subtle" size="small">
              {dept}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'approvers',
      title: 'Approvers',
      width: 120,
      minWidth: 100,
      render: (_, item: SharePointDocument) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
          {item.approvers.slice(0, 3).map((approver, index) => (
            <Avatar key={index} size={20} name={approver} />
          ))}
          {item.approvers.length > 3 && (
            <Text size={100}>+{item.approvers.length - 3}</Text>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      resizable: false,
      render: (_, item: SharePointDocument) => (
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
                onClick={() => handleViewDocument(item.id)}
              >
                View Document
              </MenuItem>
              <MenuItem 
                icon={<PeopleRegular />}
                onClick={() => handleManageApprovers(item.id)}
              >
                Manage Approvers
              </MenuItem>
              <MenuItem 
                icon={<HistoryRegular />}
                onClick={() => handleViewHistory(item.id)}
              >
                View History
              </MenuItem>
              {item.approvalStatus === 'Pending' && (
                <>
                  <MenuItem 
                    icon={<CheckmarkCircleRegular />}
                    onClick={() => handleApprove(item.id)}
                  >
                    Approve
                  </MenuItem>
                  <MenuItem 
                    icon={<DismissCircleRegular />}
                    onClick={() => handleReject(item.id)}
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Clean Welcome Card */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeTitle}>
            Welcome back, User 👋
          </div>
          <div className={styles.welcomeSubtitle}>
            Manage your BMS documents, track approvals, and stay on top of your review deadlines. 
            Your centralized document management dashboard is ready to help streamline your workflow.
          </div>
        </div>
        
        {/* Overview Metrics */}
        <div className={styles.metricsGrid}>
          <DocumentsDueSoonCard 
            value={12} 
            change={3} 
            onClick={() => setFilterStatus('due-soon')}
          />
          <OverdueDocumentsCard 
            value={5} 
            change={2} 
            onClick={() => setFilterStatus('overdue')}
          />
          <PendingApprovalsCard 
            value={8} 
            change={-1} 
          />
          <CompletedThisMonthCard 
            value={47} 
            change={12} 
            onClick={() => setFilterStatus('approved')}
          />
        </div>

        {/* Search and Filter */}
        <div className={styles.searchAndFilter}>
          <SearchBox
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(_, data) => setSearchQuery(data.value)}
            style={{ flex: 1, maxWidth: '400px' }}
          />
          <Dropdown
            value={filterStatus === 'all' ? 'All Status' : 
                   filterStatus === 'approved' ? 'Approved' :
                   filterStatus === 'pending' ? 'Pending' :
                   filterStatus === 'in review' ? 'In Review' :
                   filterStatus === 'rejected' ? 'Rejected' : 'Draft'}
            onOptionSelect={(_, data) => setFilterStatus(data.optionValue || 'all')}
          >
            <Option value="all">All Status</Option>
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="in review">In Review</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="draft">Draft</Option>
          </Dropdown>
          <Button appearance="secondary" icon={<FilterRegular />}>
            More Filters
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedDocuments.length > 0 && (
          <BulkActionBar
            selectedCount={selectedDocuments.length}
            totalCount={mockDocuments.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkAssignApprovers={handleBulkAssignApprovers}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkExport={handleBulkExport}
            onPreviousPage={() => {}}
            onNextPage={() => {}}
            currentPage={1}
            totalPages={1}
            hasSelection={selectedDocuments.length > 0}
          />
        )}
      </div>

      {/* Documents Table Section - Takes remaining height */}
      <div className={styles.tableSection}>
        <div className={styles.sectionHeader}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1b' }}>
            Recent Documents
          </div>
          <Button appearance="transparent">View All</Button>
        </div>
        
        <ResizableTable
          columns={columns}
          data={filteredAndSortedDocuments}
          aria-label="Documents table"
          onColumnResize={(columnKey, width) => {
            console.log(`Column ${columnKey} resized to ${width}px`);
          }}
          onSort={handleSort}
          sortBy={sortBy}
          sortDirection={sortDirection}
        />
      </div>
    </div>
  );
};
