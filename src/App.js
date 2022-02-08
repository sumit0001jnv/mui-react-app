import SignIn from './Pages/sign-in/SignInComponent';
import SignUpComponent from './Pages/sign-up/SignUpComponent';
import UserProfileComponent from './Pages/user-profile/UserProfileComponent';
import Home from './Pages/home/home'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import AdminHomePage from './admin/components/AdminHomePage';
import './App.css'

function App() {
  return (
  <> 
    <Router>
      <Switch>
        <Route path="/" component={Home} exact></Route>
      <Route path="/sign-up" component={SignUpComponent} exact></Route>
       <Route path="/sign-in" component={SignIn} exact></Route>
       <Route path="/profile" component={UserProfileComponent} exact></Route>
       <Route path="/admin" component={AdminHomePage} exact></Route>
       <Route path="***">
         <h1>No page found</h1>
       </Route>
       </Switch>
    </Router>
    </>
  );
}

export default App;
