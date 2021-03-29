import {Redirect, Route} from "react-router-dom";
import authentication from "./auth";


const PrivateRouteEmployeeHR = ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={props => {
            if(authentication() === "hr_employee")
                return <Component {...props}/>;
            return <Redirect to={{pathname: '/login'}}/>
        }}/>
    );
}

export default PrivateRouteEmployeeHR;
