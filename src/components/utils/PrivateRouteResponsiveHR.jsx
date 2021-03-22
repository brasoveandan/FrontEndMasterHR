import {Redirect, Route} from "react-router-dom";
import authentication from "./auth";


const PrivateRouteReponsiveHR = ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={props => {
            if(authentication() === "hr_department_responsive")
                return <Component {...props}/>;
            return <Redirect to={{pathname: '/login'}}/>
        }}/>
    );
}

export default PrivateRouteReponsiveHR;
