import {Redirect, Route} from "react-router-dom";
import authentication from "./authentication";


const PrivateRouteAdmin= ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={props => {
            if(authentication() === "admin")
                return <Component {...props}/>;
            return <Redirect to={{pathname: '/login'}}/>
        }}/>
    );
}

export default PrivateRouteAdmin;
