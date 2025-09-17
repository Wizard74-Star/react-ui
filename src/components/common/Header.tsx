import React from 'react';
import {
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  SearchRegular,
} from '@fluentui/react-icons';
import { SessionStatus } from '../ui/SessionStatus';

export interface HeaderProps {
  title: string;
  onSearchClick: () => void;
}

const useStyles = makeStyles({
  header: {
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    padding: '8px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    height: '40px',
    flexShrink: 0,
  },
});

export const Header: React.FC<HeaderProps> = ({
  title,
  onSearchClick,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.header}>
      <div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#1b1b1b' }}>
          {title}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <SessionStatus compact showExtendButton={false} />
        <Button 
          appearance="primary" 
          icon={<SearchRegular />}
          onClick={onSearchClick}
          style={{ 
            borderRadius: '6px',
            backgroundColor: '#0078d4',
            borderColor: '#0078d4'
          }}
        >
          Search
        </Button>
      </div>
    </div>
  );
};
