import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  CardFooter,
  Text,
  Button,
  Textarea,
  Avatar,
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
} from '@fluentui/react-components';
import {
  DocumentRegular,
  PersonRegular,
  CalendarRegular,
  CheckmarkCircleRegular,
  DismissCircleRegular,
  CommentRegular,
  HistoryRegular,
  ClockRegular,
} from '@fluentui/react-icons';

export interface ApprovalItem {
  id: string;
  documentName: string;
  documentId: string;
  author: string;
  authorEmail: string;
  submittedDate: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  comments?: string;
  version: string;
  approvers: Array<{
    id: string;
    name: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
    actionDate?: string;
  }>;
}

export interface ApprovalWorkflowProps {
  approval: ApprovalItem;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
  onViewDocument: (documentId: string) => void;
  onViewHistory: (id: string) => void;
  onAddComment: (id: string, comment: string) => void;
}

const useStyles = makeStyles({
  card: {
    width: '100%',
    marginBottom: tokens.spacingVerticalM,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: tokens.shadow8,
    },
  },
  header: {
    padding: tokens.spacingVerticalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  documentIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  documentName: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: '16px',
  },
  priorityBadge: {
    marginLeft: 'auto',
  },
  metadata: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalS,
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  metadataIcon: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
  },
  approvers: {
    marginTop: tokens.spacingVerticalS,
  },
  approversTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalXS,
  },
  approverList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
  },
  approver: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  approverStatus: {
    fontSize: '12px',
  },
  preview: {
    padding: tokens.spacingVerticalM,
  },
  comments: {
    marginTop: tokens.spacingVerticalM,
  },
  comment: {
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: tokens.spacingVerticalXS,
  },
  commentAuthor: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  commentText: {
    marginTop: tokens.spacingVerticalXS,
    fontSize: '14px',
  },
  footer: {
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  dialog: {
    minWidth: '500px',
  },
  commentInput: {
    marginTop: tokens.spacingVerticalM,
  },
});

const getPriorityConfig = (priority: ApprovalItem['priority']) => {
  switch (priority) {
    case 'urgent':
      return { color: 'danger' as const, text: 'Urgent' };
    case 'high':
      return { color: 'warning' as const, text: 'High' };
    case 'medium':
      return { color: 'brand' as const, text: 'Medium' };
    case 'low':
      return { color: 'success' as const, text: 'Low' };
    default:
      return { color: 'subtle' as const, text: 'Unknown' };
  }
};

