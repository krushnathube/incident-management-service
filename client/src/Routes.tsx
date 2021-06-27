import { Switch, Route, Redirect } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import IncidentsPage from './pages/Main/IncidentsPage';
import IncidentDetailsPage from './pages/Main/IncidentDetailsPage';
import NotFoundPage from './pages/Main/NotFoundPage';
import { useSelector } from 'react-redux';
import { selectAuthState } from './redux/slices/authSlice';
import storage from './utils/localStorage';

import { Container, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const Routes = () => {
  const { user } = useSelector(selectAuthState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const isLoggedIn = storage.loadUser() || user;

  return (
    <Container disableGutters={isMobile}>
      <Switch>
        <Route exact path="/">
          {isLoggedIn ? <IncidentsPage /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/incidents/:incidentId">
          {isLoggedIn ? <IncidentDetailsPage /> : <Redirect to="/login" />}
        </Route>
        <Route exact path="/login">
          {!isLoggedIn ? <LoginPage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/signup">
          {!isLoggedIn ? <SignupPage /> : <Redirect to="/" />}
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Container>
  );
};

export default Routes;
