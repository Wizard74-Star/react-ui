import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  Checkbox,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  FilterRegular,
  MoreHorizontalRegular,
  EyeRegular,
  PeopleRegular,
  HistoryRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  DocumentRegular,
  AlertRegular,
  LocationRegular,
} from '@fluentui/react-icons';
import { bmsSampleSites } from '../../data/bmsSites';
import { ResizableTable, ColumnDefinition } from '../ui/ResizableTable';
import { generateSharePointDocuments, getApprovalStatusBadge, formatDate, SharePointDocument } from '../../data/documentData';
import { FileTypeIcon } from '../ui/FileTypeIcon';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  breadcrumb: {
    marginBottom: tokens.spacingVerticalS,
  },
  searchAndFilter: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
});

export const SitesPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  
  // Documents search state
  const [documentsSearchQuery, setDocumentsSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [documentFilterStatus, setDocumentFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [documentsCurrentPage, setDocumentsCurrentPage] = useState(1);
  const [documentsPerPage] = useState(15);
  
  // Generate documents from all sites for global search
  const allDocuments = bmsSampleSites.flatMap(site => 
    generateSharePointDocuments(site.id, 10)
  );

  // Reset documents page when search or filter changes
  useEffect(() => {
    setDocumentsCurrentPage(1);
  }, [documentsSearchQuery, documentFilterStatus]);

  // Document search handlers
  const handleDocumentSelect = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  const handleSelectAllDocuments = () => {
    setSelectedDocuments(paginatedDocuments.map(doc => doc.id));
  };

  const handleDeselectAllDocuments = () => {
    setSelectedDocuments([]);
  };

  const handleSort = (columnKey: string, direction: 'asc' | 'desc') => {
    setSortBy(columnKey);
    setSortDirection(direction);
  };

  const handleViewDocument = (documentId: string) => {
    const doc = allDocuments.find(d => d.id === documentId);
    if (doc) {
      window.open(`https://company.sharepoint.com/sites/${doc.site}/Documents/${doc.name}`, '_blank');
    }
  };

  const handleManageApprovers = (documentId: string) => {
    alert(`Approver management for document ${documentId} would open here.`);
  };

  const handleViewHistory = (documentId: string) => {
    alert(`Document history for ${documentId} would display here.`);
  };

  const handleApprove = (documentId: string) => {
    const doc = allDocuments.find(d => d.id === documentId);
    if (doc && doc.approvalStatus === 'Pending') {
      if (window.confirm(`Approve document "${doc.name}"?`)) {
        alert(`Successfully approved "${doc.name}"!`);
      }
    }
  };

  const handleReject = (documentId: string) => {
    const doc = allDocuments.find(d => d.id === documentId);
    if (doc && doc.approvalStatus === 'Pending') {
      const reason = window.prompt(`Reason for rejecting "${doc.name}":`);
      if (reason && reason.trim()) {
        alert(`Successfully rejected "${doc.name}" with reason: "${reason}"`);
      }
    }
  };

  const filteredAndSortedDocuments = allDocuments
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
                           doc.modifiedBy.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
                           doc.documentNumber.toLowerCase().includes(documentsSearchQuery.toLowerCase()) ||
                           doc.departments.some(dept => dept.toLowerCase().includes(documentsSearchQuery.toLowerCase()));
      const matchesFilter = documentFilterStatus === 'all' || doc.approvalStatus.toLowerCase() === documentFilterStatus;
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

  // Documents pagination logic
  const documentsTotalPages = Math.ceil(filteredAndSortedDocuments.length / documentsPerPage);
  const documentsStartIndex = (documentsCurrentPage - 1) * documentsPerPage;
  const documentsEndIndex = documentsStartIndex + documentsPerPage;
  const paginatedDocuments = filteredAndSortedDocuments.slice(documentsStartIndex, documentsEndIndex);

  const handleDocumentsPageChange = (page: number) => {
    setDocumentsCurrentPage(page);
    setSelectedDocuments([]); // Clear selections when changing pages
  };

  const handleDocumentsPreviousPage = () => {
    if (documentsCurrentPage > 1) {
      handleDocumentsPageChange(documentsCurrentPage - 1);
    }
  };

  const handleDocumentsNextPage = () => {
    if (documentsCurrentPage < documentsTotalPages) {
      handleDocumentsPageChange(documentsCurrentPage + 1);
    }
  };

  // Define document table columns matching SharePoint structure
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
              handleSelectAllDocuments();
            } else {
              handleDeselectAllDocuments();
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
        <Text size={200}>{item.branch}</Text>
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
      <div className={styles.header}>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
          <Breadcrumb className={styles.breadcrumb}>
          <BreadcrumbItem>
            <BreadcrumbButton onClick={() => navigate('/sites')}>
              BMS Sites
            </BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton current>Search Documents</BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        </div>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
         
        </div>
      </div>

      {/* Search and Filter */}
      <div className={styles.searchAndFilter}>
        <SearchBox
          placeholder="Search documents across all sites..."
          value={documentsSearchQuery}
          onChange={(_, data) => setDocumentsSearchQuery(data.value)}
          style={{ flex: 1, maxWidth: '400px' }}
        />
        <Dropdown
          value={documentFilterStatus === 'all' ? 'All Status' : 
                 documentFilterStatus === 'approved' ? 'Approved' :
                 documentFilterStatus === 'pending' ? 'Pending' :
                 documentFilterStatus === 'in review' ? 'In Review' :
                 documentFilterStatus === 'rejected' ? 'Rejected' : 'Draft'}
          onOptionSelect={(_, data) => setDocumentFilterStatus(data.optionValue || 'all')}
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

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: tokens.spacingVerticalM 
      }}>
        <Text>
          Showing {documentsStartIndex + 1}-{Math.min(documentsEndIndex, filteredAndSortedDocuments.length)} of {filteredAndSortedDocuments.length} documents across all sites
        </Text>
      </div>

      {/* Documents Table */}
      {filteredAndSortedDocuments.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: tokens.spacingVerticalXXL,
          color: tokens.colorNeutralForeground3 
        }}>
          <DocumentRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
          <Text>No documents found</Text>
          <Text size={200}>Try adjusting your search criteria or filters</Text>
        </div>
      ) : (
        <>
          <ResizableTable
            columns={documentColumns}
            data={paginatedDocuments}
            aria-label="All documents table"
            onColumnResize={(columnKey, width) => {
              console.log(`Column ${columnKey} resized to ${width}px`);
            }}
            onSort={handleSort}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
          
          {/* Pagination Controls */}
          {documentsTotalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: tokens.spacingVerticalM,
              padding: `${tokens.spacingVerticalS} 0`,
              borderTop: `1px solid ${tokens.colorNeutralStroke2}`
            }}>
              <Text size={200}>
                Page {documentsCurrentPage} of {documentsTotalPages}
              </Text>
              <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, alignItems: 'center' }}>
                <Button
                  appearance="transparent"
                  size="small"
                  disabled={documentsCurrentPage === 1}
                  onClick={handleDocumentsPreviousPage}
                >
                  Previous
                </Button>
                <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS }}>
                  {Array.from({ length: Math.min(5, documentsTotalPages) }, (_, i) => {
                    let pageNum;
                    if (documentsTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (documentsCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (documentsCurrentPage >= documentsTotalPages - 2) {
                      pageNum = documentsTotalPages - 4 + i;
                    } else {
                      pageNum = documentsCurrentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        appearance={documentsCurrentPage === pageNum ? "primary" : "transparent"}
                        size="small"
                        onClick={() => handleDocumentsPageChange(pageNum)}
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
                  disabled={documentsCurrentPage === documentsTotalPages}
                  onClick={handleDocumentsNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SitesPage;