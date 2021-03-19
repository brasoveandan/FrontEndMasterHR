import {Redirect, Route} from "react-router-dom";
import authentication from "./auth";


const PrivateEmployeeRoute = ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={props => {
            if(authentication() === "employee")
                return <Component {...props}/>;
            return <Redirect to={{pathname: '/login'}}/>
        }}/>
    );
}

export default PrivateEmployeeRoute;