const getStatusConfig = (status: ApprovalItem['status']) => {
  switch (status) {
    case 'approved':
      return { color: 'success' as const, icon: <CheckmarkCircleRegular />, text: 'Approved' };
    case 'rejected':
      return { color: 'danger' as const, icon: <DismissCircleRegular />, text: 'Rejected' };
    case 'expired':
      return { color: 'warning' as const, icon: <ClockRegular />, text: 'Expired' };
    case 'pending':
      return { color: 'brand' as const, icon: <ClockRegular />, text: 'Pending' };
    default:
      return { color: 'subtle' as const, icon: <ClockRegular />, text: 'Unknown' };
  }
};

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  approval,
  onApprove,
  onReject,
  onViewDocument,
  onViewHistory,
  onAddComment,
}) => {
  const styles = useStyles();
  const [comment, setComment] = useState('');
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  const priorityConfig = getPriorityConfig(approval.priority);
  const statusConfig = getStatusConfig(approval.status);

  const handleApprove = () => {
    onApprove(approval.id, comment);
    setIsApprovalDialogOpen(false);
    setComment('');
  };

  const handleReject = () => {
    onReject(approval.id, comment);
    setIsRejectionDialogOpen(false);
    setComment('');
  };

  const handleAddComment = () => {
    onAddComment(approval.id, comment);
    setIsCommentDialogOpen(false);
    setComment('');
  };

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <div className={styles.title}>
          <DocumentRegular className={styles.documentIcon} />
          <Text className={styles.documentName}>{approval.documentName}</Text>
          <Badge className={styles.priorityBadge} color={priorityConfig.color} size="small">
            {priorityConfig.text}
          </Badge>
        </div>

        <div className={styles.metadata}>
          <div className={styles.metadataItem}>
            <PersonRegular className={styles.metadataIcon} />
            <Text size={200}>{approval.author}</Text>
          </div>
          <div className={styles.metadataItem}>
            <CalendarRegular className={styles.metadataIcon} />
            <Text size={200}>Due: {approval.dueDate}</Text>
          </div>
          <div className={styles.metadataItem}>
            <ClockRegular className={styles.metadataIcon} />
            <Text size={200}>Submitted: {approval.submittedDate}</Text>
          </div>
          <div className={styles.metadataItem}>
            <Text size={200}>Version: {approval.version}</Text>
          </div>
        </div>

        <div className={styles.approvers}>
          <Text className={styles.approversTitle} size={300}>
            Approvers ({approval.approvers.length})
          </Text>
          <div className={styles.approverList}>
            {approval.approvers.map((approver) => (
              <div key={approver.id} className={styles.approver}>
                <Avatar size={20} name={approver.name} />
                <Text size={200}>{approver.name}</Text>
                <Badge
                  size="small"
                  color={approver.status === 'approved' ? 'success' : 
                         approver.status === 'rejected' ? 'danger' : 'brand'}
                >
                  {approver.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardPreview className={styles.preview}>
        {approval.comments && (
          <div className={styles.comments}>
            <Text size={300} weight="semibold">Comments</Text>
            <div className={styles.comment}>
              <div className={styles.commentAuthor}>{approval.author}</div>
              <div className={styles.commentText}>{approval.comments}</div>
            </div>
          </div>
        )}
      </CardPreview>

      <CardFooter className={styles.footer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
          <Badge color={statusConfig.color} size="small">
            {statusConfig.icon}
            {statusConfig.text}
          </Badge>
        </div>

        <div className={styles.actions}>
          <Button
            size="small"
            appearance="transparent"
            icon={<DocumentRegular />}
            onClick={() => onViewDocument(approval.documentId)}
          >
            View Document
          </Button>
          
          <Button
            size="small"
            appearance="transparent"
            icon={<HistoryRegular />}
            onClick={() => onViewHistory(approval.id)}
          >
            History
          </Button>

          {approval.status === 'pending' && (
            <>
              <Dialog open={isApprovalDialogOpen} onOpenChange={(_, data) => setIsApprovalDialogOpen(data.open)}>
                <DialogTrigger>
                  <Button
                    size="small"
                    appearance="primary"
                    icon={<CheckmarkCircleRegular />}
                  >
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogSurface className={styles.dialog}>
                  <DialogTitle>Approve Document</DialogTitle>
                  <DialogBody>
                    <DialogContent>
                      <Text>Are you sure you want to approve "{approval.documentName}"?</Text>
                      <Field label="Comments (optional)" className={styles.commentInput}>
                        <Textarea
                          value={comment}
                          onChange={(_, data) => setComment(data.value)}
                          placeholder="Add a comment..."
                          rows={3}
                        />
                      </Field>
                    </DialogContent>
                  </DialogBody>
                  <DialogActions>
                    <DialogTrigger>
                      <Button appearance="secondary">Cancel</Button>
                    </DialogTrigger>
                    <Button appearance="primary" onClick={handleApprove}>
                      Approve
                    </Button>
                  </DialogActions>
                </DialogSurface>
              </Dialog>

              <Dialog open={isRejectionDialogOpen} onOpenChange={(_, data) => setIsRejectionDialogOpen(data.open)}>
                <DialogTrigger>
                  <Button
                    size="small"
                    appearance="secondary"
                    icon={<DismissCircleRegular />}
                  >
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogSurface className={styles.dialog}>
                  <DialogTitle>Reject Document</DialogTitle>
                  <DialogBody>
                    <DialogContent>
                      <Text>Are you sure you want to reject "{approval.documentName}"?</Text>
                      <Field label="Reason for rejection" className={styles.commentInput}>
                        <Textarea
                          value={comment}
                          onChange={(_, data) => setComment(data.value)}
                          placeholder="Please provide a reason for rejection..."
                          rows={3}
                        />
                      </Field>
                    </DialogContent>
                  </DialogBody>
                  <DialogActions>
                    <DialogTrigger>
                      <Button appearance="secondary">Cancel</Button>
                    </DialogTrigger>
                    <Button appearance="primary" onClick={handleReject}>
                      Reject
                    </Button>
                  </DialogActions>
                </DialogSurface>
              </Dialog>
            </>
          )}

          <Dialog open={isCommentDialogOpen} onOpenChange={(_, data) => setIsCommentDialogOpen(data.open)}>
            <DialogTrigger>
              <Button
                size="small"
                appearance="transparent"
                icon={<CommentRegular />}
              >
                Comment
              </Button>
            </DialogTrigger>
            <DialogSurface className={styles.dialog}>
              <DialogTitle>Add Comment</DialogTitle>
              <DialogBody>
                <DialogContent>
                  <Field label="Comment" className={styles.commentInput}>
                    <Textarea
                      value={comment}
                      onChange={(_, data) => setComment(data.value)}
                      placeholder="Add a comment..."
                      rows={3}
                    />
                  </Field>
                </DialogContent>
              </DialogBody>
              <DialogActions>
                <DialogTrigger>
                  <Button appearance="secondary">Cancel</Button>
                </DialogTrigger>
                <Button appearance="primary" onClick={handleAddComment}>
                  Add Comment
                </Button>
              </DialogActions>
            </DialogSurface>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
};
