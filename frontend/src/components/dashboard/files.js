import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ItemRow from './itemrow';
import RightContent from './rightcontent';
import * as actions from '../../actions/asset';

class Files extends Component {

	constructor(props){
		super(props);
    this.loadPage = this.loadPage.bind(this);
	}

	componentDidMount(){
		this.loadPage(this.props);
	}

  componentWillReceiveProps(nextProps){
    if((this.props.deleteAssetSuccess !== nextProps.deleteAssetSuccess && nextProps.deleteAssetSuccess)
      || (this.props.addAssetToStarredSuccess !== nextProps.addAssetToStarredSuccess && nextProps.addAssetToStarredSuccess)
      || (this.props.removeAssetFromStarredSuccess !== nextProps.removeAssetFromStarredSuccess && nextProps.removeAssetFromStarredSuccess)
      || (this.props.addFolderSuccess !== nextProps.addFolderSuccess && nextProps.addFolderSuccess)
      || (this.props.uploadFileSuccess !== nextProps.uploadFileSuccess && nextProps.uploadFileSuccess)
      || (this.props.location && nextProps.location && this.props.location.pathname !== nextProps.location.pathname)){
      this.loadPage(nextProps);
    }
  }

  loadPage(props){
    let parent = null;
    let superParent = null;
    let location = props.location.pathname.split("/");
    if(location[location.length-1] !== "home" && location[location.length-1] !== "files"){
        parent = location[location.length-1];
        superParent = location[3];
    }
    this.props.getAssets(superParent,parent);
  }

	render() {
    return (
    		<div className="inner-page-content has-right-content">
    			<div className="filespage">
    				<div className="page-header">
	    			
	    		  </div>
    				{
              this.props.assets.length > 0 ? (
          			this.props.assets.map(function(item,index) {
                  return (
                    	<ItemRow key={index} item={item}/>
                  );
                })
  	          ) : (
                <p className="empty-page-msg">This folder is empty</p>
              )
            }
      		</div>
      		<RightContent pagetype="files"/>
    		</div>
  	);
	}
}

function mapStateToProps(state) {
    return {
      assets:state.assets,
      /*from child components*/
      deleteAssetSuccess:state.deleteAssetSuccess,
      addAssetToStarredSuccess:state.addAssetToStarredSuccess,
      removeAssetFromStarredSuccess:state.removeAssetFromStarredSuccess,
      addFolderSuccess:state.addFolderSuccess,
      uploadFileSuccess:state.uploadFileSuccess
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getAssets : (superParent,parent) => dispatch(actions.getAssets(superParent,parent))
    };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(props => <Files {...props}/>));
