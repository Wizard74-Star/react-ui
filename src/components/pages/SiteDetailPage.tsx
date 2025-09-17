import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Text,
  Button,
  makeStyles,
  tokens,
  SearchBox,
  Dropdown,
  Option,
  Badge,
  Avatar,
  Checkbox,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
} from '@fluentui/react-components';
import {
  FilterRegular,
  MoreHorizontalRegular,
  EyeRegular,
  PeopleRegular,
  HistoryRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  BuildingRegular,
  ArrowDownloadRegular,
  AlertRegular,
  LocationRegular,
} from '@fluentui/react-icons';
import { getBMSSiteById } from '../../data/bmsSites';
import { BulkActionBar } from '../ui/BulkActionBar';
import { ResizableTable, ColumnDefinition } from '../ui/ResizableTable';
import { 
  generateSharePointDocuments, 
  getApprovalStatusBadge,
  formatDate,
  SharePointDocument
} from '../../data/documentData';
import { FileTypeIcon } from '../ui/FileTypeIcon';

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
    gap: tokens.spacingVerticalL,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacingVerticalL,
  },
  siteInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalM,
  },
  siteIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'white',
    fontWeight: '700',
  },
  siteDetails: {
    flex: 1,
  },
  siteStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
  },
  statCard: {
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'center',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  searchAndFilter: {
    marginTop: tokens.spacingVerticalL,
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  documentsTable: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflow: 'hidden',
    marginBottom: tokens.spacingVerticalL,
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
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: tokens.spacingVerticalL,
  },
  breadcrumb: {
    marginBottom: tokens.spacingVerticalM,
  },
  permissionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalM,
  },
  managerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

// Use SharePoint document structure

// Helper functions moved to documentData.ts

