import React from 'react';
import {
  Card,
  CardPreview,
  CardFooter,
  Text,
  Badge,
  Button,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  DocumentRegular,
  MoreHorizontalRegular,
  CalendarRegular,
  BuildingRegular,
  CheckmarkCircleRegular,
  ClockRegular,
  WarningRegular,
} from '@fluentui/react-icons';

export interface DocumentCardProps {
  id: string;
  name: string;
  library: string;
  site: string;
  reviewDate: string;
  status: 'due-soon' | 'overdue' | 'pending' | 'approved';
  branch: string;
  department: string;
  author: string;
  version: string;
  approvers?: string[];
  onView?: (id: string) => void;
  onManageApprovers?: (id: string) => void;
  onViewHistory?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const useStyles = makeStyles({
  card: {
    width: '100%',
    minHeight: '120px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  preview: {
    padding: tokens.spacingVerticalM,
  },
  header: {
    marginBottom: tokens.spacingVerticalS,
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalXS,
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  metadataRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  statusBadge: {
    marginLeft: 'auto',
  },
  footer: {
    padding: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
  statusIcon: {
    fontSize: '16px',
  },
});

const getStatusConfig = (status: DocumentCardProps['status']) => {
  switch (status) {
    case 'due-soon':
      return {
        color: 'brand' as const,
        icon: <ClockRegular className={useStyles().statusIcon} />,
        text: 'Due Soon',
      };
    case 'overdue':
      return {
        color: 'danger' as const,
        icon: <WarningRegular className={useStyles().statusIcon} />,
        text: 'Overdue',
      };
    case 'pending':
      return {
        color: 'warning' as const,
        icon: <ClockRegular className={useStyles().statusIcon} />,
        text: 'Pending',
      };
    case 'approved':
      return {
        color: 'success' as const,
        icon: <CheckmarkCircleRegular className={useStyles().statusIcon} />,
        text: 'Approved',
      };
    default:
      return {
        color: 'subtle' as const,
        icon: <ClockRegular className={useStyles().statusIcon} />,
        text: 'Unknown',
      };
  }
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  name,
  library,
  site,
  reviewDate,
  status,
  branch,
  department,
  author,
  version,
  approvers = [],
  onView,
  onManageApprovers,
  onViewHistory,
  onApprove,
  onReject,
}) => {
  const styles = useStyles();
  const statusConfig = getStatusConfig(status);

  return (
    <Card className={styles.card}>
      <CardPreview className={styles.preview}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <DocumentRegular style={{ fontSize: '20px', color: tokens.colorBrandForeground1 }} />
            <Text className={styles.title} size={400}>
              {name}
            </Text>
            <Badge className={styles.statusBadge} color={statusConfig.color} size="small">
              {statusConfig.icon}
              {statusConfig.text}
            </Badge>
          </div>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metadataRow}>
            <BuildingRegular style={{ fontSize: '14px', color: tokens.colorNeutralForeground3 }} />
            <Text size={200}>{library} • {site}</Text>
          </div>
          <div className={styles.metadataRow}>
            <CalendarRegular style={{ fontSize: '14px', color: tokens.colorNeutralForeground3 }} />
            <Text size={200}>Review: {reviewDate}</Text>
          </div>
          <div className={styles.metadataRow}>
            <BuildingRegular style={{ fontSize: '14px', color: tokens.colorNeutralForeground3 }} />
            <Text size={200}>{branch} • {department}</Text>
          </div>
          <div className={styles.metadataRow}>
            <Text size={200}>v{version} • {approvers.length} approver{approvers.length !== 1 ? 's' : ''}</Text>
          </div>
        </div>
      </CardPreview>

      <CardFooter className={styles.footer}>
        <div className={styles.author}>
          <Avatar size={24} name={author} />
          <Text size={200}>{author}</Text>
        </div>

        <div className={styles.actions}>
          {status === 'pending' && (
            <>
              <Button
                size="small"
                appearance="primary"
                icon={<CheckmarkCircleRegular />}
                onClick={() => onApprove?.(id)}
              >
                Approve
              </Button>
              <Button
                size="small"
                appearance="secondary"
                onClick={() => onReject?.(id)}
              >
                Reject
              </Button>
            </>
          )}
          
          <Menu>
            <MenuTrigger>
              <Button
                size="small"
                appearance="transparent"
                icon={<MoreHorizontalRegular />}
              />
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <MenuItem onClick={() => onView?.(id)}>View Document</MenuItem>
                <MenuItem onClick={() => onManageApprovers?.(id)}>Manage Approvers</MenuItem>
                <MenuItem onClick={() => onViewHistory?.(id)}>View History</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        </div>
      </CardFooter>
    </Card>
  );
};
