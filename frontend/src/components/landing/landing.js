import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Signin from './signin';
import Signup from './signup';

class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = { activeState:'signin' };
    this.handleSignupClick = this.handleSignupClick.bind(this);
    this.handleSigninClick = this.handleSigninClick.bind(this);
  }

  handleSignupClick(){
    this.setState({activeState: 'signup'});
  }

  handleSigninClick(){
    this.setState({activeState: 'signin'});
  }

  render() {
    return (
      <div className="landing-page">
        <header>
          <div className="logo-container">
            <NavLink to="/">
              <img src="/assets/images/logo_icon.svg" alt="logo_icon" className="logo-icon"/>
              <img src="/assets/images/logo_text.svg" alt="logo_text" className="logo-text"/>
            </NavLink>
          </div>
        </header>
        <div className="page-content">
          <div className="page-inner-content">
            <div className="landing-img-container hidden-xs">
              <img src="/assets/images/landing.png" alt="landing"/>
            </div>
            <div className="form-container">
              {
                this.state.activeState === 'signin' ? (
                  <Signin onSignupClick={this.handleSignupClick}/>
                ):(
                  <Signup onSigninClick={this.handleSigninClick}/>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
