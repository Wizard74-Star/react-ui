import React, { useState } from 'react';
import {
  Text,
  Button,
  makeStyles,
  tokens,
  Tab,
  TabList,
  TabValue,
} from '@fluentui/react-components';
import {
  DocumentRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  WarningRegular,
  DataBarVerticalRegular,
  ArrowDownloadRegular,
} from '@fluentui/react-icons';
import { MetricCard } from '../ui/MetricCard';

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
  documentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  empty: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  filterPanel: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
  },
  filterSection: {
    marginBottom: tokens.spacingVerticalL,
  },
  filterTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  chartsRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalL,
  },
  chartContainer: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalL,
    flex: 1,
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  chartControls: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  statusChart: {
    height: '280px',
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'space-evenly',
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalM}`,
    backgroundColor: '#FAFAFA',
    borderRadius: tokens.borderRadiusSmall,
    position: 'relative',
  },
  chartBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    minWidth: '80px',
  },
  bar: {
    width: '48px',
    borderRadius: '3px 3px 0 0',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '12px',
    paddingTop: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
    },
  },
  barLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
  },
  trendChart: {
    height: '280px',
    backgroundColor: '#FAFAFA',
    borderRadius: tokens.borderRadiusSmall,
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  trendBars: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    height: '200px',
    paddingTop: tokens.spacingVerticalM,
  },
  trendBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalS,
    flex: 1,
    maxWidth: '60px',
  },
  stackedBar: {
    width: '32px',
    borderRadius: '2px',
    display: 'flex',
    flexDirection: 'column-reverse',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  stackSegment: {
    minHeight: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: '600',
    color: 'white',
  },
  dayLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalL,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
  legendText: {
    fontSize: '12px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground2,
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  resultsCount: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  sortOptions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
  },
});

// Mock data
const mockDocuments = [
  {
    id: '1',
    name: 'Employee Handbook 2024',
    library: 'HR Documents',
    site: 'Staffing & HRM',
    reviewDate: '2024-09-15',
    status: 'due-soon' as const,
    branch: 'Main Office',
    department: 'Human Resources',
    author: 'Sarah Johnson',
    version: '2.1',
    approvers: ['John Smith', 'Mike Wilson'],
  },
  {
    id: '2',
    name: 'Safety Procedures Manual',
    library: 'Compliance',
    site: 'Work Health & Safety',
    reviewDate: '2024-09-10',
    status: 'overdue' as const,
    branch: 'Factory A',
    department: 'Safety',
    author: 'Lisa Brown',
    version: '1.8',
    approvers: ['David Lee', 'Emma Davis'],
  },
  {
    id: '3',
    name: 'Quality Standards V3.2',
    library: 'Quality Management',
    site: 'Quality',
    reviewDate: '2024-09-20',
    status: 'pending' as const,
    branch: 'Main Office',
    department: 'Quality Assurance',
    author: 'Robert Taylor',
    version: '3.2',
    approvers: ['Jennifer White', 'Michael Chen'],
  },
  {
    id: '4',
    name: 'Customer Service Guidelines',
    library: 'Operations',
    site: 'Business Development & Estimating',
    reviewDate: '2024-09-18',
    status: 'due-soon' as const,
    branch: 'Service Hub',
    department: 'Customer Service',
    author: 'Amanda Rodriguez',
    version: '1.5',
    approvers: ['Kevin Park', 'Rachel Green'],
  },
];


export const AnalyticsPage: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<TabValue>('analytics');

  const handleRefreshData = () => {
    // In a real app, this would refresh data from the API
    alert('Data refreshed! Latest analytics have been loaded.');
  };

  const handleExportAnalytics = () => {
    // Export analytics data as CSV
    const statusCounts = getStatusCounts();
    const csvContent = [
      ['Status', 'Count'].join(','),
      ['Approved', statusCounts['approved']].join(','),
      ['Pending', statusCounts['pending']].join(','),
      ['Due Soon', statusCounts['due-soon']].join(','),
      ['Overdue', statusCounts['overdue']].join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    // Generate comprehensive report
    const statusCounts = getStatusCounts();
    const totalDocs = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    
    const reportContent = [
      'BMS Document Analytics Report',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'Document Status Summary:',
      `• Total Documents: ${totalDocs}`,
      `• Approved: ${statusCounts['approved']} (${Math.round(statusCounts['approved']/totalDocs*100)}%)`,
      `• Pending: ${statusCounts['pending']} (${Math.round(statusCounts['pending']/totalDocs*100)}%)`,
      `• Due Soon: ${statusCounts['due-soon']} (${Math.round(statusCounts['due-soon']/totalDocs*100)}%)`,
      `• Overdue: ${statusCounts['overdue']} (${Math.round(statusCounts['overdue']/totalDocs*100)}%)`,
    ].join('\n');

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BMS_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Analytics report generated and downloaded!');
  };


  const getStatusCounts = () => {
    const counts = { 'due-soon': 0, 'overdue': 0, 'pending': 0, 'approved': 0 };
    mockDocuments.forEach(doc => {
      counts[doc.status] = (counts[doc.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
          <Button 
            appearance="secondary" 
            icon={<DataBarVerticalRegular />}
            onClick={handleRefreshData}
          >
            Refresh
          </Button>
          <Button 
            appearance="secondary" 
            icon={<ArrowDownloadRegular />}
            onClick={handleExportAnalytics}
          >
            Export
          </Button>
        </div>
      </div>

      <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(data.value)}>
        <Tab value="analytics">Analytics & Metrics</Tab>
        <Tab value="reports">Reports</Tab>
      </TabList>

        <div className={styles.tabContent}>
          {selectedTab === 'analytics' && (
            <div>
              <div className={styles.metricsGrid}>
                <MetricCard
                  title="Total Documents"
                  value={mockDocuments.length}
                  icon={<DocumentRegular />}
                  color="brand"
                />
                <MetricCard
                  title="Due Soon"
                  value={statusCounts['due-soon']}
                  icon={<ClockRegular />}
                  color="brand"
                />
                <MetricCard
                  title="Overdue"
                  value={statusCounts['overdue']}
                  icon={<WarningRegular />}
                  color="danger"
                />
                <MetricCard
                  title="Pending Review"
                  value={statusCounts['pending']}
                  icon={<CheckmarkCircleRegular />}
                  color="warning"
                />
              </div>

              <div className={styles.chartsRow}>
                <div className={styles.chartContainer}>
                  <div className={styles.chartHeader}>
                    <div className={styles.chartTitle}>
                      Document Status Distribution
                    </div>
                    <div className={styles.chartControls}>
                      <Button size="small" appearance="transparent" icon={<DataBarVerticalRegular />}>
                        Pie Chart
                      </Button>
                      <Button size="small" appearance="transparent" icon={<DataBarVerticalRegular />}>
                        Bar Chart
                      </Button>
                    </div>
                  </div>
                  <div className={styles.statusChart}>
                    <div className={styles.chartBar}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${Math.max(30, (statusCounts['approved'] / Math.max(...Object.values(statusCounts))) * 200)}px`,
                          backgroundColor: '#107C10'
                        }}
                      >
                        {statusCounts['approved']}
                      </div>
                      <div className={styles.barLabel}>Approved</div>
                    </div>
                    <div className={styles.chartBar}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${Math.max(30, (statusCounts['pending'] / Math.max(...Object.values(statusCounts))) * 200)}px`,
                          backgroundColor: '#FFB900'
                        }}
                      >
                        {statusCounts['pending']}
                      </div>
                      <div className={styles.barLabel}>Pending</div>
                    </div>
                    <div className={styles.chartBar}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${Math.max(30, (statusCounts['due-soon'] / Math.max(...Object.values(statusCounts))) * 200)}px`,
                          backgroundColor: '#D83B01'
                        }}
                      >
                        {statusCounts['due-soon']}
                      </div>
                      <div className={styles.barLabel}>Due Soon</div>
                    </div>
                    <div className={styles.chartBar}>
                      <div 
                        className={styles.bar} 
                        style={{ 
                          height: `${Math.max(30, (statusCounts['overdue'] / Math.max(...Object.values(statusCounts))) * 200)}px`,
                          backgroundColor: '#A4262C'
                        }}
                      >
                        {statusCounts['overdue']}
                      </div>
                      <div className={styles.barLabel}>Overdue</div>
                    </div>
                  </div>
                </div>

                <div className={styles.chartContainer}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>
                    Review Trends Over Time
                  </div>
                  <div className={styles.chartControls}>
                    <Button size="small" appearance="transparent" icon={<DataBarVerticalRegular />}>
                      Line Chart
                    </Button>
                    <Button size="small" appearance="transparent" icon={<DataBarVerticalRegular />}>
                      Bar Chart
                    </Button>
                  </div>
                </div>
                <div className={styles.trendChart}>
                  <div className={styles.trendBars}>
                    {/* Sample trend data for last 7 days */}
                    {[
                      { day: 'Mon', approved: 12, pending: 8 },
                      { day: 'Tue', approved: 15, pending: 6 },
                      { day: 'Wed', approved: 18, pending: 10 },
                      { day: 'Thu', approved: 14, pending: 7 },
                      { day: 'Fri', approved: 20, pending: 12 },
                      { day: 'Sat', approved: 8, pending: 4 },
                      { day: 'Sun', approved: 10, pending: 5 },
                    ].map((data) => (
                      <div key={data.day} className={styles.trendBar}>
                        <div className={styles.stackedBar}>
                          <div 
                            className={styles.stackSegment}
                            style={{ 
                              height: `${Math.max(20, data.approved * 6)}px`, 
                              backgroundColor: '#107C10'
                            }}
                            title={`Approved: ${data.approved}`}
                          >
                            {data.approved > 2 ? data.approved : ''}
                          </div>
                          <div 
                            className={styles.stackSegment}
                            style={{ 
                              height: `${Math.max(20, data.pending * 6)}px`, 
                              backgroundColor: '#FFB900'
                            }}
                            title={`Pending: ${data.pending}`}
                          >
                            {data.pending > 2 ? data.pending : ''}
                          </div>
                        </div>
                        <div className={styles.dayLabel}>{data.day}</div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendColor} style={{ backgroundColor: '#107C10' }} />
                      <div className={styles.legendText}>Approved</div>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendColor} style={{ backgroundColor: '#FFB900' }} />
                      <div className={styles.legendText}>Pending</div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reports' && (
            <div className={styles.empty}>
              <DataBarVerticalRegular style={{ fontSize: '48px', marginBottom: tokens.spacingVerticalM }} />
              <Text>Reports Section</Text>
              <Text size={200}>Generate and download custom reports</Text>
              <div style={{ marginTop: tokens.spacingVerticalL }}>
                <Button 
                  appearance="primary" 
                  icon={<ArrowDownloadRegular />}
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};
