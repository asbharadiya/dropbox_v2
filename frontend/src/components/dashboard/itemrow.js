import React, { Component } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Modal from 'react-modal';
import Autocomplete from 'react-autocomplete';
import * as actions from '../../actions/asset';
import * as groupsApi from '../../api/group';
import * as usersApi from '../../api/user';

class ItemRow extends Component {

  constructor(props){
    super(props);
    this.goToFolder = this.goToFolder.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.downloadAsset = this.downloadAsset.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.addAssetToStarred = this.addAssetToStarred.bind(this);
    this.removeAssetFromStarred = this.removeAssetFromStarred.bind(this);
    this.openShareModal = this.openShareModal.bind(this);
    this.closeShareModal = this.closeShareModal.bind(this);
    this.loadShareModalData = this.loadShareModalData.bind(this);
    this.shareAsset = this.shareAsset.bind(this);
    this.notificationSystem = null;
    this.state = {
      showShareModal: false,
      searchValue: "",
      usersAutocompleteData: [],
      groupsAutocompleteData: [],
      selectedOption: 'users'
    }
    // Bind `this` context to functions of the class
    this.onChange = this.onChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.getItemValue = this.getItemValue.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.retrieveUsersDataAsynchronously = this.retrieveUsersDataAsynchronously.bind(this);
    this.retrieveGroupsDataAsynchronously = this.retrieveGroupsDataAsynchronously.bind(this);
  }

  componentDidMount(){
    this.notificationSystem = this.refs.notificationSystem;
  }

  openShareModal(){
    //view share modal
    this.setState({ showShareModal: true });
  }

  closeShareModal(){
    this.setState({ showShareModal: false });
  }

  shareAsset(){
    if(this.state.selectedOption === 'users') {
      if(this.state.selectedUser){
        this.props.shareAsset(this.props.item._id,"users",this.state.selectedUser);
      }
    } else {
      if(this.state.selectedGroup){
        this.props.shareAsset(this.props.item._id,"groups",this.state.selectedGroup);
      }
    }
  }

  goToFolder(item){
    let location = this.props.location.pathname.split("/");
    if(location[location.length-1] === "home" || location[location.length-1] === "files"){
        this.props.history.push("folders/"+item.owner_id+"/"+item.name);
    } else {
      this.props.history.push(this.props.location.pathname+"/"+item.name);
    }
  }

  handleRowClick(){
    if(this.props.item.is_directory === 0){
      //download file
      this.downloadAsset();
    } else {
      this.goToFolder(this.props.item);
    }
  }

  downloadAsset(){
    //download asset
    let superParent = null
    let location = this.props.location.pathname.split("/");
    if(location[location.length-1] !== "home" && location[location.length-1] !== "files" && location[location.length-1] !== "groups"){
        superParent = location[3];
    }
    if(superParent === null) {
      window.open("http://localhost:3001/api/download_asset/"+this.props.item._id,"_blank");
    } else {
      window.open("http://localhost:3001/api/download_asset/"+this.props.item._id+"/"+superParent,"_blank");
    }
  }

  deleteAsset(){
    //delete asset
    this.props.deleteAsset(this.props.item._id);
  }

  addAssetToStarred(){
    //add asset to starred
    this.props.starAsset(this.props.item._id,true);
  }

