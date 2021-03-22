import {Redirect, Route} from "react-router-dom";
import authentication from "./auth";


const PrivateRouteGroupLeader = ({component: Component, ...rest}) => {

    return (
        <Route {...rest} render={props => {
            if(authentication() === "group_leader")
                return <Component {...props}/>;
            return <Redirect to={{pathname: '/login'}}/>
        }}/>
    );
}

export default PrivateRouteGroupLeader;
