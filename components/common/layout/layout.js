import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box } from '@material-ui/core';

const defaultTheme = createTheme();

const Layout = ({ children}) => {
 return (
  <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
       {children}
      </Box>
    </Container>
   </ThemeProvider>
 )
};

export default Layout;