import React, { Component } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import './App.css';
import './Responsive.css';
import * as actions from './actions';
import Landing from './components/landing/landing';
import Dashboard from './components/dashboard/dashboard';
import Home from './components/dashboard/home';
import Files from './components/dashboard/files';
import Group from './components/dashboard/group';
import Account from './components/dashboard/account';

class App extends Component {

  componentWillMount(){
    this.props.checkSession();
  }

  render() {
    const isLogged = this.props.isLogged;
    return (
      <div>
      {
        isLogged === undefined ? (
          <div className="text-center"><h1>Loading...</h1></div>
        ) : (
          <BrowserRouter>
            <Switch>
              <Route exact path='/' render={() => (
                isLogged ? (
                  <Redirect to="/home"/>
                ) : (
                  <Landing/>
                )
              )}/>
              <Dashboard>
                <Route path='/home' render={() => (
                  !isLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <Home/>
                  )
                )}/>
                <Route path='/files' render={() => (
                  !isLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <Files/>
                  )
                )}/>
                <Route path='/folders/:ownerid(\d+)/*' render={() => (
                  !isLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <Files/>
                  )
                )}/>
                <Route path='/groups' render={() => (
                  !isLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <Group/>
                  )
                )}/>
                <Route path='/account' render={() => (
                  !isLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <Account/>
                  )
                )}/>
              </Dashboard>
            </Switch>
          </BrowserRouter>
        )
      }
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {isLogged:state.isLogged};
}

function mapDispatchToProps(dispatch) {
    return {
        checkSession : () => dispatch(actions.checkSession())
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
