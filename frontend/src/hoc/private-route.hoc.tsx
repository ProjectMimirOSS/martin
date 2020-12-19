import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import React from 'react';
import Home from '../pages/home/home';
const PrivateRoute = (props: any) => {
    return (
        <Route path={props.path} render={
            data => props.isAuthenticated ? <Home><props.component {...props} /></Home> : <Redirect from="/" to="/login" />
        } />
    );
}
export default PrivateRoute;