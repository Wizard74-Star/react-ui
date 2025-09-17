import React, { useState, useEffect } from 'react';
import {
  Text,
  Button,
  makeStyles,
  tokens,
  SearchBox,
  Dropdown,
  Option,
  Avatar,
  Badge,
  Checkbox,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Field,
  Input,
} from '@fluentui/react-components';
import {
  BuildingRegular,
  DocumentRegular,
  AddRegular,
  FilterRegular,
  MoreHorizontalRegular,
  EyeRegular,
  PeopleRegular,
} from '@fluentui/react-icons';
import { BulkActionBar } from '../ui/BulkActionBar';
import { ResizableTable, ColumnDefinition } from '../ui/ResizableTable';
import { generateSharePointDocuments, getApprovalStatusBadge, SharePointDocument } from '../../data/documentData';
import { FileTypeIcon } from '../ui/FileTypeIcon';
import { bmsSampleSites } from '../../data/bmsSites';

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
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalXL,
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  section: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalL,
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  documentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  siteCard: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  selectedSite: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  approverList: {
    display: 'flex',
    flexDirection: 'column',
  },
  approverItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    cursor: 'pointer',
    borderRadius: tokens.borderRadiusSmall,
    transition: 'background-color 0.1s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  approverAvatar: {
    position: 'relative',
    flexShrink: 0,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#6BB700',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  approverContent: {
    flex: 1,
    minWidth: 0,
  },
  approverName: {
    fontWeight: '600',
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    marginBottom: '2px',
  },
  lastMessage: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  empty: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  dialog: {
    minWidth: '600px',
  },
});

// Use sample BMS sites data
const mockSites = bmsSampleSites.map(site => ({
  id: site.id,
  name: site.name,
  documentCount: site.documentCount,
  approverCount: site.approverCount,
  description: site.description,
  manager: site.manager,
  status: site.status,
  category: site.category,
}));


const mockApprovers = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john.smith@company.com', 
    role: 'Site Owner', 
    status: 'active',
    lastMessage: 'Sure, that sounds great!',
    isOnline: true
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    email: 'sarah.johnson@company.com', 
    role: 'Approver', 
    status: 'active',
    lastMessage: 'Love that idea. Let\'s bring it up in tomorrow...',
    isOnline: false
  },
  { 
    id: '3', 
    name: 'Mike Wilson', 
    email: 'mike.wilson@company.com', 
    role: 'Approver', 
    status: 'active',
    lastMessage: 'I\'ll review the documents and get back to you',
    isOnline: true
  },
  { 
    id: '4', 
    name: 'Lisa Brown', 
    email: 'lisa.brown@company.com', 
    role: 'Site Owner', 
    status: 'inactive',
    lastMessage: 'Thanks for the update on the project status',
    isOnline: false
  },
  { 
    id: '5', 
    name: 'David Lee', 
    email: 'david.lee@company.com', 
    role: 'Approver', 
    status: 'active',
    lastMessage: 'Approved the latest safety manual revision',
    isOnline: true
  },
];

