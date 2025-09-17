import React from 'react';
import {
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

export interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  color?: 'brand' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

const useStyles = makeStyles({
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalL,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    },
  },
  icon: {
    fontSize: '24px',
    marginBottom: tokens.spacingVerticalS,
  },
  value: {
    fontSize: '24px',
    fontWeight: tokens.fontWeightBold,
    marginBottom: tokens.spacingVerticalXS,
  },
  title: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
});

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = 'brand',
  onClick,
}) => {
  const styles = useStyles();

  const getIconColor = () => {
    switch (color) {
      case 'success':
        return tokens.colorPaletteGreenForeground1;
      case 'warning':
        return tokens.colorPaletteYellowForeground1;
      case 'danger':
        return tokens.colorPaletteRedForeground1;
      default:
        return tokens.colorBrandForeground1;
    }
  };

  const getValueColor = () => {
    switch (color) {
      case 'success':
        return tokens.colorPaletteGreenForeground1;
      case 'warning':
        return tokens.colorPaletteYellowForeground1;
      case 'danger':
        return tokens.colorPaletteRedForeground1;
      default:
        return tokens.colorBrandForeground1;
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.icon} style={{ color: getIconColor() }}>
        {icon}
      </div>
      <div className={styles.value} style={{ color: getValueColor() }}>
        {value.toLocaleString()}
      </div>
      <div className={styles.title}>
        {title}
      </div>
    </div>
  );
};

// Existing metric card components defined below

// Define the existing metric cards if they don't exist
export const DocumentsDueSoonCard: React.FC<{
  value: number;
  change: number;
  onClick?: () => void;
}> = ({ value, change, onClick }) => (
  <div
    style={{
      backgroundColor: tokens.colorNeutralBackground1,
      borderRadius: tokens.borderRadiusMedium,
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: tokens.spacingVerticalL,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }}
    onClick={onClick}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: tokens.spacingVerticalS 
    }}>
      <Text weight="semibold" size={300}>Documents Due Soon</Text>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: tokens.colorPaletteYellowForeground1,
      }} />
    </div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b1b1b', marginBottom: '4px' }}>
      {value}
    </div>
    <Text size={200} style={{ color: change > 0 ? tokens.colorPaletteRedForeground1 : tokens.colorPaletteGreenForeground1 }}>
      {change > 0 ? '+' : ''}{change} from last week
    </Text>
  </div>
);

export const OverdueDocumentsCard: React.FC<{
  value: number;
  change: number;
  onClick?: () => void;
}> = ({ value, change, onClick }) => (
  <div
    style={{
      backgroundColor: tokens.colorNeutralBackground1,
      borderRadius: tokens.borderRadiusMedium,
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: tokens.spacingVerticalL,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }}
    onClick={onClick}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: tokens.spacingVerticalS 
    }}>
      <Text weight="semibold" size={300}>Overdue Documents</Text>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: tokens.colorPaletteRedForeground1,
      }} />
    </div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b1b1b', marginBottom: '4px' }}>
      {value}
    </div>
    <Text size={200} style={{ color: change > 0 ? tokens.colorPaletteRedForeground1 : tokens.colorPaletteGreenForeground1 }}>
      {change > 0 ? '+' : ''}{change} from last week
    </Text>
  </div>
);

export const PendingApprovalsCard: React.FC<{
  value: number;
  change: number;
  onClick?: () => void;
}> = ({ value, change, onClick }) => (
  <div
    style={{
      backgroundColor: tokens.colorNeutralBackground1,
      borderRadius: tokens.borderRadiusMedium,
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: tokens.spacingVerticalL,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }}
    onClick={onClick}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: tokens.spacingVerticalS 
    }}>
      <Text weight="semibold" size={300}>Pending Approvals</Text>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: tokens.colorBrandForeground1,
      }} />
    </div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b1b1b', marginBottom: '4px' }}>
      {value}
    </div>
    <Text size={200} style={{ color: change > 0 ? tokens.colorPaletteRedForeground1 : tokens.colorPaletteGreenForeground1 }}>
      {change > 0 ? '+' : ''}{change} from last week
    </Text>
  </div>
);

export const CompletedThisMonthCard: React.FC<{
  value: number;
  change: number;
  onClick?: () => void;
}> = ({ value, change, onClick }) => (
  <div
    style={{
      backgroundColor: tokens.colorNeutralBackground1,
      borderRadius: tokens.borderRadiusMedium,
      border: `1px solid ${tokens.colorNeutralStroke2}`,
      padding: tokens.spacingVerticalL,
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }}
    onClick={onClick}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      marginBottom: tokens.spacingVerticalS 
    }}>
      <Text weight="semibold" size={300}>Completed This Month</Text>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: tokens.colorPaletteGreenForeground1,
      }} />
    </div>
    <div style={{ fontSize: '24px', fontWeight: '700', color: '#1b1b1b', marginBottom: '4px' }}>
      {value}
    </div>
    <Text size={200} style={{ color: change > 0 ? tokens.colorPaletteGreenForeground1 : tokens.colorPaletteRedForeground1 }}>
      {change > 0 ? '+' : ''}{change} from last month
    </Text>
  </div>
);