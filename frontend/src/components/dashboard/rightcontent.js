import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import * as actions from '../../actions/asset';
import * as groupActions from '../../actions/group';

class RightContent extends Component {

    constructor(props) {
        super(props);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleFileClick = this.handleFileClick.bind(this);
        this.openNewFolder = this.openNewFolder.bind(this);
        this.createNewFolder = this.createNewFolder.bind(this);
        this.closeNewFolder = this.closeNewFolder.bind(this);
        this.openNewGroup = this.openNewGroup.bind(this);
        this.createNewGroup = this.createNewGroup.bind(this);
        this.closeNewGroup = this.closeNewGroup.bind(this);
        this.state = {
            showModal: false,
            showGroupModal: false,
            newFolderError: "",
            newFolderFormError: ""
        }
        this.notificationSystem = null;
    }

    componentDidMount(){
        this.notificationSystem = this.refs.notificationSystem;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.addFolderSuccess){
            this.closeNewFolder();
            this.notificationSystem.addNotification({
              message: 'Folder successfully added',
              level: 'success'
            });
        } else if(nextProps.addFolderSuccess === false) {
            this.setState({
                newFolderFormError: "Opps! Please try again"
            });
        }
        if(nextProps.addGroupSuccess){
            this.closeNewGroup();
            this.notificationSystem.addNotification({
              message: 'Group successfully added',
              level: 'success'
            });
        } else if(nextProps.addGroupSuccess === false) {
            this.setState({
                newGroupFormError: "Opps! Please try again"
            });
        }
        if(nextProps.uploadFileSuccess){
            //TODO: show notification that file uploaded successfully
            this.notificationSystem.addNotification({
              message: 'File successfully uploaded',
              level: 'success'
            });
        } else if(nextProps.uploadFileSuccess === false) {
            this.notificationSystem.addNotification({
              message: 'Opps! Something went wrong',
              level: 'error'
            });
        }
    }

    handleFileClick() {
        document.getElementById("fileUpload").value = null;
    }

    handleFileUpload() {
        let files = document.getElementById("fileUpload").files;
        let parent = null;
        let superParent = null
        let location = this.props.location.pathname.split("/");
        if(location[location.length-1] !== "home" && location[location.length-1] !== "files" && location[location.length-1] !== "groups"){
            parent = location[location.length-1];
            superParent = location[3];
        }
        this.props.addAsset(files[0],false,superParent,parent,null);
    }

    openNewFolder() {
        this.setState({ showModal: true });
    }

    closeNewFolder() {
        this.setState({ showModal: false });
    }

    createNewFolder() {
        this.setState({
            newFolderError: "",
            newFolderFormError: ""
        });
        let isValid = true;
        if(this.folderName.value === "") {
            isValid = false;
            this.setState({
                newFolderError: "Please enter folder name"
            });
        }
        if(isValid) {
            let parent = null;
            let superParent = null
            let location = this.props.location.pathname.split("/");
            if(location[location.length-1] !== "home" && location[location.length-1] !== "files"){
                parent = location[location.length-1];
                superParent = location[3];
            }
            this.props.addAsset(null,true,superParent,parent,this.folderName.value);
        }
    }

    openNewGroup() {
        this.setState({ showGroupModal: true });
    }

    closeNewGroup() {
        this.setState({ showGroupModal: false });
    }

    createNewGroup() {
        this.setState({
            newGroupError: "",
            newGroupFormError: ""
        });
        let isValid = true;
        if(this.groupName.value === "") {
            isValid = false;
            this.setState({
                newGroupError: "Please enter group name"
            });
        }
        if(isValid) {
            this.props.createGroup(this.groupName.value);
        }
    }

	render() {
        return (
        	<div className="right-content">
        		<div className="right-content-inner">
        			{
        				this.props.pagetype === "home" ? (
                            <div className="input-file-wrapper">
                                <button className="btn btn-primary btn-dropbox btn-main">Upload files</button>
                                <input type="file" id="fileUpload" name="upload" onChange={this.handleFileUpload} onClick={this.handleFileClick}/>
                            </div>
        				) : this.props.pagetype === "files" ? (
        					<div>
                                <div className="input-file-wrapper">
                                    <button className="btn btn-primary btn-dropbox btn-main">Upload files</button>
                                    <input type="file" id="fileUpload" name="upload" onChange={this.handleFileUpload} onClick={this.handleFileClick}/>
                                </div>
                                <ul className="secondary-menu">
        							<li className="menu-element">
        								<a onClick={this.openNewFolder}>
        									<i className="fa fa-folder-o" aria-hidden="true"></i>
        									<span>New folder</span>
        								</a>
        							</li>
        						</ul>
                                <Modal isOpen={this.state.showModal} onRequestClose={this.closeNewFolder} closeTimeoutMS={500}
                                    className={{
                                        base: 'newFolderModal',
                                        afterOpen: 'newFolderModal_after-open',
                                        beforeClose: 'newFolderModal_before-close'
                                    }}
                                    overlayClassName={{
                                        base: 'newFolderModalOverlay',
                                        afterOpen: 'newFolderModalOverlay_after-open',
                                        beforeClose: 'newFolderModalOverlay_before-close'
                                    }}>
                                    <div className="form-group">
                                        <span className="error">{this.state.newFolderError}</span>
                                        <input type="text" className="form-control" placeholder="New folder name" ref={(folderName) => this.folderName = folderName}/>
                                    </div>
                                    <div className="form-group btn-container">
                                        <span className="error">{this.state.newFolderFormError}</span>
                                        <button className="btn btn-primary btn-dropbox" onClick={this.createNewFolder}>Done</button>
                                        <button className="btn btn-default btn-dropbox-default" onClick={this.closeNewFolder}>Cancel</button>
                                    </div>
                                </Modal>
        					</div>
        				) : this.props.pagetype === "groups" ? (
                            <div>
                                <ul className="secondary-menu">
                                    <li className="menu-element">
                                        <a onClick={this.openNewGroup}>
                                            <i className="fa fa-users" aria-hidden="true"></i>
                                            <span>New group</span>
                                        </a>
                                    </li>
                                </ul>
                                <Modal isOpen={this.state.showGroupModal} onRequestClose={this.closeNewGroup} closeTimeoutMS={500}
                                    className={{
                                        base: 'newFolderModal',
                                        afterOpen: 'newFolderModal_after-open',
                                        beforeClose: 'newFolderModal_before-close'
                                    }}
                                    overlayClassName={{
                                        base: 'newFolderModalOverlay',
                                        afterOpen: 'newFolderModalOverlay_after-open',
                                        beforeClose: 'newFolderModalOverlay_before-close'
                                    }}>
                                    <div className="form-group">
                                        <span className="error">{this.state.newGroupError}</span>
                                        <input type="text" className="form-control" placeholder="New group name" ref={(groupName) => this.groupName = groupName}/>
                                    </div>
                                    <div className="form-group btn-container">
                                        <span className="error">{this.state.newGroupFormError}</span>
                                        <button className="btn btn-primary btn-dropbox" onClick={this.createNewGroup}>Done</button>
                                        <button className="btn btn-default btn-dropbox-default" onClick={this.closeNewGroup}>Cancel</button>
                                    </div>
                                </Modal>
                            </div>
                        ) : (
        					<div></div>
        				)
        			}
        		</div>
                <NotificationSystem ref="notificationSystem" />
          </div>
  	    );
	}
}

function mapStateToProps(state) {
    return {
        addFolderSuccess:state.addFolderSuccess,
        uploadFileSuccess:state.uploadFileSuccess,
        addGroupSuccess:state.addGroupSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addAsset : (file,isDir,superParent,parent,name) => dispatch(actions.addAsset(file,isDir,superParent,parent,name)),
        createGroup : (name) => dispatch(groupActions.createGroup(name))
    };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <RightContent {...props}/>));
