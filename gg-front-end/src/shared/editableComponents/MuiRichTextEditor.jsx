import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, 
  Paper, 
  TextField, 
  IconButton, 
  Tooltip, 
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatStrikethrough,
  Title,
  Title as Title2,
  Title as Title3,
  EmojiEmotions
} from '@mui/icons-material';

function MuiRichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...",
  sx = {},
  readOnly = false
}) {
  const theme = useTheme();
  const textFieldRef = useRef(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [textHistory, setTextHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize history properly
  useEffect(() => {
    if (!isInitialized && value !== undefined) {
      setTextHistory([value || '']);
      setHistoryIndex(0);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Update history when value prop changes (for external updates)
  useEffect(() => {
    if (isInitialized && hasUserTyped && value !== textHistory[historyIndex]) {
      setTextHistory(prev => [...prev, value || '']);
      setHistoryIndex(prev => prev + 1);
    }
  }, [value, isInitialized, hasUserTyped]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker') && !event.target.closest('.emoji-button')) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  const saveToHistory = (newValue, oldValue) => {
    setTextHistory(prev => {
      // Don't save if the value is the same as the current one
      if (historyIndex >= 0 && prev[historyIndex] === oldValue) {
        return prev;
      }
      // Save the old value to history
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(oldValue);
      return newHistory;
    });
    setHistoryIndex(textHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousValue = textHistory[newIndex];
      setHistoryIndex(newIndex);
      if (onChange) {
        onChange(previousValue);
      }
    }
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      handleUndo();
    }
    // Set typing flag when user presses a key
    setIsTyping(true);
  };

  const handleKeyUp = () => {
    // Clear typing flag after a short delay
    setTimeout(() => {
      setIsTyping(false);
    }, 200);
  };

  const handleTextChange = (event) => {
    const newValue = event.target.value;
    const oldValue = value || '';
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Only save to history if we're actually typing (not just selection changes)
    if (isTyping) {
      setTimeout(() => {
        saveToHistory(newValue, oldValue);
      }, 100);
    }
  };

  const handleSelectionChange = () => {
    if (textFieldRef.current) {
      const input = textFieldRef.current.querySelector('textarea');
      if (input) {
        const { selectionStart, selectionEnd } = input;
        setSelection({ start: selectionStart, end: selectionEnd });
      }
    }
  };

  const insertText = (textToInsert) => {
    if (!textFieldRef.current) return;
    
    const input = textFieldRef.current.querySelector('textarea');
    if (!input) return;
    
    const currentValue = value || '';
    const before = currentValue.substring(0, selection.start);
    const after = currentValue.substring(selection.end);
    const newValue = before + textToInsert + after;
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Update selection state after text change
    const newPosition = selection.start + textToInsert.length;
    setSelection({ start: newPosition, end: newPosition });
    
    // Set cursor position after inserted text
    setTimeout(() => {
      if (input) {
        input.setSelectionRange(newPosition, newPosition);
        input.focus();
      }
    }, 0);
  };

  const insertHeading = (headingPrefix) => {
    if (!textFieldRef.current) return;
    
    const input = textFieldRef.current.querySelector('textarea');
    if (!input) return;
    
    const currentValue = value || '';
    const selectedText = currentValue.substring(selection.start, selection.end);
    
    // Find the start of the current line
    let lineStart = selection.start;
    while (lineStart > 0 && currentValue[lineStart - 1] !== '\n') {
      lineStart--;
    }
    
    // Get the current line
    const lineEnd = currentValue.indexOf('\n', selection.start);
    const currentLine = lineEnd !== -1 
      ? currentValue.substring(lineStart, lineEnd)
      : currentValue.substring(lineStart);
    
    // Check if line already has a heading
    const headingRegex = /^(#{1,3})\s/;
    const match = currentLine.match(headingRegex);
    
    let newValue;
    let newStart, newEnd;
    
    if (match) {
      // Remove existing heading
      const lineWithoutHeading = currentLine.replace(headingRegex, '');
      newValue = currentValue.substring(0, lineStart) + lineWithoutHeading + currentValue.substring(lineStart + currentLine.length);
      newStart = lineStart;
      newEnd = lineStart + lineWithoutHeading.length;
    } else {
      // Add heading to the line
      const newLine = headingPrefix + currentLine;
      newValue = currentValue.substring(0, lineStart) + newLine + currentValue.substring(lineStart + currentLine.length);
      newStart = lineStart;
      newEnd = lineStart + newLine.length;
    }
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Update selection state
    setSelection({ start: newStart, end: newEnd });
    
    // Set selection
    setTimeout(() => {
      if (input) {
        input.setSelectionRange(newStart, newEnd);
        input.focus();
      }
    }, 0);
  };



  const wrapText = (beforeTag, afterTag) => {
    if (!textFieldRef.current) return;
    
    const input = textFieldRef.current.querySelector('textarea');
    if (!input) return;
    
    const currentValue = value || '';
    const selectedText = currentValue.substring(selection.start, selection.end);
    
    if (selectedText) {
      // Check if text is already wrapped with the tags
      const isAlreadyWrapped = selectedText.startsWith(beforeTag) && selectedText.endsWith(afterTag);
      
      let newValue;
      let newStart, newEnd;
      
      if (isAlreadyWrapped) {
        // Remove the tags
        const unwrappedText = selectedText.substring(beforeTag.length, selectedText.length - afterTag.length);
        newValue = currentValue.substring(0, selection.start) + unwrappedText + currentValue.substring(selection.end);
        newStart = selection.start;
        newEnd = selection.start + unwrappedText.length;
      } else {
        // Add the tags
        newValue = currentValue.substring(0, selection.start) + beforeTag + selectedText + afterTag + currentValue.substring(selection.end);
        newStart = selection.start;
        newEnd = selection.end + beforeTag.length + afterTag.length;
      }
      
      if (onChange) {
        onChange(newValue);
      }
      
      // Update selection state
      setSelection({ start: newStart, end: newEnd });
      
      // Set selection
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(newStart, newEnd);
          input.focus();
        }
      }, 0);
    }
  };

  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji, event) => {
    event.preventDefault();
    event.stopPropagation();
    insertText(emoji);
    setShowEmojiPicker(false);
  };

  // Common emojis for the picker
  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀',
    '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽'
  ];

  const handleFormat = (format) => {
    switch (format) {
      case 'bold':
        wrapText('**', '**');
        break;
      case 'italic':
        wrapText('*', '*');
        break;
      case 'underline':
        wrapText('__', '__');
        break;
      case 'strikethrough':
        wrapText('~~', '~~');
        break;
      case 'h1':
        insertHeading('# ');
        break;
      case 'h2':
        insertHeading('## ');
        break;
      case 'h3':
        insertHeading('### ');
        break;


      case 'emoji':
        handleEmojiClick();
        break;
      default:
        break;
    }
  };

  const customStyles = `
    .rich-text-field .MuiOutlinedInput-root {
      font-family: ${theme.typography.body1.fontFamily};
      font-size: ${theme.typography.body1.fontSize};
      line-height: ${theme.typography.body1.lineHeight};
      color: ${theme.palette.mode === 'light' ? '#000000' : theme.palette.text.primary};
      background-color: ${theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.paper};
      border: 1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'};
      border-radius: 4px;
      min-height: 120px;
    }
    
    .rich-text-field .MuiOutlinedInput-root:focus-within {
      border-color: ${theme.palette.primary.main};
    }
    
    .rich-text-field .MuiInputBase-input {
      color: ${theme.palette.mode === 'light' ? '#000000' : theme.palette.text.primary};
      line-height: 1.6;
      white-space: pre-wrap;
    }
    
    .rich-text-toolbar {
      background-color: ${theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default};
      border: 1px solid ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'};
      border-bottom: none;
      border-radius: 4px 4px 0 0;
      padding: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }
    
    .rich-text-toolbar .MuiIconButton-root {
      color: ${theme.palette.mode === 'light' ? '#000000' : theme.palette.text.primary};
      padding: 6px;
      border-radius: 4px;
    }
    
    .rich-text-toolbar .MuiIconButton-root:hover {
      background-color: ${theme.palette.action.hover};
    }
    
    .rich-text-toolbar .MuiToggleButton-root {
      color: ${theme.palette.mode === 'light' ? '#000000' : theme.palette.text.primary};
      border-color: ${theme.palette.mode === 'light' ? '#e0e0e0' : '#333333'};
    }
    
    .rich-text-toolbar .MuiToggleButton-root:hover {
      background-color: ${theme.palette.action.hover};
    }
    
    .rich-text-toolbar .MuiToggleButton-root.Mui-selected {
      background-color: ${theme.palette.primary.main};
      color: ${theme.palette.primary.contrastText};
    }
  `;

  return (
    <Box sx={{ ...sx, position: 'relative' }}>
      <style>{customStyles}</style>
      <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
        {/* Toolbar */}
        <div className="rich-text-toolbar">
          <Tooltip title="Bold (Ctrl+B)">
            <IconButton
              size="small"
              onClick={() => handleFormat('bold')}
            >
              <FormatBold fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Italic (Ctrl+I)">
            <IconButton
              size="small"
              onClick={() => handleFormat('italic')}
            >
              <FormatItalic fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Underline">
            <IconButton
              size="small"
              onClick={() => handleFormat('underline')}
            >
              <FormatUnderlined fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Strikethrough">
            <IconButton
              size="small"
              onClick={() => handleFormat('strikethrough')}
            >
              <FormatStrikethrough fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          <Tooltip title="Heading 1">
            <IconButton
              size="small"
              onClick={() => handleFormat('h1')}
            >
              <Title fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Heading 2">
            <IconButton
              size="small"
              onClick={() => handleFormat('h2')}
            >
              <Title2 fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Heading 3">
            <IconButton
              size="small"
              onClick={() => handleFormat('h3')}
            >
              <Title3 fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          <Tooltip title="Emoji">
            <IconButton
              className="emoji-button"
              size="small"
              onClick={() => handleFormat('emoji')}
              sx={{
                backgroundColor: showEmojiPicker ? theme.palette.primary.main : 'transparent',
                color: showEmojiPicker ? theme.palette.primary.contrastText : 'inherit'
              }}
            >
              <EmojiEmotions fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <Box
            className="emoji-picker"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              boxShadow: theme.shadows[8],
              p: 2,
              width: 400,
              maxHeight: 300,
              overflowY: 'auto',
              overflowX: 'hidden',
              backdropFilter: 'blur(4px)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 1,
                zIndex: -1
              }
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: 1
              }}
            >
              {commonEmojis.map((emoji, index) => (
                <IconButton
                  key={index}
                  size="small"
                  onClick={(event) => handleEmojiSelect(emoji, event)}
                  sx={{
                    fontSize: '1.5rem',
                    minWidth: 40,
                    minHeight: 40,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transform: 'scale(1.1)',
                      transition: 'transform 0.1s ease'
                    }
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Box>
          </Box>
        )}

        {/* Text Field */}
        <TextField
          ref={textFieldRef}
          className="rich-text-field"
          multiline
          fullWidth
          value={value || ''}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          disabled={readOnly}
          minRows={4}
          maxRows={12}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }
          }}
        />
      </Paper>
    </Box>
  );
}

export default MuiRichTextEditor; 