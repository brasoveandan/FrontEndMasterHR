import './App.css';
import './css/navbar.css'
import './css/sidebar.css'
import './css/utils.css'
import './css/timesheetView.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React from "react";
import HomePage from "./components/Presentation/HomePage";
import Switch from "react-bootstrap/Switch";
import {Route} from 'react-router-dom';
import LoginPage from "./components/Presentation/LoginPage";
import NotFoundPage from "./components/utils/NotFoundPage";
import EmployeeDashboard from "./components/Employee/EmployeeDashboard";
import PrivateRouteEmployee from "./components/utils/PrivateRouteEmployee"
import AdminDashboard from "./components/Admin/AdminDashboard";
import GroupLeaderDashboard from "./components/GroupLeader/GroupLeaderDashboard";
import PrivateRouteGroupLeader from "./components/utils/PrivateRouteGroupLeader";
import PrivateRouteAdmin from "./components/utils/PrivateRouteAdmin";
import ForgotPasswordPage from "./components/Presentation/ForgotPasswordPage";
import ResetPasswordPage from "./components/Presentation/ResetPasswordPage";
import PrivateRouteEmployeeHR from "./components/utils/PrivateRouteEmployeeHR";
import EmployeeHRDashboard from "./components/EmployeeHR/EmployeeHRDashboard";

function App() {
  return (
      <React.Fragment>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/login" component={LoginPage}/>
              <Route path="/forgot" component={ForgotPasswordPage}/>
              <Route path="/reset/:id" component={ResetPasswordPage}/>

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
