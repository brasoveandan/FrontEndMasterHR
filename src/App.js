import './App.css';
import './style/navbar.css'
import './style/sidebar.css'
import './style/utils.css'
import './style/timesheetView.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React from "react";
import HomePage from "./components/Presentation/homePage";
import Switch from "react-bootstrap/Switch";
import {Route} from 'react-router-dom';
import LoginPage from "./components/Presentation/loginPage";
import NotFoundPage from "./components/NotFoundPage";
import EmployeeDashboard from "./components/Employee/employeeDashboard";
import PrivateRouteEmployee from "./routes/PrivateRouteEmployee"
import AdminDashboard from "./components/Admin/adminDashboard";
import GroupLeaderDashboard from "./components/GroupLeader/GroupLeaderDashboard";
import PrivateRouteGroupLeader from "./routes/PrivateRouteGroupLeader";
import PrivateRouteAdmin from "./routes/PrivateRouteAdmin";
import ForgotPasswordPage from "./components/Presentation/forgotPasswordPage";
import ResetPasswordPage from "./components/Presentation/resetPasswordPage";
import PrivateRouteEmployeeHR from "./routes/PrivateRouteEmployeeHR";
import EmployeeHRDashboard from "./components/EmployeeHR/employeeHRDashboard";

function App() {
  return (
      <React.Fragment>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/login" component={LoginPage}/>
              <Route path="/forgot_password" component={ForgotPasswordPage}/>
              <Route path="/reset_password" component={ResetPasswordPage}/>

              <PrivateRouteAdmin path="/admindashboard" component={AdminDashboard}/>
              <PrivateRouteEmployeeHR path="/employeehrdashboard" component={EmployeeHRDashboard}/>
              <PrivateRouteGroupLeader path="/groupleaderdashboard" component={GroupLeaderDashboard}/>
              <PrivateRouteEmployee path="/employeedashboard" component={EmployeeDashboard}/>

              <Route path="/not-found" component={NotFoundPage} />
            </Switch>
      </React.Fragment>
  );
}

export default App;
