import SignIn from './pages/sign-in/SignInComponent';
import SignUpComponent from './pages/sign-up/SignUpComponent';
import UserProfileComponent from './pages/user-profile/UserProfileComponent';
import Home from './pages/home/home'
import { BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom';
import AdminHomePage from './pages/admin/AdminHomePage';
import G2UserHomePage from './pages/g2-user/G2UserHomePage';
import './App.css'
import CreateTemplate from './pages/create-template/CreateTemplate';
import ParsePdf from './pages/parse-pdf/ParsePdf';
import CustomCropper from './commons/components/cropper-component/CustomCropper';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import CustomSnackbar from './commons/components/snackbar/CustomSnackbar'
import G2bLandingPage from './pages/g2b-user/G2bLandingPage';
import QuoteDetail from './pages/g2b-user/QuoteDetail';
import { useHistory } from "react-router-dom";
import Setting from './pages/admin/Setting';

function App() {
  // const history = useHistory();
  // const { isLogedIn, user } = useSelector(state => state.login);
  // useEffect(() => {
  //   console.log(isLogedIn, user);
  //   let obj = {};
  //   if (isLogedIn) {
  //     switch (user.userCategory) {
  //       case 'admin': {
  //         obj.pathname = '/admin';
  //         obj.userCategory = 'Admin';
  //         break;
  //       }
  //       case 'g2':
  //         {
  //           obj.pathname = '/g2-user';
  //           obj.userCategory = 'Group 2';
  //           break;
  //         }
  //       case 'g2b':
  //         {
  //           obj.pathname = '/g2b-user';
  //           obj.userCategory = 'Group 2B';
  //           break;
  //         }
  //       case 'g3': {
  //         obj.pathname = '/g3-user';
  //         obj.userCategory = 'Group 3';
  //         break;
  //       }
  //     }
  //     if (obj.pathname) {
  //       history.push({
  //         pathname: obj.pathname,
  //         state: obj
  //       })
  //     }

  //   }

  // }, [isLogedIn]);
  return (
    <>
      <HashRouter>
        <Switch>
          <Route path="/" component={Home} exact></Route>
          <Route path="/sign-up" component={SignUpComponent} exact></Route>
          <Route path="/sign-in" component={SignIn} exact></Route>
          <Route path="/profile" component={UserProfileComponent} exact></Route>
          <Route path="/admin" component={AdminHomePage} exact></Route>
          <Route path="/parse-pdf" component={ParsePdf} exact></Route>
          <Route path="/create-template" component={CreateTemplate} exact></Route>
          <Route path="/g2-user" component={G2UserHomePage} exact></Route>
          <Route path="/g2b-user" component={G2bLandingPage} exact></Route>
          <Route path="/quote-detail" component={QuoteDetail} exact></Route>
          <Route path="/setting" component={Setting} exact></Route>
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
