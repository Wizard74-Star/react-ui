export interface SharePointDocument {
  id: string;
  name: string;
  modified: string;
  modifiedBy: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected' | 'Draft' | 'In Review';
  documentNumber: string;
  notifyOnUpdate: boolean;
  state: 'Victoria' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT' | 'National';
  version: string;
  branch: string;
  departments: string[];
  approvers: string[];
  fileType: 'docx' | 'pdf' | 'xlsx' | 'pptx' | 'txt' | 'msg' | 'one';
  fileSize: string;
  createdDate: string;
  createdBy: string;
  reviewDate: string;
  tags: string[];
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  library: string;
  site: string;
}

// Sample document data matching SharePoint structure
export const generateSharePointDocuments = (siteId: string, count: number = 50): SharePointDocument[] => {
  const documentTypes = [
    'Company-Overview', 'Safety-Manual', 'Quality-Standards', 'HR-Policy', 
    'Environmental-Guidelines', 'Training-Materials', 'Compliance-Report',
    'Project-Specifications', 'Financial-Procedures', 'IT-Standards'
  ];
  
  const modifiedByUsers = [
    'Dahn Thanh Tran', 'Sarah Johnson', 'Michael Kane', 'Robert Taylor', 
    'Jennifer White', 'Lisa Brown', 'David Lee', 'Amanda Rodriguez', 
    'Kevin Park', 'Rachel Green', 'Emma Davis', 'John Smith'
  ];
  
  const approvalStatuses: SharePointDocument['approvalStatus'][] = [
    'Approved', 'Pending', 'In Review', 'Draft'
  ];
  
  const states: SharePointDocument['state'][] = [
    'Victoria', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT', 'National'
  ];
  
  const branches = [
    'Head Office', 'Melbourne', 'Sydney', 'Brisbane', 'Perth', 
    'Adelaide', 'Hobart', 'Darwin', 'Canberra', 'Regional'
  ];
  
  const departments = [
    ['Safety', 'Operations'], 
    ['HR', 'Training'], 
    ['Quality', 'Compliance'], 
    ['Finance', 'Accounting'],
    ['IT', 'Digital'], 
    ['Environment', 'Sustainability'],
    ['Construction', 'Engineering'],
    ['Business Development', 'Sales'],
    ['Legal', 'Risk Management'],
    ['Executive', 'Strategy']
  ];
  
  const approvers = [
    'John Smith', 'Mike Wilson', 'Sarah Chen', 'David Park',
    'Lisa Wang', 'Robert Kim', 'Emma Thompson', 'James Lee'
  ];
  
  const fileTypes: SharePointDocument['fileType'][] = ['docx', 'pdf', 'xlsx', 'pptx', 'txt', 'msg', 'one'];
  const priorities: SharePointDocument['priority'][] = ['Low', 'Medium', 'High', 'Urgent'];
  
  return Array.from({ length: count }, (_, index) => {
    const docType = documentTypes[index % documentTypes.length];
    const modifiedBy = modifiedByUsers[index % modifiedByUsers.length];
    const approvalStatus = approvalStatuses[index % approvalStatuses.length];
    const state = states[index % states.length];
    const branch = branches[index % branches.length];
    const departmentSet = departments[index % departments.length];
    const fileType = fileTypes[index % fileTypes.length];
    const priority = priorities[index % priorities.length];
    
    // Generate realistic dates
    const createdDate = new Date(2024, 0, 1 + index);
    const modifiedDate = new Date(createdDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)); // 0-30 days after creation
    const reviewDate = new Date(modifiedDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days after modification
    
    return {
      id: `${siteId}-doc-${String(index + 1).padStart(3, '0')}`,
      name: `${docType}${index + 1}.${fileType}`,
      modified: modifiedDate.toISOString(),
      modifiedBy,
      approvalStatus,
      documentNumber: `DOC-${String(index + 1).padStart(4, '0')}`,
      notifyOnUpdate: Math.random() > 0.5,
      state,
      version: `${Math.floor(index / 10) + 1}.${(index % 10) + 1}`,
      branch,
      departments: departmentSet,
      approvers: approvers.slice(0, Math.floor(Math.random() * 3) + 1),
      fileType,
      fileSize: `${Math.floor(Math.random() * 5000) + 100} KB`,
      createdDate: createdDate.toISOString(),
      createdBy: modifiedByUsers[Math.floor(Math.random() * modifiedByUsers.length)],
      reviewDate: reviewDate.toISOString(),
      tags: ['Important', 'Review Required', 'Updated', 'Critical'].slice(0, Math.floor(Math.random() * 3) + 1),
      category: docType.split('-')[0],
      priority,
      library: `${docType.split('-')[0]} Documents`,
      site: siteId,
    };
  });
};

// Helper functions for table display
export const getApprovalStatusBadge = (status: SharePointDocument['approvalStatus']) => {
  switch (status) {
    case 'Approved':
      return { color: 'success' as const, text: 'Approved' };
    case 'Pending':
      return { color: 'warning' as const, text: 'Pending' };
    case 'In Review':
      return { color: 'brand' as const, text: 'In Review' };
    case 'Rejected':
      return { color: 'danger' as const, text: 'Rejected' };
    case 'Draft':
      return { color: 'subtle' as const, text: 'Draft' };
    default:
      return { color: 'subtle' as const, text: 'Unknown' };
  }
};

export const getPriorityBadge = (priority: SharePointDocument['priority']) => {
  switch (priority) {
    case 'Urgent':
      return { color: 'danger' as const, text: 'Urgent' };
    case 'High':
      return { color: 'warning' as const, text: 'High' };
    case 'Medium':
      return { color: 'brand' as const, text: 'Medium' };
    case 'Low':
      return { color: 'subtle' as const, text: 'Low' };
    default:
      return { color: 'subtle' as const, text: 'Normal' };
  }
};

export const getFileTypeColor = (fileType: SharePointDocument['fileType']) => {
  // Returns appropriate color for file type
  switch (fileType) {
    case 'docx':
      return '#2b579a'; // Word blue
    case 'pdf':
      return '#d83b01'; // PDF red
    case 'xlsx':
      return '#107c10'; // Excel green
    case 'pptx':
      return '#d24726'; // PowerPoint orange
    case 'txt':
      return '#605e5c'; // Text gray
    case 'msg':
      return '#0078d4'; // Outlook blue
    default:
      return '#605e5c'; // Default gray
  }
};

export const formatFileSize = (sizeStr: string): string => {
  const size = parseInt(sizeStr.replace(' KB', ''));
  if (size > 1024) {
    return `${(size / 1024).toFixed(1)} MB`;
  }
  return sizeStr;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};
