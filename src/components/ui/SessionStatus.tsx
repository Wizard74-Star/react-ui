import React, { useState, useEffect } from 'react';
import {
  Text,
  Button,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  ClockRegular,
  WarningRegular,
  CheckmarkCircleRegular,
} from '@fluentui/react-icons';
import { useAuth } from '../AuthProvider';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalS,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sessionActive: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    borderLeft: `3px solid ${tokens.colorPaletteGreenForeground1}`,
  },
  sessionWarning: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    borderLeft: `3px solid ${tokens.colorPaletteYellowForeground1}`,
  },
  sessionExpired: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    borderLeft: `3px solid ${tokens.colorPaletteRedForeground1}`,
  },
  icon: {
    fontSize: '16px',
  },
  timeText: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
});

interface SessionStatusProps {
  showExtendButton?: boolean;
  compact?: boolean;
}

export const SessionStatus: React.FC<SessionStatusProps> = ({
  showExtendButton = true,
  compact = false,
}) => {
  const styles = useStyles();
  const { sessionInfo, extendSession, isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated || !sessionInfo.hasSession) return;

    const updateTimeRemaining = () => {
      if (sessionInfo.timeRemaining) {
        const minutes = Math.floor(sessionInfo.timeRemaining / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
          setTimeRemaining(`${hours}h ${remainingMinutes}m`);
        } else {
          setTimeRemaining(`${remainingMinutes}m`);
        }
      } else {
        setTimeRemaining('');
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [sessionInfo, isAuthenticated]);

  if (!isAuthenticated || !sessionInfo.hasSession) {
    return null;
  }

  const getStatusInfo = () => {
    if (sessionInfo.isExpired) {
      return {
        icon: <WarningRegular className={styles.icon} style={{ color: tokens.colorPaletteRedForeground1 }} />,
        text: 'Session Expired',
        className: styles.sessionExpired,
        badgeColor: 'danger' as const,
      };
    }

    if (sessionInfo.timeRemaining && sessionInfo.timeRemaining < 30 * 60 * 1000) { // Less than 30 minutes
      return {
        icon: <ClockRegular className={styles.icon} style={{ color: tokens.colorPaletteYellowForeground1 }} />,
        text: 'Session Expiring Soon',
        className: styles.sessionWarning,
        badgeColor: 'warning' as const,
      };
    }

    return {
      icon: <CheckmarkCircleRegular className={styles.icon} style={{ color: tokens.colorPaletteGreenForeground1 }} />,
      text: 'Session Active',
      className: styles.sessionActive,
      badgeColor: 'success' as const,
    };
  };

  const statusInfo = getStatusInfo();

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXS }}>
        {statusInfo.icon}
        <Badge color={statusInfo.badgeColor} size="small">
          {timeRemaining || 'Active'}
        </Badge>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${statusInfo.className}`}>
      {statusInfo.icon}
      <div style={{ flex: 1 }}>
        <Text size={200} weight="semibold">
          {statusInfo.text}
        </Text>
        {timeRemaining && (
          <div className={styles.timeText}>
            {timeRemaining} remaining
          </div>
        )}
      </div>
      {showExtendButton && !sessionInfo.isExpired && (
        <Button
          size="small"
          appearance="transparent"
          onClick={extendSession}
        >
          Extend
        </Button>
      )}
    </div>
  );
};
