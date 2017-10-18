import React, { Component } from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import {connect} from 'react-redux';
import * as actions from '../../actions';

class Header extends Component {

	constructor(props) {
      super(props);
      this.handleLink = this.handleLink.bind(this);
      let location = props.location.pathname.split("/");
      location.shift();
      this.state = {
        location: location
      }
  }
    
  handleLink(path) {
    this.props.history.push(path);
  }

  componentWillReceiveProps(nextProps){
    let location = nextProps.location.pathname.split("/");
    location.shift();
    this.setState({
      location: location
    });
  }

  logout(){
    this.props.logout();
  }

	render() {
    const location = this.state.location;
    return (
    		<header>
    			<div className="page-title-container">
    				<h1>
              {
                location[0] === 'files' ? (
                  'Dropbox'
                ) : location[0] === 'folders' ? (
                  location.map(function(path,index) {
                    let breadcrumb = null;
                    let subpath = location.slice(0,index+1);
                    index === 0 ? (
                      breadcrumb = <span key={index}><NavLink to="/files">Dropbox</NavLink></span>
                    ) : index === location.length-1 ? (
                      breadcrumb = <span key={index}><span className="breadcrumb-arrow"> > </span><span>{path}</span></span>
                    ) : index !== 1 ? (
                      breadcrumb = <span key={index}><span className="breadcrumb-arrow"> > </span><NavLink to={`/${subpath.join("/")}`}>{path}</NavLink></span>
                    ) : (
                      breadcrumb = null
                    )
                    return breadcrumb;
                  })
                ) : location[0] === 'account' ? (
                  'Account Settings'
                ) : location[0] === 'groups' ? (
                  'Groups'
                ) : (
                  'Home'
                )
              }
            </h1>
    			</div>
    			<div className="topnav-container">
      			<Nav>
			        <NavDropdown eventKey={1} title={
                  <div className="pull-left">
                    {this.props.uname}
                  </div>
                } 
                id="user-dropdown">
				        <MenuItem eventKey={1.1} onClick={()=>this.handleLink("/account")}>Account Settings</MenuItem>
				        <MenuItem eventKey={1.2} onClick={()=>this.props.logout()}>Logout</MenuItem>
			        </NavDropdown>
			    </Nav>
    			</div>
    		</header>
  	);
	}
}

function mapStateToProps(state) {
    return {uname:state.uname};
}

function mapDispatchToProps(dispatch) {
    return {
        logout : () => dispatch(actions.logout())
    };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <Header {...props}/>));
