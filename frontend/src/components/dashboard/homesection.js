import React, { Component } from 'react';
import ItemRow from './itemrow';

class HomeSection extends Component {
  	render() {
  		return (
      		<div className="home-section">
        		<div className="section-header">
        			{this.props.title}
        		</div>
        		{
              this.props.data.length > 0 ? (
        			  this.props.data.map(function(item,index) {
	                    return (
	                      	<ItemRow key={index} item={item}/>
	                    );
	              })
              ):(
                <p className="empty-page-msg">No {this.props.title.toLowerCase()} items found</p>
              )
	          }
      		</div>
    	);
  	}
}

export default HomeSection;
