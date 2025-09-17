import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Microsoft365Service } from '../services/teamsService';
import {
  Button,
  Text,
  Input,
  Field,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  Card,
  makeStyles,
  tokens,
  Divider,
} from '@fluentui/react-components';
import { 
  PersonRegular,
  EyeRegular,
  EyeOffRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(135deg, 
      #e3f2fd 0%, 
      #f3e5f5 25%, 
      #e8f5e8 50%, 
      #fff3e0 75%, 
      #fce4ec 100%)`,
    position: 'relative',
    overflow: 'hidden',
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
    marginBottom: tokens.spacingVerticalM,
    height: '44px',
    borderRadius: tokens.borderRadiusMedium,
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    textAlign: 'left',
    marginTop: tokens.spacingVerticalL,
  },
  passwordField: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: tokens.colorNeutralForeground3,
    '&:hover': {
      color: tokens.colorNeutralForeground2,
    },
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
  divider: {
    margin: `${tokens.spacingVerticalL} 0`,
  },
  demoInfo: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    marginTop: tokens.spacingVerticalM,
    textAlign: 'left',
  },
  demoCredentials: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalXS,
    fontFamily: 'monospace',
  },
});

const LoginPage: React.FC = () => {
  const { login, demoLogin, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const microsoft365Service = Microsoft365Service.getInstance();
  const styles = useStyles();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'demo' | 'form'>('demo');

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleDemoLogin = async () => {
    try {
      await demoLogin();
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      console.error('Form login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
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
            <br/>
            <Text className={styles.welcomeSubtitle}>
              to continue to your BMS Teams App
            </Text>
          </div>

          {error && (
            <MessageBar intent="error" style={{ marginBottom: tokens.spacingVerticalL }}>
              <MessageBarBody>
                <MessageBarTitle>Sign-in failed</MessageBarTitle>
                {error}
              </MessageBarBody>
            </MessageBar>
          )}

          {/* Demo Login Button */}
          <Button
            appearance="primary"
            size="large"
            className={styles.button}
            onClick={handleDemoLogin}
            disabled={isLoading}
            icon={isLoading && loginMode === 'demo' ? <Spinner size="tiny" /> : <PersonRegular />}
            style={{
              backgroundColor: '#0078d4',
              borderColor: '#0078d4',
              fontSize: '15px',
              fontWeight: '600',
            }}
          >
            {isLoading && loginMode === 'demo' ? 'Signing in...' : 'Quick Demo Login'}
          </Button>

          <Divider className={styles.divider}>or</Divider>

          {/* Login Form */}
          <form onSubmit={handleFormLogin} className={styles.loginForm}>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(_, data) => setEmail(data.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </Field>
            
            <Field label="Password">
              <div className={styles.passwordField}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(_, data) => setPassword(data.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffRegular /> : <EyeRegular />}
                </button>
              </div>
            </Field>

            <Button
              type="submit"
              appearance="secondary"
              size="large"
              className={styles.button}
              disabled={isLoading || !email || !password}
              icon={isLoading && loginMode === 'form' ? <Spinner size="tiny" /> : undefined}
              onClick={() => setLoginMode('form')}
            >
              {isLoading && loginMode === 'form' ? 'Signing in...' : 'Sign in with Credentials'}
            </Button>
          </form>

          {/* Demo Information */}
          <div className={styles.demoInfo}>
            <Text size={200} weight="semibold">Demo Credentials</Text>
            <div className={styles.demoCredentials}>
              Email: john.smith@company.com<br/>
              Email: sarah.johnson@company.com<br/>
              Email: michael.brown@company.com<br/>
              Password: password (or "demo")
            </div>
          </div>

          {/* Environment Info */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: tokens.spacingVerticalL,
            padding: tokens.spacingVerticalM,
            backgroundColor: tokens.colorNeutralBackground2,
            borderRadius: tokens.borderRadiusMedium,
            border: `1px solid ${tokens.colorNeutralStroke1}`,
          }}>
            <Text size={200}>
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
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;