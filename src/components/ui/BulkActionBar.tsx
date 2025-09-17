import React, { useState } from 'react';
import {
  Card,
  Text,
  Button,
  Badge,
  makeStyles,
  tokens,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Field,
  Input,
} from '@fluentui/react-components';
import {
  PeopleRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  MoreHorizontalRegular,
  ArrowLeftRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons';

export interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkAssignApprovers: (approvers: string[]) => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkExport: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  currentPage: number;
  totalPages: number;
  hasSelection: boolean;
}

const useStyles = makeStyles({
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: tokens.colorBrandBackground2,
    border: `1px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
    boxShadow: tokens.shadow4,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  selection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  dialog: {
    minWidth: '600px',
  },
  approverSelection: {
    marginTop: tokens.spacingVerticalM,
  },
  selectedApprovers: {
    marginTop: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  approverList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalXS,
  },
  approverTag: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusSmall,
    fontSize: '12px',
  },
  removeButton: {
    minWidth: 'auto',
    padding: '2px',
    height: '16px',
    width: '16px',
  },
});

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkAssignApprovers,
  onBulkApprove,
  onBulkReject,
  onBulkExport,
  onPreviousPage,
  onNextPage,
  currentPage,
  totalPages,
  hasSelection,
}) => {
  const styles = useStyles();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAssignApprovers = () => {
    onBulkAssignApprovers(selectedApprovers);
    setIsAssignDialogOpen(false);
    setSelectedApprovers([]);
  };

  const handleRemoveApprover = (approverId: string) => {
    setSelectedApprovers(prev => prev.filter(id => id !== approverId));
  };

  const handleAddApprover = (approverId: string) => {
    if (!selectedApprovers.includes(approverId)) {
      setSelectedApprovers(prev => [...prev, approverId]);
    }
  };

  return (
    <>
      <Card className={styles.bar}>
        <div className={styles.content}>
          <div className={styles.left}>
            <div className={styles.selection}>
              <Text weight="semibold">
                {selectedCount} of {totalCount} selected
              </Text>
              {hasSelection && (
                <Badge color="brand" size="small">
                  {selectedCount}
                </Badge>
              )}
            </div>

            {hasSelection && (
              <div className={styles.actions}>
                <Button
                  size="small"
                  appearance="transparent"
                  onClick={onSelectAll}
                >
                  Select All
                </Button>
                <Button
                  size="small"
                  appearance="transparent"
                  onClick={onDeselectAll}
                >
                  Deselect All
                </Button>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            {hasSelection && (
              <>
                <Dialog open={isAssignDialogOpen} onOpenChange={(_, data) => setIsAssignDialogOpen(data.open)}>
                  <DialogTrigger>
                    <Button
                      size="small"
                      appearance="primary"
                      icon={<PeopleRegular />}
                    >
                      Assign Approvers
                    </Button>
                  </DialogTrigger>
                  <DialogSurface className={styles.dialog}>
                    <DialogTitle>Assign Approvers to Selected Documents</DialogTitle>
                    <DialogBody>
                      <DialogContent>
                        <Text>
                          Assign approvers to {selectedCount} selected document{selectedCount !== 1 ? 's' : ''}.
                        </Text>
                        
                        <Field label="Search for users or groups" className={styles.approverSelection}>
                          <Input
                            value={searchQuery}
                            onChange={(_, data) => setSearchQuery(data.value)}
                            placeholder="Type to search..."
                          />
                        </Field>

                        <div className={styles.selectedApprovers}>
                          <Text weight="semibold" size={300}>
                            Selected Approvers ({selectedApprovers.length})
                          </Text>
                          <div className={styles.approverList}>
                            {selectedApprovers.map((approverId) => (
                              <div key={approverId} className={styles.approverTag}>
                                <Text size={200}>{approverId}</Text>
                                <Button
                                  size="small"
                                  appearance="transparent"
                                  icon={<DismissCircleRegular />}
                                  className={styles.removeButton}
                                  onClick={() => handleRemoveApprover(approverId)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mock user list - in real implementation, this would be populated from API */}
                        <div style={{ marginTop: tokens.spacingVerticalM }}>
                          <Text weight="semibold" size={300}>Available Users</Text>
                          <div style={{ marginTop: tokens.spacingVerticalS }}>
                            {['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown'].map((user) => (
                              <div
                                key={user}
                                style={{
                                  padding: tokens.spacingVerticalS,
                                  cursor: 'pointer',
                                  borderRadius: tokens.borderRadiusSmall,
                                  backgroundColor: selectedApprovers.includes(user) 
                                    ? tokens.colorBrandBackground2 
                                    : 'transparent',
                                }}
                                onClick={() => handleAddApprover(user)}
                              >
                                <Text size={200}>{user}</Text>
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </DialogBody>
                    <DialogActions>
                      <DialogTrigger>
                        <Button appearance="secondary">Cancel</Button>
                      </DialogTrigger>
                      <Button 
                        appearance="primary" 
                        onClick={handleAssignApprovers}
                        disabled={selectedApprovers.length === 0}
                      >
                        Assign to {selectedCount} Document{selectedCount !== 1 ? 's' : ''}
                      </Button>
                    </DialogActions>
                  </DialogSurface>
                </Dialog>

                <Button
                  size="small"
                  appearance="secondary"
                  icon={<CheckmarkCircleRegular />}
                  onClick={onBulkApprove}
                >
                  Approve All
                </Button>

                <Button
                  size="small"
                  appearance="secondary"
                  icon={<DismissCircleRegular />}
                  onClick={onBulkReject}
                >
                  Reject All
                </Button>

                <Button
                  size="small"
                  appearance="transparent"
                  icon={<MoreHorizontalRegular />}
                  onClick={onBulkExport}
                >
                  Export
                </Button>
              </>
            )}

            <div className={styles.pagination}>
              <Button
                size="small"
                appearance="transparent"
                icon={<ArrowLeftRegular />}
                onClick={onPreviousPage}
                disabled={currentPage === 1}
              />
              <Text size={200}>
                Page {currentPage} of {totalPages}
              </Text>
              <Button
                size="small"
                appearance="transparent"
                icon={<ArrowRightRegular />}
                onClick={onNextPage}
                disabled={currentPage === totalPages}
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
