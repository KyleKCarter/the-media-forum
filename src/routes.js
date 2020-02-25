import React from 'react'
import {Switch, Route} from 'react-router-dom'

//components
import Home from './components/Home'
import Login from './components/GoogleAuth'
import Register from './components/Register'

export default (
    <Switch>
        <Route component={Home} exact path='/' />
        <Route component={Login} path='/login' />
        <Route component={Register} path='/register' />
    </Switch>
)