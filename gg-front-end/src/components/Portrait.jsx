import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Portrait({ src, alt, size = 144, border = true }) {
  const theme = useTheme();

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: 4, // small rounding for square
        border: border ? `3px solid ${theme.palette.primary.main}` : 'none',
        boxShadow: theme.palette.mode === 'light' 
          ? '0 4px 8px rgba(0, 0, 0, 0.1)' 
          : '0 4px 8px rgba(255, 255, 255, 0.1)',
        display: 'block',
      }}
    />
  );
}

export default Portrait; 