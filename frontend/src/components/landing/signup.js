import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as api from '../../api/auth';
import * as actions from '../../actions';

class Signup extends Component {

  constructor(props){
    super(props);
    this.state = {
      emailError:"",
      passwordError:"",
      firstNameError:"",
      lastNameError:"",
      formError:""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({
      emailError:"",
      passwordError:"",
      firstNameError:"",
      lastNameError:"",
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
    if(this.firstName.value === ''){
      this.setState({firstNameError:"Please enter your first name"});
      isFormValid = false;
    }
    if(this.lastName.value === ''){
      this.setState({lastNameError:"Please enter your last name"});
      isFormValid = false;
    }
    if(isFormValid) {
      api.signup({email:this.email.value,password:this.password.value,first_name:this.firstName.value,last_name:this.lastName.value})
      .then((res) => {
        if (res.status === 200) {
          this.props.history.push("/home");
          this.props.checkSession();
        } else if (res.status === 409) {
          this.setState({formError:"User already exists"});
        } else {
          this.setState({formError:"Opps! Please try again"});
        }
      });
    }
  };

	render() {
  	return (
    		<div className="signup-form">
      		<div className="form-header">
      			<p className="title">Create an account</p>
      			<p className="subscript">
      				or <a onClick={this.props.onSigninClick}>log in</a>
      			</p>
      		</div>
      		<div className="form-body">
      			<div className="form-group">
              <span className="error">{this.state.firstNameError}</span>
        			<input type="text" className="form-control" placeholder="First name" ref={(firstName) => this.firstName = firstName}/>
        		</div>
        		<div className="form-group">
              <span className="error">{this.state.lastNameError}</span>
        			<input type="text" className="form-control" placeholder="Last name" ref={(lastName) => this.lastName = lastName}/>
        		</div>
        		<div className="form-group">
              <span className="error">{this.state.emailError}</span>
        			<input type="text" className="form-control" placeholder="Email" ref={(email) => this.email = email}/>
        		</div>
        		<div className="form-group">
              <span className="error">{this.state.passwordError}</span>
        			<input type="password" className="form-control" placeholder="Password" ref={(password) => this.password = password}/>
        		</div>
        		<div className="form-group btn-container">
              <span className="error">{this.state.formError}</span>
        			<button className="btn btn-primary btn-dropbox" onClick={this.handleSubmit}>Create an account</button>
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

export default withRouter(connect(null,mapDispatchToProps)(props => <Signup {...props}/>));
