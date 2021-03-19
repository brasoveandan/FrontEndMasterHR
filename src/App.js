import './App.css';
import React from "react";
import HomePage from "./components/Presentation/HomePage";
import Switch from "react-bootstrap/Switch";
import {Route} from 'react-router-dom';
import LoginPage from "./components/Presentation/LoginPage";
import NotFoundPage from "./components/utils/NotFoundPage";
import EmployeeDashboard from "./components/Employee/EmployeeDashboard";
import PrivateEmployeeRoute from "./components/utils/PrivateEmployeeRoute"
import NavBar from "./components/utils/NavBar";

function App() {
  return (
      <React.Fragment>
            <Switch>
              <Route path="/" exact component={HomePage} />
              <Route path="/login" component={LoginPage}/>

              <PrivateEmployeeRoute path="/employeedashboard" component={EmployeeDashboard}/>

              <Route path="/not-found" component={NotFoundPage} />
            </Switch>
      </React.Fragment>
  );
}

export default App;
