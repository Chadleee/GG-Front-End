import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

function MuiContentRenderer({ content, variant = "body1", sx = {} }) {
  const theme = useTheme();

  const renderContent = () => {
    if (!content) {
      return null;
    }

    // Ensure content is a string
    const contentString = typeof content === 'string' ? content : String(content);

    // Convert markdown-style formatting to HTML
    const html = convertMarkdownToHtml(contentString);
    
    return (
      <Box
        dangerouslySetInnerHTML={{ __html: html }}
        sx={{
          '& h1': {
            fontSize: '2em',
            fontWeight: 'bold',
            margin: '0.67em 0',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& h2': {
            fontSize: '1.5em',
            fontWeight: 'bold',
            margin: '0.83em 0',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& h3': {
            fontSize: '1.17em',
            fontWeight: 'bold',
            margin: '1em 0',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& p': {
            margin: '1em 0',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& ul, & ol': {
            margin: '1em 0',
            paddingLeft: '2em',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& li': {
            margin: '0.5em 0',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& blockquote': {
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            margin: '1em 0',
            paddingLeft: '1em',
            fontStyle: 'italic',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& pre': {
            backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            borderRadius: '4px',
            padding: '1em',
            margin: '1em 0',
            overflowX: 'auto',
            color: theme.palette.mode === 'light' ? '#000000' : theme.palette.text.primary,
          },
          '& code': {
            backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            padding: '0.2em 0.4em',
            borderRadius: '3px',
            fontFamily: "'Courier New', monospace",
            color: theme.palette.mode === 'light' ? '#000000' : theme.palette.text.primary,
          },
          '& strong': {
            fontWeight: 'bold',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& em': {
            fontStyle: 'italic',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& u': {
            textDecoration: 'underline',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          '& s': {
            textDecoration: 'line-through',
            color: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.text.primary,
          },
          ...sx
        }}
      />
    );
  };

  // Convert markdown-style formatting to HTML
  const convertMarkdownToHtml = (text) => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<u>$1</u>');
    html = html.replace(/~~(.*?)~~/g, '<s>$1</s>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Lists
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/^(?!<[h|u|o]|<blockquote>)(.*$)/gim, '<p>$1</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<[h|u|o]|<blockquote>)/g, '$1');
    html = html.replace(/(<\/[h|u|o]|<\/blockquote>)<\/p>/g, '$1');

    return html;
  };

  return renderContent();
}

export default MuiContentRenderer; 