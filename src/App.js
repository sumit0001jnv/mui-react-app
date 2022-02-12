import SignIn from './Pages/sign-in/SignInComponent';
import SignUpComponent from './Pages/sign-up/SignUpComponent';
import UserProfileComponent from './Pages/user-profile/UserProfileComponent';
import Home from './Pages/home/home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminHomePage from './admin/components/AdminHomePage';
import './App.css'
import CreateTemplate from './Pages/create-template/CreateTemplate';
import ParsePdf from './Pages/parse-pdf/ParsePdf';
import CustomCropper from './commons/components/cropper-component/CustomCropper';
import PdfViewer from './commons/components/cropper-component/test';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import CustomSnackbar from './commons/components/snackbar/CustomSnackbar'

function App() {
  const isLogedIn = useSelector(state => state.login.isLogedIn);
  useEffect(() => {
    console.log(isLogedIn);
  }, [isLogedIn]);
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" component={Home} exact></Route>
          <Route path="/sign-up" component={SignUpComponent} exact></Route>
          <Route path="/sign-in" component={SignIn} exact></Route>
          <Route path="/profile" component={UserProfileComponent} exact></Route>
          <Route path="/admin" component={AdminHomePage} exact></Route>
          <Route path="/parse-pdf" component={ParsePdf} exact></Route>
          <Route path="/create-template" component={CreateTemplate} exact></Route>
          <Route path="/test" component={CustomCropper} exact></Route>
          {/* <Route path="/test2" component={PdfViewer} exact></Route> */}
          <Route path="***">
            <h1>No page found</h1>
          </Route>
        </Switch>
      </Router>
      <CustomSnackbar/>
    </>
  );
}

export default App;
