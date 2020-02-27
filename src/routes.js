import React from 'react'
import {Switch, Route} from 'react-router-dom'

//components
import Home from './components/Home'
import Login from './components/Login'

export default (
    <Switch>
        <Route component={Home} exact path='/' />
        <Route component={Login} path='/login' />
    </Switch>
)