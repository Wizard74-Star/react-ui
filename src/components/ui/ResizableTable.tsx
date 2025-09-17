import React, { useState, useRef, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Button,
} from '@fluentui/react-components';
import { ArrowSortRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  tableContainer: {
    position: 'relative',
    overflowX: 'auto',
    overflowY: 'hidden',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    
    // Custom scrollbar styling
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: tokens.colorNeutralBackground2,
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: tokens.colorNeutralStroke1,
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: tokens.colorNeutralStroke2,
      },
    },
    scrollbarWidth: 'thin',
    scrollbarColor: `${tokens.colorNeutralStroke1} ${tokens.colorNeutralBackground2}`,
  },
  
  table: {
    width: '100%',
    minWidth: 'max-content',
    tableLayout: 'fixed',
    borderCollapse: 'separate',
    borderSpacing: 0,
  },
  
  headerCell: {
    position: 'relative',
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground1,
    userSelect: 'none',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  
  headerCellLast: {
    borderRight: 'none',
  },
  
  resizeHandle: {
    position: 'absolute',
    top: 0,
    right: '-3px',
    width: '6px',
    height: '100%',
    cursor: 'col-resize',
    backgroundColor: 'rgba(0, 123, 255, 0.2)',
    // borderLeft: `1px solid rgba(0, 123, 255, 0.4)`,
    zIndex: 10,
    
    '&:hover': {
      backgroundColor: 'rgba(0, 123, 255, 0.4)',
    //   borderLeft: `2px solid ${tokens.colorBrandStroke1}`,
    },
    
    '&:active': {
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
    //   borderLeft: `2px solid ${tokens.colorBrandStroke2}`,
    },
  },
  
  resizeHandleActive: {
    borderRightColor: `${tokens.colorBrandStroke2} !important`,
  },
  
  bodyCell: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: tokens.fontSizeBase200,
  },
  
  bodyCellLast: {
    borderRight: 'none',
  },
  
  row: {
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
});

export interface ColumnDefinition {
  key: string;
  title: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  render?: (value: any, item: any, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
}

export interface ResizableTableProps {
  columns: ColumnDefinition[];
  data: any[];
  onColumnResize?: (columnKey: string, width: number) => void;
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  'aria-label'?: string;
}

export const ResizableTable: React.FC<ResizableTableProps> = ({
  columns,
  data,
  onColumnResize,
  onSort,
  sortBy,
  sortDirection,
  className,
  'aria-label': ariaLabel,
}) => {
  const styles = useStyles();
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const initialWidths: Record<string, number> = {};
    columns.forEach(col => {
      initialWidths[col.key] = col.width || 150;
    });
    return initialWidths;
  });
  
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px
    const column = columns.find(col => col.key === isResizing);
    
    if (column?.maxWidth && newWidth > column.maxWidth) return;
    if (column?.minWidth && newWidth < column.minWidth) return;
    
    setColumnWidths(prev => ({
      ...prev,
      [isResizing]: newWidth,
    }));
  }, [isResizing, startX, startWidth, columns]);

  const handleMouseUp = useCallback(() => {
    if (isResizing && onColumnResize) {
      onColumnResize(isResizing, columnWidths[isResizing]);
    }
    
    setIsResizing(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [isResizing, columnWidths, onColumnResize, handleMouseMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(columnKey);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnKey]);
    
    // Add event listeners immediately
    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - e.clientX;
      const newWidth = Math.max(50, columnWidths[columnKey] + deltaX);
      const column = columns.find(col => col.key === columnKey);
      
      if (column?.maxWidth && newWidth > column.maxWidth) return;
      if (column?.minWidth && newWidth < column.minWidth) return;
      
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth,
      }));
    };
    
    const mouseUpHandler = () => {
      if (onColumnResize) {
        onColumnResize(columnKey, columnWidths[columnKey]);
      }
      setIsResizing(null);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }, [columnWidths, columns, onColumnResize]);

  // Cleanup effect
  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Sort handler
  const handleSort = (columnKey: string) => {
    if (!onSort) return;
    
    const newDirection = sortBy === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  // Calculate total table width
  const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);

  return (
    <div className={`${styles.tableContainer} ${className || ''}`} ref={tableRef}>
      <table className={styles.table} style={{ width: `${totalWidth}px` }} aria-label={ariaLabel}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={`${styles.headerCell} ${index === columns.length - 1 ? styles.headerCellLast : ''}`}
                style={{ width: `${columnWidths[column.key]}px` }}
              >
                {column.renderHeader ? column.renderHeader() : (
                  column.sortable ? (
                    <Button
                      appearance="transparent"
                      onClick={() => handleSort(column.key)}
                      icon={<ArrowSortRegular />}
                      iconPosition="after"
                      size="small"
                    >
                      {column.title}
                    </Button>
                  ) : (
                    <span>{column.title}</span>
                  )
                )}
                {column.resizable !== false && (
                  <div
                    className={`${styles.resizeHandle} ${
                      isResizing === column.key ? styles.resizeHandleActive : ''
                    }`}
                    onMouseDown={(e) => handleMouseDown(e, column.key)}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex} className={styles.row}>
              {columns.map((column, index) => (
                <td
                  key={column.key}
                  className={`${styles.bodyCell} ${index === columns.length - 1 ? styles.bodyCellLast : ''}`}
                  style={{ width: `${columnWidths[column.key]}px` }}
                  title={column.render ? undefined : String(item[column.key] || '')}
                >
                  {column.render ? column.render(item[column.key], item, rowIndex) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResizableTable;
