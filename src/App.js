import SignIn from './pages/sign-in/SignInComponent';
import SignUpComponent from './pages/sign-up/SignUpComponent';
import UserProfileComponent from './pages/user-profile/UserProfileComponent';
import Home from './pages/home/home'
import { Route, Switch, HashRouter } from 'react-router-dom';
import AdminHomePage from './pages/admin/AdminHomePage';
import G2UserHomePage from './pages/g2-user/G2UserHomePage';
import './App.css'
import CreateTemplate from './pages/create-template/CreateTemplate';
import ParsePdf from './pages/parse-pdf/ParsePdf';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import CustomSnackbar from './commons/components/snackbar/CustomSnackbar'
import G2bLandingPage from './pages/g2b-user/G2bLandingPage';
import QuoteDetail from './pages/g2b-user/QuoteDetail';
import { useHistory, Redirect } from "react-router-dom";
import Setting from './pages/admin/Setting';
import Unauthorized from './pages/unauthorized/Unauthorized';
import PdfViewer from './commons/components/cropper-component/PdfViewer';

function App() {
  const history = useHistory();
  const { isLogedIn, user } = useSelector(state => state.login);
  useEffect(() => {
    setTimeout(() => {
      let obj = { pathname: '/' };
      if (isLogedIn) {
        switch (user.userCategory) {
          case 'admin': {
            obj.pathname = '/admin';
            obj.userCategory = 'Admin';
            break;
          }
          case 'g2':
            {
              obj.pathname = '/g2-user';
              obj.userCategory = 'Group 2';
              break;
            }
          case 'g2b':
            {
              obj.pathname = '/g2b-user';
              obj.userCategory = 'Group 2B';
              break;
            }
          case 'g3': {
            obj.pathname = '/g3-user';
            obj.userCategory = 'Group 3';
            break;
          }
        }
        if (obj.pathname) {
          if (history) {
            history.push({
              pathname: obj.pathname,
              state: obj
            })
          }
        }
      }
    }, 300)


  }, [isLogedIn]);
  const ProtectedRoute = ({ component: Component, auth, ...rest }) => (
    <Route {...rest} render={props => (
      auth ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/unauthorized',
        }} />
      )
    )} />
  );
  return (
    <>
      <HashRouter>
        <Switch>
          <Route path="/" component={Home} exact></Route>
          <Route path="/sign-up" component={SignUpComponent} exact></Route>
          <Route path="/sign-in" component={SignIn} exact></Route>
          <Route path="/profile" component={UserProfileComponent} exact />
          <ProtectedRoute path="/admin" component={AdminHomePage} auth={isLogedIn} exact />
          <ProtectedRoute path="/parse-pdf" component={ParsePdf} auth={isLogedIn} exact />
          <ProtectedRoute path="/create-template" component={CreateTemplate} auth={isLogedIn} exact />
          <ProtectedRoute path="/g2-user" component={G2UserHomePage} auth={isLogedIn} exact />
          <ProtectedRoute path="/g2b-user" component={G2bLandingPage} auth={isLogedIn} exact />
          <ProtectedRoute path="/quote-detail" component={QuoteDetail} auth={isLogedIn} exact />
          <ProtectedRoute path="/setting" component={Setting} auth={isLogedIn} exact />
          <Route path="/test" component={PdfViewer}  exact />
          <Route path="/unauthorized" component={Unauthorized}>
            {/* <h1>Sorry You don't have access to to view this page</h1> */}
          </Route>
          <Route path="***">
            <h1>No page found</h1>
          </Route>
        </Switch>
      </HashRouter>
      <CustomSnackbar />
    </>
  );
}

export default App;
