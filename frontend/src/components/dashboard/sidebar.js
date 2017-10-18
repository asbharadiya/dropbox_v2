import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {
  	render() {
    	return (
      		<div className="sidebar-panel">
      			<div className="sidebar-panel-container">
      				<div className="logo-container">
      					<NavLink to="/home">
			              	<img src="/assets/images/logo_icon.svg" alt="logo_icon" className="logo-icon"/>
			            </NavLink>
      				</div>
      				<div className="nav-container">
      					<ul>
      						<li>
      							<NavLink to="/home">
      								Home
      							</NavLink>
      						</li>
      						<li>
      							<NavLink to="/files">
      								Files
      							</NavLink>
      						</li>
                  <li>
                    <NavLink to="/groups">
                      Groups
                    </NavLink>
                  </li>
      					</ul>
      				</div>
      			</div>
      		</div>
    	);
  	}
}

export default Sidebar;