export const SiteDetailPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const styles = useStyles();

  // Get site data
  const site = getBMSSiteById(siteId || '');
  const siteDocuments = useMemo(() => 
    generateSharePointDocuments(siteId || '', site?.documentCount || 50), 
    [siteId, site?.documentCount]
  );

  // State management
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  if (!site) {
    return (
      <div style={{ textAlign: 'center', padding: tokens.spacingVerticalXXL }}>
        <BuildingRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
        <Text>Site not found</Text>
        <Button appearance="primary" onClick={() => navigate('/sites')}>
          Back to Sites
        </Button>
      </div>
    );
  }

  // User permissions (mock - would come from auth context)
  const userPermissions = site.permissions;

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = siteDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.modifiedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.departments.some(dept => dept.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           doc.branch.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || doc.approvalStatus.toLowerCase() === filterStatus.toLowerCase();
      const matchesType = filterType === 'all' || doc.fileType === filterType;
      const matchesPriority = filterPriority === 'all' || doc.priority.toLowerCase() === filterPriority.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'modifiedBy':
          aValue = a.modifiedBy.toLowerCase();
          bValue = b.modifiedBy.toLowerCase();
          break;
        case 'modified':
          aValue = new Date(a.modified);
          bValue = new Date(b.modified);
          break;
        case 'status':
          aValue = a.approvalStatus;
          bValue = b.approvalStatus;
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'documentNumber':
          aValue = a.documentNumber;
          bValue = b.documentNumber;
          break;
        case 'version':
          aValue = a.version;
          bValue = b.version;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [siteDocuments, searchQuery, filterStatus, filterType, filterPriority, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedDocuments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDocuments = filteredAndSortedDocuments.slice(startIndex, endIndex);

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

  // Event handlers
  const handleSelectAll = () => {
    setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
  };

  const handleDeselectAll = () => {
    setSelectedDocuments([]);
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
    setSortOrder(direction);
  };

  const handleViewDocument = (documentId: string) => {
    console.log('View document:', documentId);
  };

  const handleManageApprovers = (documentId: string) => {
    console.log('Manage approvers for document:', documentId);
  };

  const handleViewHistory = (documentId: string) => {
    console.log('View history for document:', documentId);
  };

  const handleApprove = (documentId: string) => {
    console.log('Approve document:', documentId);
  };

  const handleReject = (documentId: string) => {
    console.log('Reject document:', documentId);
  };


  const handleBulkAssignApprovers = (approvers: string[]) => {
    console.log('Bulk assign approvers:', approvers, 'to documents:', selectedDocuments);
  };

  const handleBulkApprove = () => {
    console.log('Bulk approve documents:', selectedDocuments);
  };

  const handleBulkReject = () => {
    console.log('Bulk reject documents:', selectedDocuments);
  };

  const handleBulkExport = () => {
    console.log('Bulk export documents:', selectedDocuments);
  };

  const isAllSelected = selectedDocuments.length === paginatedDocuments.length && paginatedDocuments.length > 0;

  // Get unique values for filter dropdowns
  const documentTypes = Array.from(new Set(siteDocuments.map(doc => doc.fileType)));
  const priorities = Array.from(new Set(siteDocuments.map(doc => doc.priority)));

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Breadcrumb */}
        <Breadcrumb className={styles.breadcrumb}>
        <BreadcrumbItem>
          <BreadcrumbButton onClick={() => navigate('/sites')}>
            BMS Sites
          </BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbDivider />
        <BreadcrumbItem>
          <BreadcrumbButton current>{site.name}</BreadcrumbButton>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Site Header */}
      <div className={styles.header}>
        <div style={{ flex: 1 }}>

          {/* Permission Info */}
          <div className={styles.permissionInfo}>
            <Text size={200} weight="semibold">Your permissions:</Text>
            {userPermissions.canRead && <Badge color="success" size="small">Read</Badge>}
            {userPermissions.canWrite && <Badge color="brand" size="small">Write</Badge>}
            {userPermissions.canApprove && <Badge color="warning" size="small">Approve</Badge>}
            {userPermissions.canAdmin && <Badge color="danger" size="small">Admin</Badge>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
          <Button appearance="secondary" icon={<ArrowDownloadRegular />}>
            Export
          </Button>
          <Button appearance="primary" onClick={() => navigate('/sites')}>
            Back to Sites
          </Button>
        </div>
      </div>

      {/* Site Statistics */}
      <div className={styles.siteStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{site.metrics.totalDocuments}</div>
          <div className={styles.statLabel}>Total Documents</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{site.metrics.pendingApprovals}</div>
          <div className={styles.statLabel}>Pending Approvals</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{site.metrics.overdueDocuments}</div>
          <div className={styles.statLabel}>Overdue</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{site.approverCount}</div>
          <div className={styles.statLabel}>Approvers</div>
        </div>
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
                 filterStatus === 'draft' ? 'Draft' :
                 filterStatus === 'pending' ? 'Pending' :
                 filterStatus === 'approved' ? 'Approved' : 'Overdue'}
          onOptionSelect={(_, data) => setFilterStatus(data.optionValue || 'all')}
        >
          <Option value="all">All Status</Option>
          <Option value="draft">Draft</Option>
          <Option value="pending">Pending</Option>
          <Option value="approved">Approved</Option>
          <Option value="overdue">Overdue</Option>
        </Dropdown>
        <Dropdown
          value={filterType === 'all' ? 'All Types' : filterType}
          onOptionSelect={(_, data) => setFilterType(data.optionValue || 'all')}
        >
          <Option value="all">All Types</Option>
          {documentTypes.map(type => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Dropdown>
        <Dropdown
          value={filterPriority === 'all' ? 'All Priorities' : filterPriority}
          onOptionSelect={(_, data) => setFilterPriority(data.optionValue || 'all')}
        >
          <Option value="all">All Priorities</Option>
          {priorities.map(priority => (
            <Option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Option>
          ))}
        </Dropdown>
        <Button appearance="secondary" icon={<FilterRegular />}>
          More Filters
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && (
        <BulkActionBar
          selectedCount={selectedDocuments.length}
          totalCount={paginatedDocuments.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkAssignApprovers={handleBulkAssignApprovers}
          onBulkApprove={handleBulkApprove}
          onBulkReject={handleBulkReject}
          onBulkExport={handleBulkExport}
          onPreviousPage={() => setCurrentPage(Math.max(1, currentPage - 1))}
          onNextPage={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          currentPage={currentPage}
          totalPages={totalPages}
          hasSelection={selectedDocuments.length > 0}
        />
      )}
      </div>

      {/* Documents Table Section - Takes remaining height */}
      <div className={styles.tableSection}>
        <ResizableTable
        columns={columns}
        data={paginatedDocuments}
        aria-label={`Documents in ${site.name}`}
        onColumnResize={(columnKey, width) => {
          console.log(`Column ${columnKey} resized to ${width}px`);
        }}
        onSort={handleSort}
        sortBy={sortBy}
        sortDirection={sortOrder}
      />

        {/* Pagination */}
        <div className={styles.pagination}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <Text size={200}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedDocuments.length)} of {filteredAndSortedDocuments.length} documents
            </Text>
            <Dropdown
              value={pageSize.toString()}
              onOptionSelect={(_, data) => {
                setPageSize(parseInt(data.optionValue || '25'));
                setCurrentPage(1);
              }}
            >
              <Option value="10">10 per page</Option>
              <Option value="25">25 per page</Option>
              <Option value="50">50 per page</Option>
              <Option value="100">100 per page</Option>
            </Dropdown>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <Button
              appearance="transparent"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Text size={200}>
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              appearance="transparent"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Approval Workflow - TODO: Fix component props */}
    </div>
  );
};
