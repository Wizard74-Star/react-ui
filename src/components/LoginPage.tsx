import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Microsoft365Service } from '../services/teamsService';
import {
  Button,
  Text,
  Body1,
  Caption1,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Card,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { 
  PersonRegular, 
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh', // Fixed viewport height
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(135deg, 
      #e3f2fd 0%, 
      #f3e5f5 25%, 
      #e8f5e8 50%, 
      #fff3e0 75%, 
      #fce4ec 100%)`,
    position: 'relative',
    overflow: 'hidden', // No page scroll
  },
  leftPanel: {
    display: 'none', // Hide for Microsoft-style centered design
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '440px',
    padding: tokens.spacingVerticalXL,
  },
  logo: {
    width: '120px',
    height: '120px',
    marginBottom: tokens.spacingVerticalXL,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralForegroundOnBrand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: tokens.shadow16,
  },
  title: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalL,
    fontWeight: tokens.fontWeightBold,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: '500px',
    lineHeight: '1.6',
    opacity: 0.9,
  },
  loginCard: {
    width: '100%',
    padding: '48px 44px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    border: 'none',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  microsoftLogo: {
    marginBottom: tokens.spacingVerticalL,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalS,
  },
  logoSquares: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1px',
    width: '21px',
    height: '21px',
    marginRight: tokens.spacingHorizontalS,
  },
  logoSquare: {
    width: '10px',
    height: '10px',
  },
  button: {
    width: '100%',
    marginBottom: tokens.spacingVerticalL,
    height: '44px',
    borderRadius: tokens.borderRadiusMedium,
  },
  environmentInfo: {
    textAlign: 'center',
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalXXL,
    maxWidth: '600px',
  },
  feature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: tokens.spacingVerticalL,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: tokens.borderRadiusMedium,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  featureIcon: {
    fontSize: '32px',
    marginBottom: tokens.spacingVerticalM,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  featureText: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: '14px',
  },
  welcomeSection: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalXL,
  },
  welcomeTitle: {
    marginBottom: tokens.spacingVerticalM,
    fontWeight: '600',
    fontSize: '24px',
    color: '#1b1b1b',
    lineHeight: '28px',
  },
  welcomeSubtitle: {
    color: '#605e5c',
    fontSize: '15px',
    lineHeight: '20px',
    marginBottom: tokens.spacingVerticalL,
  },
  backButton: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#f3f2f1',
    },
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    pointerEvents: 'none',
  },
});

const LoginPage: React.FC = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const microsoft365Service = Microsoft365Service.getInstance();
  const styles = useStyles();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      // Navigation will be handled by the useEffect above when isAuthenticated becomes true
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.container}>
      {/* Microsoft-style centered modal */}
      <div className={styles.rightPanel}>
        <Card className={styles.loginCard}>
          {/* Back button */}
          <button className={styles.backButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>

          {/* Microsoft Logo */}
          <div className={styles.microsoftLogo}>
            <div className={styles.logoSquares}>
              <div className={styles.logoSquare} style={{ backgroundColor: '#f25022' }}></div>
              <div className={styles.logoSquare} style={{ backgroundColor: '#7fba00' }}></div>
              <div className={styles.logoSquare} style={{ backgroundColor: '#00a4ef' }}></div>
              <div className={styles.logoSquare} style={{ backgroundColor: '#ffb900' }}></div>
            </div>
            <Text weight="semibold" style={{ fontSize: '15px', color: '#5e5e5e', fontWeight: "700" }}>BMS Teams</Text>
          </div>

          {/* Main Content */}
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeTitle}>Sign in</div>
            <br/><br/>
            <Body1 className={styles.welcomeSubtitle}>
              to continue to your BMS Teams App
            </Body1>
          </div>

          {error && (
            <MessageBar intent="error" style={{ marginBottom: tokens.spacingVerticalL }}>
              <MessageBarBody>
                <MessageBarTitle>Sign-in failed</MessageBarTitle>
                {error}
              </MessageBarBody>
            </MessageBar>
          )}

          <Button
            appearance="primary"
            size="large"
            className={styles.button}
            onClick={handleLogin}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="tiny" /> : <PersonRegular />}
            style={{
              backgroundColor: '#0078d4',
              borderColor: '#0078d4',
              fontSize: '15px',
              fontWeight: '600',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft 365'}
          </Button>

          {/* <div style={{ textAlign: 'center', marginTop: tokens.spacingVerticalL }}>
            <Text style={{ fontSize: '13px', color: '#605e5c' }}>
              New to Microsoft? <a href="#" style={{ color: '#0078d4', textDecoration: 'none' }}>Create an account</a>
            </Text>
          </div> */}

          <div className={styles.environmentInfo}>
            <Caption1>
              {microsoft365Service.isInitialized() ? (
                <div>
                  <Text weight="semibold" style={{ fontSize: '13px' }}>Connected to Microsoft 365</Text>
                  <div style={{ marginTop: tokens.spacingVerticalXS, fontSize: '12px' }}>
                    {microsoft365Service.getEnvironmentInfo().isInTeams && (
                      <div>• Running in Microsoft Teams</div>
                    )}
                    {microsoft365Service.getEnvironmentInfo().isInOutlook && (
                      <div>• Running in Outlook</div>
                    )}
                    {microsoft365Service.getEnvironmentInfo().isInWeb && (
                      <div>• Running in web browser</div>
                    )}
                  </div>
                </div>
              ) : (
                <Text style={{ fontSize: '13px' }}>Running in web browser</Text>
              )}
            </Caption1>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
