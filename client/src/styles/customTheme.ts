import { createMuiTheme } from '@material-ui/core/styles';

const customTheme = (darkMode: boolean) =>
  createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#e91e63',
        light: '#e91e6340',
      },
      secondary: {
        main: darkMode ? '#e4fffd' : '#e91e63',
      },
    },
    overrides: {
      MuiTypography: {
        root: {
          wordBreak: 'break-word',
        },
      },
    },
  });

export default customTheme;