export const ApproversPage: React.FC = () => {
  const styles = useStyles();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [approverSearchQuery, setApproverSearchQuery] = useState('');

  // Use SharePoint documents
  const siteDocuments = selectedSite ? generateSharePointDocuments(selectedSite, 25) : [];

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleSiteSelect = (siteId: string) => {
    setSelectedSite(siteId);
    setCurrentPage(1);
    setSelectedDocuments([]);
  };


  const handleBulkAssignApprovers = (approvers: string[]) => {
    if (selectedDocuments.length === 0 || approvers.length === 0) return;
    
    const selectedDocs = paginatedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    
    // In a real app, this would call the API to assign approvers
    const confirmAssignment = window.confirm(
      `Assign ${approvers.length} approver${approvers.length !== 1 ? 's' : ''} to ${selectedDocs.length} document${selectedDocs.length !== 1 ? 's' : ''}?\n\n` +
      `Approvers: ${approvers.join(', ')}\n\n` +
      `Documents:\n${selectedDocs.map(doc => `• ${doc.name}`).join('\n')}`
    );
    
    if (confirmAssignment) {
      alert(`Successfully assigned approvers to ${selectedDocs.length} document${selectedDocs.length !== 1 ? 's' : ''}!`);
      setIsAssignDialogOpen(false);
      setSelectedApprovers([]);
      setSelectedDocuments([]);
    }
  };

  const handleBulkApprove = () => {
    if (selectedDocuments.length === 0) return;
    
    const selectedDocs = paginatedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const pendingDocs = selectedDocs.filter(doc => doc.approvalStatus === 'Pending');
    
    if (pendingDocs.length === 0) {
      alert('No pending documents selected for approval.');
      return;
    }
    
    // In a real app, this would call the API
    const confirmApproval = window.confirm(
      `Are you sure you want to approve ${pendingDocs.length} document${pendingDocs.length !== 1 ? 's' : ''}?\n\n` +
      pendingDocs.map(doc => `• ${doc.name}`).join('\n')
    );
    
    if (confirmApproval) {
      // Simulate approval process
      alert(`Successfully approved ${pendingDocs.length} document${pendingDocs.length !== 1 ? 's' : ''}!`);
      setSelectedDocuments([]);
    }
  };

  const handleBulkReject = () => {
    if (selectedDocuments.length === 0) return;
    
    const selectedDocs = paginatedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const pendingDocs = selectedDocs.filter(doc => doc.approvalStatus === 'Pending');
    
    if (pendingDocs.length === 0) {
      alert('No pending documents selected for rejection.');
      return;
    }
    
    const reason = window.prompt(
      `Please provide a reason for rejecting ${pendingDocs.length} document${pendingDocs.length !== 1 ? 's' : ''}:`
    );
    
    if (reason && reason.trim()) {
      // In a real app, this would call the API with the reason
      alert(`Successfully rejected ${pendingDocs.length} document${pendingDocs.length !== 1 ? 's' : ''} with reason: "${reason}"`);
      setSelectedDocuments([]);
    }
  };

  const handleBulkExport = () => {
    if (selectedDocuments.length === 0) return;
    
    // Create CSV content
    const selectedDocs = paginatedDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const csvContent = [
      ['Name', 'Document Number', 'Modified By', 'Approval Status', 'Version', 'Departments'].join(','),
      ...selectedDocs.map(doc => [
        `"${doc.name}"`,
        doc.documentNumber,
        `"${doc.modifiedBy}"`,
        doc.approvalStatus,
        doc.version,
        `"${doc.departments.join('; ')}"`
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `documents_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clear selections after export
    setSelectedDocuments([]);
  };

  const handleViewDocument = (documentId: string) => {
    // In a real app, this would open the document viewer
    const doc = siteDocuments.find(d => d.id === documentId);
    if (doc) {
      window.open(`https://company.sharepoint.com/sites/${selectedSite}/Documents/${doc.name}`, '_blank');
    }
  };

  const handleManageApprovers = (documentId: string) => {
    // Set the document for approver management and open dialog
    setSelectedDocuments([documentId]);
    setIsAssignDialogOpen(true);
  };

  const handleExportAllDocuments = () => {
    if (!selectedSite || filteredAndSortedDocuments.length === 0) return;
    
    // Export all documents for the selected site
    const csvContent = [
      ['Name', 'Document Number', 'Modified By', 'Approval Status', 'Version', 'Departments'].join(','),
      ...filteredAndSortedDocuments.map(doc => [
        `"${doc.name}"`,
        doc.documentNumber,
        `"${doc.modifiedBy}"`,
        doc.approvalStatus,
        doc.version,
        `"${doc.departments.join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedSite}_documents_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManageApproversForSite = () => {
    // Open a site-wide approver management interface
    alert('Site-wide approver management would open here. This would allow you to add/remove approvers for the entire site.');
  };


  const handleAddApprover = (approverId: string) => {
    if (!selectedApprovers.includes(approverId)) {
      setSelectedApprovers(prev => [...prev, approverId]);
    }
  };

  const handleRemoveApprover = (approverId: string) => {
    setSelectedApprovers(prev => prev.filter(id => id !== approverId));
  };

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortBy(columnKey);
    setSortDirection(direction);
  };

  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const filteredAndSortedDocuments = siteDocuments
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.modifiedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || doc.approvalStatus.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      let aValue = a[sortBy as keyof SharePointDocument];
      let bValue = b[sortBy as keyof SharePointDocument];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDocuments = filteredAndSortedDocuments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedDocuments([]); // Clear selections when changing pages
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Define table columns
  const documentColumns: ColumnDefinition[] = [
    {
      key: 'select',
      title: '',
      width: 50,
      minWidth: 50,
      maxWidth: 50,
      resizable: false,
      renderHeader: () => (
        <Checkbox
          checked={paginatedDocuments.length > 0 && paginatedDocuments.every(doc => selectedDocuments.includes(doc.id))}
          onChange={(_, data) => {
            if (data.checked) {
              setSelectedDocuments(prev => [...new Set([...prev, ...paginatedDocuments.map(doc => doc.id)])]);
            } else {
              setSelectedDocuments(prev => prev.filter(id => !paginatedDocuments.map(doc => doc.id).includes(id)));
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
      width: 250,
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
      key: 'approvalStatus',
      title: 'Status',
      width: 120,
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
      key: 'modifiedBy',
      title: 'Modified By',
      width: 140,
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
            </MenuList>
          </MenuPopover>
        </Menu>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
          <Button
            appearance="secondary"
            icon={<AddRegular />}
            onClick={handleExportAllDocuments}
            disabled={!selectedSite || filteredAndSortedDocuments.length === 0}
          >
            Export
          </Button>
          <Button
            appearance="primary"
            icon={<AddRegular />}
            onClick={() => setIsAssignDialogOpen(true)}
          >
            Assign Approvers
          </Button>
        </div>
      </div>

      <div className={styles.searchAndFilter}>
        <SearchBox
          placeholder="Search documents or sites..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          style={{ flex: 1, maxWidth: '400px' }}
        />
        <Dropdown
          value={filterStatus === 'all' ? 'All Status' : 
                 filterStatus === 'due-soon' ? 'Due Soon' :
                 filterStatus === 'overdue' ? 'Overdue' :
                 filterStatus === 'pending' ? 'Pending' : 'Approved'}
          onOptionSelect={(_, data) => setFilterStatus(data.optionValue || 'all')}
        >
          <Option value="all">All Status</Option>
          <Option value="due-soon">Due Soon</Option>
          <Option value="overdue">Overdue</Option>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
        </Dropdown>
        <Button 
          appearance="secondary" 
          icon={<FilterRegular />}
          onClick={() => setShowMoreFilters(!showMoreFilters)}
        >
          {showMoreFilters ? 'Hide Filters' : 'More Filters'}
        </Button>
      </div>

      {/* More Filters Panel */}
      {showMoreFilters && (
        <div style={{
          backgroundColor: tokens.colorNeutralBackground1,
          border: `1px solid ${tokens.colorNeutralStroke2}`,
          borderRadius: tokens.borderRadiusMedium,
          padding: tokens.spacingVerticalL,
          marginBottom: tokens.spacingVerticalL,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: tokens.spacingHorizontalL,
          }}>
            <div>
              <Text weight="semibold" style={{ marginBottom: tokens.spacingVerticalS }}>
                Document Type
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS }}>
                {['All Types', 'Word Documents', 'Excel Files', 'PowerPoint', 'PDFs'].map((type) => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
                    <input type="checkbox" defaultChecked={type === 'All Types'} />
                    <Text size={200}>{type}</Text>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Text weight="semibold" style={{ marginBottom: tokens.spacingVerticalS }}>
                Department
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS }}>
                {['All Departments', 'Safety', 'Quality', 'HR', 'Operations'].map((dept) => (
                  <label key={dept} style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
                    <input type="checkbox" defaultChecked={dept === 'All Departments'} />
                    <Text size={200}>{dept}</Text>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Text weight="semibold" style={{ marginBottom: tokens.spacingVerticalS }}>
                Date Range
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
                <Input type="date" placeholder="From date" />
                <Input type="date" placeholder="To date" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {/* Left Panel - Sites */}
        <div className={styles.leftPanel}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1b' }}>
                BMS Sites
              </div>
              <Badge color="brand" size="small">
                {mockSites.length} sites
              </Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
              {mockSites.map((site) => (
                <div
                  key={site.id}
                  className={`${styles.siteCard} ${selectedSite === site.id ? styles.selectedSite : ''}`}
                  onClick={() => handleSiteSelect(site.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
                    <BuildingRegular style={{ fontSize: '20px', color: tokens.colorBrandForeground1 }} />
                    <div style={{ flex: 1 }}>
                      <Text weight="semibold">{site.name}</Text>
                      <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, marginTop: tokens.spacingVerticalXS }}>
                        <Text size={200}>{site.documentCount} documents</Text>
                        <Text size={200}>{site.approverCount} approvers</Text>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Approvers List */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1b' }}>
                Site Approvers
              </div>
              <Button 
                size="small" 
                appearance="transparent"
                onClick={handleManageApproversForSite}
              >
                Manage
              </Button>
            </div>
            <div className={styles.approverList}>
              {mockApprovers.map((approver) => (
                <div key={approver.id} className={styles.approverItem}>
                  <div className={styles.approverAvatar}>
                    <Avatar size={40} name={approver.name} />
                    {approver.isOnline && <div className={styles.onlineIndicator} />}
                  </div>
                  <div className={styles.approverContent}>
                    <div className={styles.approverName}>{approver.name}</div>
                    <div className={styles.lastMessage}>{approver.lastMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Documents */}
        <div className={styles.rightPanel}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1b' }}>
                Documents
              </div>
            </div>

            {selectedDocuments.length > 0 && (
              <BulkActionBar
                selectedCount={selectedDocuments.length}
                totalCount={filteredAndSortedDocuments.length}
                onSelectAll={() => setSelectedDocuments(paginatedDocuments.map(doc => doc.id))}
                onDeselectAll={() => setSelectedDocuments([])}
                onBulkAssignApprovers={handleBulkAssignApprovers}
                onBulkApprove={handleBulkApprove}
                onBulkReject={handleBulkReject}
                onBulkExport={handleBulkExport}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                currentPage={currentPage}
                totalPages={totalPages}
                hasSelection={selectedDocuments.length > 0}
              />
            )}

            {!selectedSite ? (
              <div className={styles.empty}>
                <BuildingRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
                <Text>Select a site to view documents</Text>
                <Text size={200}>Choose a site from the left panel to manage its documents and approvers</Text>
              </div>
            ) : filteredAndSortedDocuments.length === 0 ? (
              <div className={styles.empty}>
                <DocumentRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
                <Text>No documents found</Text>
                <Text size={200}>Try adjusting your search or filters</Text>
              </div>
            ) : (
              <>
                <ResizableTable
                  columns={documentColumns}
                  data={paginatedDocuments}
                  aria-label="Site documents table"
                  onColumnResize={(columnKey, width) => {
                    console.log(`Column ${columnKey} resized to ${width}px`);
                  }}
                  onSort={handleSort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: tokens.spacingVerticalM,
                    padding: `${tokens.spacingVerticalS} 0`,
                    borderTop: `1px solid ${tokens.colorNeutralStroke2}`
                  }}>
                    <Text size={200}>
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedDocuments.length)} of {filteredAndSortedDocuments.length} documents
                    </Text>
                    <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, alignItems: 'center' }}>
                      <Button
                        appearance="transparent"
                        size="small"
                        disabled={currentPage === 1}
                        onClick={handlePreviousPage}
                      >
                        Previous
                      </Button>
                      <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS }}>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              appearance={currentPage === pageNum ? "primary" : "transparent"}
                              size="small"
                              onClick={() => handlePageChange(pageNum)}
                              style={{ minWidth: '32px' }}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        appearance="transparent"
                        size="small"
                        disabled={currentPage === totalPages}
                        onClick={handleNextPage}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assign Approvers Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={(_, data) => setIsAssignDialogOpen(data.open)}>
        <DialogSurface className={styles.dialog}>
          <DialogTitle>Assign Approvers to Documents</DialogTitle>
          <DialogBody>
            <DialogContent>
              <Text>
                Select approvers to assign to {selectedDocuments.length} selected document{selectedDocuments.length !== 1 ? 's' : ''}.
              </Text>
              
              <Field label="Search for users or groups" style={{ marginTop: tokens.spacingVerticalM }}>
                <Input 
                  placeholder="Type to search..." 
                  value={approverSearchQuery}
                  onChange={(_, data) => setApproverSearchQuery(data.value)}
                />
              </Field>

              <div style={{ 
                marginTop: tokens.spacingVerticalS,
                padding: tokens.spacingVerticalS,
                backgroundColor: tokens.colorNeutralBackground2,
                borderRadius: tokens.borderRadiusSmall
              }}>
                <Text weight="semibold" size={300}>
                  Selected Approvers ({selectedApprovers.length})
                </Text>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, marginTop: tokens.spacingVerticalXS }}>
                  {selectedApprovers.map((approverId) => (
                    <div key={approverId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacingHorizontalXS,
                      padding: tokens.spacingVerticalXS,
                      backgroundColor: tokens.colorBrandBackground2,
                      borderRadius: tokens.borderRadiusSmall,
                      fontSize: '12px',
                    }}>
                      <Text size={200}>{approverId}</Text>
                      <Button
                        size="small"
                        appearance="transparent"
                        onClick={() => handleRemoveApprover(approverId)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: tokens.spacingVerticalM }}>
                <Text weight="semibold" size={300}>Available Users</Text>
                <div style={{ marginTop: tokens.spacingVerticalS }}>
                  {mockApprovers
                    .filter(approver => 
                      approver.name.toLowerCase().includes(approverSearchQuery.toLowerCase()) ||
                      approver.email.toLowerCase().includes(approverSearchQuery.toLowerCase()) ||
                      approver.role.toLowerCase().includes(approverSearchQuery.toLowerCase())
                    )
                    .map((approver) => (
                    <div
                      key={approver.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: tokens.spacingHorizontalM,
                        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
                        cursor: 'pointer',
                        borderRadius: tokens.borderRadiusSmall,
                        backgroundColor: selectedApprovers.includes(approver.name) 
                          ? tokens.colorBrandBackground2 
                          : 'transparent',
                        transition: 'background-color 0.1s ease',
                      }}
                      onClick={() => handleAddApprover(approver.name)}
                      onMouseEnter={(e) => {
                        if (!selectedApprovers.includes(approver.name)) {
                          e.currentTarget.style.backgroundColor = tokens.colorNeutralBackground2;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedApprovers.includes(approver.name)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Checkbox
                        checked={selectedApprovers.includes(approver.name)}
                        onChange={(_, data) => {
                          if (data.checked) {
                            handleAddApprover(approver.name);
                          } else {
                            handleRemoveApprover(approver.name);
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <Avatar 
                          size={32} 
                          name={approver.name}
                          style={{
                            backgroundColor: approver.isOnline ? '#6BB700' : '#8A8886',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        />
                        {approver.isOnline && (
                          <div style={{
                            position: 'absolute',
                            bottom: '1px',
                            right: '1px',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#6BB700',
                            border: `2px solid ${tokens.colorNeutralBackground1}`,
                          }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: tokens.colorNeutralForeground1,
                        }}>
                          {approver.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: approver.isOnline ? '#6BB700' : '#8A8886',
                          fontWeight: '500',
                        }}>
                          {approver.isOnline ? 'Available' : 'Away'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </DialogBody>
          <DialogActions>
            <DialogTrigger>
              <Button appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button 
              appearance="primary" 
              onClick={() => handleBulkAssignApprovers(selectedApprovers)}
              disabled={selectedApprovers.length === 0}
            >
              Assign to {selectedDocuments.length} Document{selectedDocuments.length !== 1 ? 's' : ''}
            </Button>
          </DialogActions>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
