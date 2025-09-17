import React from 'react';
import docxIcon from '../../assets/icons/docx.svg';
import xlsxIcon from '../../assets/icons/xlsx.svg';
import pptxIcon from '../../assets/icons/pptx.svg';
import onetocIcon from '../../assets/icons/onetoc.svg';

export interface FileTypeIconProps {
  fileType: 'docx' | 'pdf' | 'xlsx' | 'pptx' | 'txt' | 'msg' | 'one';
  size?: number;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({ fileType, size = 20 }) => {
  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    display: 'inline-block',
  };
  
  // Use authentic Microsoft Office icons
  switch (fileType) {
    case 'docx':
      return <img src={docxIcon} alt="Word Document" style={iconStyle} />;
    case 'xlsx':
      return <img src={xlsxIcon} alt="Excel Spreadsheet" style={iconStyle} />;
    case 'pptx':
      return <img src={pptxIcon} alt="PowerPoint Presentation" style={iconStyle} />;
    case 'one':
      return <img src={onetocIcon} alt="OneNote Notebook" style={iconStyle} />;
    case 'pdf':
      return (
        <svg style={iconStyle} viewBox="0 0 20 20" fill="none">
          <path d="M18 7h-2.5c-.827 0-1.5-.673-1.5-1.5V2H6v16h12V7z" fill="#fff"/>
          <path d="M18 6v-.293l-3-3V5.5c0 .275.225.5.5.5H18z" fill="#fff"/>
          <path opacity=".67" fillRule="evenodd" clipRule="evenodd" d="M18.707 5 15 1.293A1 1 0 0 0 14.293 1H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.707A1 1 0 0 0 18.707 5zM18 5.707V6h-2.5a.501.501 0 0 1-.5-.5V2.707l3 3zM6 2.2v15.6c0 .11.09.2.2.2h11.6a.2.2 0 0 0 .2-.2V7h-2.5A1.5 1.5 0 0 1 14 5.5V2H6.2a.2.2 0 0 0-.2.2z" fill="#605E5C"/>
          <path d="M2 16h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1z" fill="#D83B01"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M7.505 8.481C7.175 8.16 6.7 8 6.08 8H4.012v6H5v-2.121h1.015a2.1 2.1 0 0 0 1.044-.253c.3-.169.532-.405.696-.71.164-.304.245-.652.245-1.042 0-.607-.165-1.072-.495-1.393zM5.899 11h-.9V8.988h.932C6.359 8.988 7 8.992 7 10c0 .898-.594 1-1.101 1z" fill="#fff"/>
        </svg>
      );
    case 'txt':
      return (
        <svg style={iconStyle} viewBox="0 0 20 20" fill="none">
          <path d="M18 7h-2.5c-.827 0-1.5-.673-1.5-1.5V2H6v16h12V7z" fill="#fff"/>
          <path d="M18 6v-.293l-3-3V5.5c0 .275.225.5.5.5H18z" fill="#fff"/>
          <path opacity=".67" fillRule="evenodd" clipRule="evenodd" d="M18.707 5 15 1.293A1 1 0 0 0 14.293 1H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.707A1 1 0 0 0 18.707 5zM18 5.707V6h-2.5a.501.501 0 0 1-.5-.5V2.707l3 3zM6 2.2v15.6c0 .11.09.2.2.2h11.6a.2.2 0 0 0 .2-.2V7h-2.5A1.5 1.5 0 0 1 14 5.5V2H6.2a.2.2 0 0 0-.2.2z" fill="#605E5C"/>
          <path d="M16 8H8v1h8V8zm0 2H8v1h8v-1zm-4 2H8v1h4v-1z" fill="#605E5C"/>
        </svg>
      );
    case 'msg':
      return (
        <svg style={iconStyle} viewBox="0 0 20 20" fill="none">
          <path d="M18 7h-2.5c-.827 0-1.5-.673-1.5-1.5V2H6v16h12V7z" fill="#fff"/>
          <path d="M18 6v-.293l-3-3V5.5c0 .275.225.5.5.5H18z" fill="#fff"/>
          <path opacity=".67" fillRule="evenodd" clipRule="evenodd" d="M18.707 5 15 1.293A1 1 0 0 0 14.293 1H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.707A1 1 0 0 0 18.707 5zM18 5.707V6h-2.5a.501.501 0 0 1-.5-.5V2.707l3 3zM6 2.2v15.6c0 .11.09.2.2.2h11.6a.2.2 0 0 0 .2-.2V7h-2.5A1.5 1.5 0 0 1 14 5.5V2H6.2a.2.2 0 0 0-.2.2z" fill="#605E5C"/>
          <path d="M2 16h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1z" fill="#0078D4"/>
          <path d="M10 8.5 6 11 2 8.5V8l4 2.5L10 8v.5z" fill="#fff"/>
        </svg>
      );
    default:
      return (
        <svg style={iconStyle} viewBox="0 0 20 20" fill="none">
          <path d="M18 7h-2.5c-.827 0-1.5-.673-1.5-1.5V2H6v16h12V7z" fill="#fff"/>
          <path d="M18 6v-.293l-3-3V5.5c0 .275.225.5.5.5H18z" fill="#fff"/>
          <path opacity=".67" fillRule="evenodd" clipRule="evenodd" d="M18.707 5 15 1.293A1 1 0 0 0 14.293 1H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5.707A1 1 0 0 0 18.707 5zM18 5.707V6h-2.5a.501.501 0 0 1-.5-.5V2.707l3 3zM6 2.2v15.6c0 .11.09.2.2.2h11.6a.2.2 0 0 0 .2-.2V7h-2.5A1.5 1.5 0 0 1 14 5.5V2H6.2a.2.2 0 0 0-.2.2z" fill="#605E5C"/>
          <path d="M16 8H8v1h8V8zm0 2H8v1h8v-1zm-4 2H8v1h4v-1z" fill="#605E5C"/>
        </svg>
      );
  }
};
