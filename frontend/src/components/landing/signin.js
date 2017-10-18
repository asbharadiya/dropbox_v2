import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as api from '../../api/auth';
import * as actions from '../../actions';

class Signin extends Component {

  constructor(props){
    super(props);
    this.state = {
      emailError:"",
      passwordError:"",
      formError:""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({
      emailError:"",
      passwordError:"",
      formError:""
    });
    let isFormValid = true;
    if(this.email.value === ''){
      this.setState({emailError:"Please enter your email"});
      isFormValid = false;
    } else if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email.value))){
      this.setState({emailError:"Please enter valid email"});
      isFormValid = false;
    }
    if(this.password.value === ''){
      this.setState({passwordError:"Please enter your password"});
      isFormValid = false;
    }
    if(isFormValid) {
      api.signin({email:this.email.value,password:this.password.value})
      .then((res) => {
        if (res.status === 200) {
          this.props.history.push("/home");
          this.props.checkSession();
        } else if (res.status === 401) {
          this.setState({formError:"Invalid email or password"});
        } else {
          this.setState({formError:"Opps! Please try again"});
        }
      });
    }
  };

	render() {
  	return (
    		<div className="signin-form">
      		<div className="form-header">
      			<p className="title">Sign in</p>
      			<p className="subscript">
      				or <a onClick={this.props.onSignupClick}>create an account</a>
      			</p>
      		</div>
      		<div className="form-body">
        		<div className="form-group">
              <span className="error">{this.state.emailError}</span>
              <input type="email" className="form-control" placeholder="Email" ref={(email) => this.email = email}/>
        		</div>
        		<div className="form-group">
              <span className="error">{this.state.passwordError}</span>
        			<input type="password" className="form-control" placeholder="Password" ref={(password) => this.password = password}/>
        		</div>
        		<div className="form-group btn-container">
              <span className="error">{this.state.formError}</span>
        			<button className="btn btn-primary btn-dropbox" onClick={this.handleSubmit}>Sign in</button>
        		</div>
      		</div>
    		</div>
  	);
	}
}

function mapDispatchToProps(dispatch) {
    return {
        checkSession : () => dispatch(actions.checkSession())
    };
}

export default withRouter(connect(null,mapDispatchToProps)(props => <Signin {...props}/>));
