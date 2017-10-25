import React, { Component } from 'react';
import RightContent from './rightcontent';
import {connect} from 'react-redux';
import NotificationSystem from 'react-notification-system';
import GroupRow from './grouprow';
import * as actions from '../../actions/group';

class Group extends Component {

	constructor(props){
        super(props);
        this.loadPage = this.loadPage.bind(this);
        this.notificationSystem = null;
    }

    componentDidMount(){
        this.loadPage();
        this.notificationSystem = this.refs.notificationSystem;
    }

    componentWillReceiveProps(nextProps){
        if((this.props.deleteGroupSuccess !== nextProps.deleteGroupSuccess && nextProps.deleteGroupSuccess)
          || (this.props.addGroupSuccess !== nextProps.addGroupSuccess && nextProps.addGroupSuccess)
          || (this.props.updateGroupSuccess !== nextProps.updateGroupSuccess && nextProps.updateGroupSuccess)){
            this.loadPage();
            if(nextProps.deleteGroupSuccess){
                this.notificationSystem.addNotification({
                message: 'Group successfully deleted',
                level: 'success'
              });
            } else if(nextProps.deleteGroupSuccess === false) {
              this.notificationSystem.addNotification({
                message: 'Opps! Something went wrong',
                level: 'error'
              });
            }
        }
    }

    loadPage(){
        this.props.getGroups();
    }

	render() {
		return (
    		<div className="inner-page-content has-right-content">
    			<div className="groupspage">
            		<div className="page-header">
                    
                    </div>
                    {
                        this.props.groups.map(function(group,index) {
                            return (
                                <GroupRow key={index} group={group}/>
                            );
                        })
                    }
          		</div>
          		<RightContent pagetype="groups"/>
                <NotificationSystem ref="notificationSystem" />
    		</div>
  	    );
	}
}

function mapStateToProps(state) {
    return {
        groups:state.groups,
        /*from child components*/
        deleteGroupSuccess:state.deleteGroupSuccess,
        addGroupSuccess:state.addGroupSuccess,
        updateGroupSuccess:state.updateGroupSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getGroups : () => dispatch(actions.getGroups())
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Group);