  removeAssetFromStarred(){
    //remove asset from starred
    this.props.starAsset(this.props.item._id,false);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.deleteAssetSuccess){
      this.notificationSystem.addNotification({
        message: 'Successfully deleted',
        level: 'success'
      });
    } else if(nextProps.deleteAssetSuccess === false){
      this.notificationSystem.addNotification({
        message: 'Opps! Something went wrong',
        level: 'error'
      });
    }
    if(nextProps.addAssetToStarredSuccess){
        this.notificationSystem.addNotification({
          message: 'Successfully added to starred',
          level: 'success'
        });
    } else if(nextProps.deleteAssetSuccess === false){
        this.notificationSystem.addNotification({
          message: 'Opps! Something went wrong',
          level: 'error'
        });
    }
    if(nextProps.removeAssetFromStarredSuccess){
        this.notificationSystem.addNotification({
          message: 'Successfully removed from starred',
          level: 'success'
        });
    } else if(nextProps.deleteAssetSuccess === false){
        this.notificationSystem.addNotification({
          message: 'Opps! Something went wrong',
          level: 'error'
        });
    }
    if(nextProps.shareAssetSuccess){
      this.notificationSystem.addNotification({
        message: 'Asset successfully shared',
        level: 'success'
      });
      this.setState({
        selectedUser: undefined,
        selectedGroup: undefined,
        searchValue: ""
      });
    } else if(nextProps.shareAssetSuccess === false) {
      this.notificationSystem.addNotification({
        message: 'Opps! Something went wrong',
        level: 'error'
      });
    }
  }

  loadShareModalData(){
    this.retrieveUsersDataAsynchronously("");
    this.retrieveGroupsDataAsynchronously("");
  }

  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
      selectedUser: undefined,
      selectedGroup: undefined,
      searchValue: ""
    });
  }

  handleNameChange(event){
    this.setState({
      name: event.target.value
    })
  }

  retrieveUsersDataAsynchronously(input){
    usersApi.searchUsers(input)
    .then((res) => {
      if (res.status === 200) {
        this.setState({
          usersAutocompleteData: res.data
        });
      }
    });
  }

  retrieveGroupsDataAsynchronously(input){
    groupsApi.searchGroup(input)
    .then((res) => {
      if (res.status === 200) {
        this.setState({
          groupsAutocompleteData: res.data
        });
      }
    });
  }

  onChange(e){
    this.setState({
      searchValue: e.target.value
    });
    //this.retrieveDataAsynchronously(e.target.value);
  }

  onSelect(val,item){
    if(this.state.selectedOption === 'users') {
      this.setState({
          searchValue: val,
          selectedUser: item._id
      });
    } else {
      this.setState({
          searchValue: val,
          selectedGroup: item._id
      });
    }
  }

  renderItem(item, isHighlighted){
    if(this.state.selectedOption === 'users') {
      return (
          <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item._id}>
            <p>{item.first_name} {item.last_name}</p>
            <p>{item.email}</p>
          </div>
      ); 
    } else {
      return (
          <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item._id}>
            <p>{item.name}</p>
          </div>
      );
    }
  }

  getItemValue(item){
    if(this.state.selectedOption === 'users') {
      return `${item.first_name+' '+item.last_name}`;
    } else {
      return `${item.name}`;
    }
  }

	render() {
		return (
      <div className="item-row" id="itemRow">
    		<div className="item-icon">
          {
            this.props.item.is_directory ? (
              <i className="fa fa-folder fa-3x" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-file fa-3x" aria-hidden="true"></i>
            )
          }
    		</div>
    		<div className="item-content">
    			<p className="item-title" onClick={this.handleRowClick}>{this.props.item.name}</p>
    			<div className="item-star">
    				{	
    					this.props.item.is_starred ? (
    						<button className="star" onClick={this.removeAssetFromStarred}><i className="fa fa-lg fa-star" aria-hidden="true"></i></button>
    					) : (
    						<button className="not-star" onClick={this.addAssetToStarred}><i className="fa fa-lg fa-star-o" aria-hidden="true"></i></button>
    					)
    				}
    			</div>
    		</div>
        <div className="item-options">
          {
            this.props.item.is_directory === 1 && this.props.item.can_delete_or_share === 0 ? (
              <div></div>
            ) : (
        			<NavDropdown 
        				title={
        					<button className="btn btn-primary btn-dropbox"><i className="fa fa-ellipsis-h" aria-hidden="true"></i></button>
        				} 
        				id="user-dropdown"
        				eventKey={1} >
                {  
                  this.props.item.is_directory === 0 &&
    		            <MenuItem eventKey={1.1} onClick={this.downloadAsset}>Download</MenuItem>
                }
    		        {
                  this.props.item.can_delete_or_share === 1 &&
                    <MenuItem eventKey={1.2} onClick={this.openShareModal}>Share</MenuItem>
                }
                {
                  this.props.item.can_delete_or_share === 1 &&
    		            <MenuItem eventKey={1.3} onClick={this.deleteAsset}>Delete</MenuItem>
                }
    	        </NavDropdown>
            )
          }
        </div>
        <Modal isOpen={this.state.showShareModal} onRequestClose={this.closeShareModal} closeTimeoutMS={500} onAfterOpen={this.loadShareModalData}
          className={{
              base: 'shareModal',
              afterOpen: 'shareModal_after-open',
              beforeClose: 'shareModal_before-close'
          }}
          overlayClassName={{
              base: 'shareModalOverlay',
              afterOpen: 'shareModalOverlay_after-open',
              beforeClose: 'shareModalOverlay_before-close'
          }}>
          <div className="row">
              <div className="col-xs-12 header">
                {
                  this.props.item.is_directory ? (
                    <i className="fa fa-folder fa-3x" aria-hidden="true"></i>
                  ) : (
                    <i className="fa fa-file fa-3x" aria-hidden="true"></i>
                  )
                }
                <div className="header-text">{this.props.item.name}</div>
              </div>
          </div>
          <hr/>
          <div className="share-container">
            <div className="row form-group">
              <div className="col-xs-12">
                <div className="radio">
                  <label>
                    <input type="radio" value="users" checked={this.state.selectedOption === 'users'} onChange={(_this)=>this.handleOptionChange(_this)} />
                    With user
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="groups" checked={this.state.selectedOption === 'groups'} onChange={(_this)=>this.handleOptionChange(_this)} />
                    With group
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-9">
                { 
                  this.state.selectedOption === 'users' ? (
                    <Autocomplete
                        inputProps={{ id: 'states-autocomplete', className: 'form-control'}}
                        wrapperStyle={{ position: 'relative', display: 'inline-block', width: '100%' }}
                        shouldItemRender={(item, value) => 
                          item.first_name.toLowerCase().indexOf(value.toLowerCase()) > -1
                          || item.last_name.toLowerCase().indexOf(value.toLowerCase()) > -1 
                          || item.email.toLowerCase().indexOf(value.toLowerCase()) > -1
                        }
                        getItemValue={this.getItemValue}
                        items={this.state.usersAutocompleteData}
                        renderItem={this.renderItem}
                        value={this.state.searchValue}
                        onChange={this.onChange}
                        onSelect={this.onSelect}
                        renderMenu={children => (
                          <div className="menu">
                            {children}
                          </div>
                        )}
                    />
                  ) :(
                    <Autocomplete
                        inputProps={{ id: 'states-autocomplete', className: 'form-control'}}
                        wrapperStyle={{ position: 'relative', display: 'inline-block', width: '100%' }}
                        shouldItemRender={(item, value) => 
                          item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
                        }
                        getItemValue={this.getItemValue}
                        items={this.state.groupsAutocompleteData}
                        renderItem={this.renderItem}
                        value={this.state.searchValue}
                        onChange={this.onChange}
                        onSelect={this.onSelect}
                        renderMenu={children => (
                          <div className="menu">
                            {children}
                          </div>
                        )}
                    />
                  )
                }
              </div>
              <div className="col-xs-3 text-right">
                <button className="btn btn-primary btn-dropbox" onClick={this.shareAsset}>Share</button>
              </div>
            </div>
          </div>
          <hr/>
          <div className="form-group footer">
              <button className="btn btn-default btn-dropbox-default" onClick={this.closeShareModal}>Cancel</button>
          </div>
        </Modal>
        <NotificationSystem ref="notificationSystem" />
	    </div>
  	);
	}
}

function mapStateToProps(state) {
    return {
        deleteAssetSuccess:state.deleteAssetSuccess,
        addAssetToStarredSuccess:state.addAssetToStarredSuccess,
        removeAssetFromStarredSuccess:state.removeAssetFromStarredSuccess,
        shareAssetSuccess:state.shareAssetSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteAsset : (id) => dispatch(actions.deleteAsset(id)),
        starAsset : (id,isStarred) => dispatch(actions.starAsset(id,isStarred)),
        shareAsset : (id,shareWith,targetId) => dispatch(actions.shareAsset(id,shareWith,targetId))
    };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <ItemRow {...props}/>));
