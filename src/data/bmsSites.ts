export interface BMSSite {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  category: 'governance' | 'operations' | 'safety' | 'quality' | 'hr' | 'finance' | 'environment' | 'technology';
  documentCount: number;
  approverCount: number;
  lastActivity: string;
  manager: {
    name: string;
    email: string;
    avatar: string;
  };
  status: 'active' | 'maintenance' | 'archived';
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canApprove: boolean;
    canAdmin: boolean;
  };
  recentDocuments: Array<{
    id: string;
    name: string;
    type: string;
    lastModified: string;
    status: 'draft' | 'pending' | 'approved' | 'overdue';
  }>;
  metrics: {
    totalDocuments: number;
    pendingApprovals: number;
    overdueDocuments: number;
    completedThisMonth: number;
  };
}

export const bmsSampleSites: BMSSite[] = [
  {
    id: 'governance-policies',
    name: 'The Kane Way, Governance and Policies',
    description: 'Corporate governance, policies, procedures, and strategic documents',
    avatar: 'KW',
    color: '#0078d4',
    category: 'governance',
    documentCount: 156,
    approverCount: 12,
    lastActivity: '2024-01-15T10:30:00Z',
    manager: {
      name: 'Michael Kane',
      email: 'michael.kane@bms.com',
      avatar: 'MK'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: false,
      canApprove: false,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-001',
        name: 'Corporate Governance Framework 2024',
        type: 'Policy',
        lastModified: '2024-01-15T10:30:00Z',
        status: 'approved'
      },
      {
        id: 'doc-002',
        name: 'Strategic Planning Guidelines',
        type: 'Procedure',
        lastModified: '2024-01-14T16:45:00Z',
        status: 'pending'
      },
      {
        id: 'doc-003',
        name: 'Code of Conduct Update',
        type: 'Policy',
        lastModified: '2024-01-13T09:15:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 156,
      pendingApprovals: 8,
      overdueDocuments: 2,
      completedThisMonth: 23
    }
  },
  {
    id: 'staffing-hrm',
    name: 'Staffing & Human Resource Management',
    description: 'HR policies, recruitment, training, employee relations, and workforce management',
    avatar: 'HR',
    color: '#107c10',
    category: 'hr',
    documentCount: 243,
    approverCount: 8,
    lastActivity: '2024-01-15T14:20:00Z',
    manager: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@bms.com',
      avatar: 'SJ'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: true,
      canApprove: false,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-101',
        name: 'Employee Handbook 2024',
        type: 'Manual',
        lastModified: '2024-01-15T14:20:00Z',
        status: 'pending'
      },
      {
        id: 'doc-102',
        name: 'Remote Work Policy',
        type: 'Policy',
        lastModified: '2024-01-15T11:30:00Z',
        status: 'approved'
      },
      {
        id: 'doc-103',
        name: 'Performance Review Process',
        type: 'Procedure',
        lastModified: '2024-01-14T13:45:00Z',
        status: 'overdue'
      }
    ],
    metrics: {
      totalDocuments: 243,
      pendingApprovals: 15,
      overdueDocuments: 4,
      completedThisMonth: 31
    }
  },
  {
    id: 'construction-operations',
    name: 'Construction & Field Operations',
    description: 'Construction standards, field procedures, project management, and operational guidelines',
    avatar: 'CO',
    color: '#d83b01',
    category: 'operations',
    documentCount: 387,
    approverCount: 15,
    lastActivity: '2024-01-15T16:10:00Z',
    manager: {
      name: 'Robert Taylor',
      email: 'robert.taylor@bms.com',
      avatar: 'RT'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: true,
      canApprove: true,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-201',
        name: 'Site Safety Protocols',
        type: 'Standard',
        lastModified: '2024-01-15T16:10:00Z',
        status: 'approved'
      },
      {
        id: 'doc-202',
        name: 'Equipment Maintenance Schedule',
        type: 'Schedule',
        lastModified: '2024-01-15T12:00:00Z',
        status: 'pending'
      },
      {
        id: 'doc-203',
        name: 'Project Handover Checklist',
        type: 'Checklist',
        lastModified: '2024-01-14T15:30:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 387,
      pendingApprovals: 22,
      overdueDocuments: 7,
      completedThisMonth: 45
    }
  },
  {
    id: 'quality-assurance',
    name: 'Quality Assurance & Control',
    description: 'Quality standards, testing procedures, compliance documentation, and quality metrics',
    avatar: 'QA',
    color: '#8764b8',
    category: 'quality',
    documentCount: 198,
    approverCount: 10,
    lastActivity: '2024-01-15T13:45:00Z',
    manager: {
      name: 'Jennifer White',
      email: 'jennifer.white@bms.com',
      avatar: 'JW'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: false,
      canApprove: true,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-301',
        name: 'Quality Control Standards V3.2',
        type: 'Standard',
        lastModified: '2024-01-15T13:45:00Z',
        status: 'pending'
      },
      {
        id: 'doc-302',
        name: 'ISO 9001 Compliance Checklist',
        type: 'Checklist',
        lastModified: '2024-01-14T10:20:00Z',
        status: 'approved'
      },
      {
        id: 'doc-303',
        name: 'Material Testing Procedures',
        type: 'Procedure',
        lastModified: '2024-01-13T14:15:00Z',
        status: 'overdue'
      }
    ],
    metrics: {
      totalDocuments: 198,
      pendingApprovals: 12,
      overdueDocuments: 3,
      completedThisMonth: 28
    }
  },
  {
    id: 'work-health-safety',
    name: 'Work Health & Safety',
    description: 'Safety policies, incident procedures, risk assessments, and health protocols',
    avatar: 'WHS',
    color: '#e74c3c',
    category: 'safety',
    documentCount: 312,
    approverCount: 18,
    lastActivity: '2024-01-15T15:30:00Z',
    manager: {
      name: 'Lisa Brown',
      email: 'lisa.brown@bms.com',
      avatar: 'LB'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: true,
      canApprove: true,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-401',
        name: 'Emergency Response Plan',
        type: 'Plan',
        lastModified: '2024-01-15T15:30:00Z',
        status: 'approved'
      },
      {
        id: 'doc-402',
        name: 'Personal Protective Equipment Guidelines',
        type: 'Guideline',
        lastModified: '2024-01-15T09:45:00Z',
        status: 'pending'
      },
      {
        id: 'doc-403',
        name: 'Incident Reporting Procedure',
        type: 'Procedure',
        lastModified: '2024-01-14T11:30:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 312,
      pendingApprovals: 19,
      overdueDocuments: 5,
      completedThisMonth: 38
    }
  },
  {
    id: 'environmental-management',
    name: 'Environmental Management',
    description: 'Environmental policies, sustainability initiatives, compliance, and impact assessments',
    avatar: 'ENV',
    color: '#27ae60',
    category: 'environment',
    documentCount: 134,
    approverCount: 6,
    lastActivity: '2024-01-15T11:15:00Z',
    manager: {
      name: 'David Lee',
      email: 'david.lee@bms.com',
      avatar: 'DL'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: false,
      canApprove: false,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-501',
        name: 'Waste Management Protocol',
        type: 'Protocol',
        lastModified: '2024-01-15T11:15:00Z',
        status: 'approved'
      },
      {
        id: 'doc-502',
        name: 'Carbon Footprint Assessment',
        type: 'Assessment',
        lastModified: '2024-01-14T16:30:00Z',
        status: 'pending'
      },
      {
        id: 'doc-503',
        name: 'Environmental Impact Guidelines',
        type: 'Guideline',
        lastModified: '2024-01-13T12:45:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 134,
      pendingApprovals: 7,
      overdueDocuments: 1,
      completedThisMonth: 18
    }
  },
  {
    id: 'business-development',
    name: 'Business Development & Estimating',
    description: 'Sales processes, client relations, project estimation, and business growth strategies',
    avatar: 'BD',
    color: '#f39c12',
    category: 'operations',
    documentCount: 176,
    approverCount: 9,
    lastActivity: '2024-01-15T12:40:00Z',
    manager: {
      name: 'Amanda Rodriguez',
      email: 'amanda.rodriguez@bms.com',
      avatar: 'AR'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: true,
      canApprove: false,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-601',
        name: 'Client Onboarding Process',
        type: 'Process',
        lastModified: '2024-01-15T12:40:00Z',
        status: 'pending'
      },
      {
        id: 'doc-602',
        name: 'Cost Estimation Guidelines',
        type: 'Guideline',
        lastModified: '2024-01-14T14:20:00Z',
        status: 'approved'
      },
      {
        id: 'doc-603',
        name: 'Proposal Template 2024',
        type: 'Template',
        lastModified: '2024-01-13T10:30:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 176,
      pendingApprovals: 11,
      overdueDocuments: 2,
      completedThisMonth: 24
    }
  },
  {
    id: 'finance-accounting',
    name: 'Finance & Accounting',
    description: 'Financial policies, accounting procedures, budgeting, and financial reporting',
    avatar: 'FIN',
    color: '#2c3e50',
    category: 'finance',
    documentCount: 89,
    approverCount: 5,
    lastActivity: '2024-01-15T09:20:00Z',
    manager: {
      name: 'Kevin Park',
      email: 'kevin.park@bms.com',
      avatar: 'KP'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: false,
      canApprove: false,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-701',
        name: 'Annual Budget Guidelines',
        type: 'Guideline',
        lastModified: '2024-01-15T09:20:00Z',
        status: 'approved'
      },
      {
        id: 'doc-702',
        name: 'Expense Approval Matrix',
        type: 'Matrix',
        lastModified: '2024-01-14T15:45:00Z',
        status: 'pending'
      },
      {
        id: 'doc-703',
        name: 'Financial Reporting Standards',
        type: 'Standard',
        lastModified: '2024-01-13T11:20:00Z',
        status: 'overdue'
      }
    ],
    metrics: {
      totalDocuments: 89,
      pendingApprovals: 4,
      overdueDocuments: 2,
      completedThisMonth: 12
    }
  },
  {
    id: 'it-digital',
    name: 'Information Technology & Digital Systems',
    description: 'IT policies, system documentation, cybersecurity, and digital transformation',
    avatar: 'IT',
    color: '#9b59b6',
    category: 'technology',
    documentCount: 167,
    approverCount: 7,
    lastActivity: '2024-01-15T14:50:00Z',
    manager: {
      name: 'Rachel Green',
      email: 'rachel.green@bms.com',
      avatar: 'RG'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: true,
      canApprove: true,
      canAdmin: true
    },
    recentDocuments: [
      {
        id: 'doc-801',
        name: 'Cybersecurity Policy 2024',
        type: 'Policy',
        lastModified: '2024-01-15T14:50:00Z',
        status: 'pending'
      },
      {
        id: 'doc-802',
        name: 'System Backup Procedures',
        type: 'Procedure',
        lastModified: '2024-01-14T13:30:00Z',
        status: 'approved'
      },
      {
        id: 'doc-803',
        name: 'Software License Management',
        type: 'Manual',
        lastModified: '2024-01-13T16:15:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 167,
      pendingApprovals: 9,
      overdueDocuments: 1,
      completedThisMonth: 21
    }
  },
  {
    id: 'training-development',
    name: 'Training & Professional Development',
    description: 'Training materials, competency frameworks, certification programs, and skill development',
    avatar: 'TD',
    color: '#16a085',
    category: 'hr',
    documentCount: 203,
    approverCount: 11,
    lastActivity: '2024-01-15T10:45:00Z',
    manager: {
      name: 'Emma Davis',
      email: 'emma.davis@bms.com',
      avatar: 'ED'
    },
    status: 'active',
    permissions: {
      canRead: true,
      canWrite: true,
      canApprove: false,
      canAdmin: false
    },
    recentDocuments: [
      {
        id: 'doc-901',
        name: 'Leadership Development Program',
        type: 'Program',
        lastModified: '2024-01-15T10:45:00Z',
        status: 'approved'
      },
      {
        id: 'doc-902',
        name: 'Technical Skills Assessment',
        type: 'Assessment',
        lastModified: '2024-01-14T12:15:00Z',
        status: 'pending'
      },
      {
        id: 'doc-903',
        name: 'Onboarding Training Checklist',
        type: 'Checklist',
        lastModified: '2024-01-13T15:30:00Z',
        status: 'draft'
      }
    ],
    metrics: {
      totalDocuments: 203,
      pendingApprovals: 13,
      overdueDocuments: 3,
      completedThisMonth: 26
    }
  }
];

export const getBMSSiteById = (id: string): BMSSite | undefined => {
  return bmsSampleSites.find(site => site.id === id);
};

export const getBMSSitesByCategory = (category: BMSSite['category']): BMSSite[] => {
  return bmsSampleSites.filter(site => site.category === category);
};

export const getActiveBMSSites = (): BMSSite[] => {
  return bmsSampleSites.filter(site => site.status === 'active');
};

export const getBMSSitesWithPermission = (permission: keyof BMSSite['permissions']): BMSSite[] => {
  return bmsSampleSites.filter(site => site.permissions[permission]);
};

export const getTotalMetrics = () => {
  return bmsSampleSites.reduce((acc, site) => ({
    totalDocuments: acc.totalDocuments + site.metrics.totalDocuments,
    pendingApprovals: acc.pendingApprovals + site.metrics.pendingApprovals,
    overdueDocuments: acc.overdueDocuments + site.metrics.overdueDocuments,
    completedThisMonth: acc.completedThisMonth + site.metrics.completedThisMonth,
  }), {
    totalDocuments: 0,
    pendingApprovals: 0,
    overdueDocuments: 0,
    completedThisMonth: 0,
  });
};
