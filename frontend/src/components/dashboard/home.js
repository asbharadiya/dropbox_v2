import React, { Component } from 'react';
import HomeSection from './homesection';
import RightContent from './rightcontent';
import {connect} from 'react-redux';
import * as actions from '../../actions/asset';

class Home extends Component {

	componentDidMount(){
		this.props.getStarredAssets();
		this.props.getRecentAssets();
	}

	componentWillReceiveProps(nextProps,props){
		if((this.props.deleteAssetSuccess !== nextProps.deleteAssetSuccess && nextProps.deleteAssetSuccess)
	    	|| (this.props.addAssetToStarredSuccess !== nextProps.addAssetToStarredSuccess && nextProps.addAssetToStarredSuccess)
	    	|| (this.props.removeAssetFromStarredSuccess !== nextProps.removeAssetFromStarredSuccess && nextProps.removeAssetFromStarredSuccess)
	    	|| (this.props.addFolderSuccess !== nextProps.addFolderSuccess && nextProps.addFolderSuccess)
	    	|| (this.props.uploadFileSuccess !== nextProps.uploadFileSuccess && nextProps.uploadFileSuccess)
            || (this.props.location && nextProps.location && this.props.location.pathname !== nextProps.location.pathname)){
	    	this.props.getStarredAssets();
			this.props.getRecentAssets();
	  }
	}

	render() {
		return (
    		<div className="inner-page-content has-right-content">
    			<div className="homepage">
        		<HomeSection title="Starred" data={this.props.starredAssets}/>
        		<HomeSection title="Recent" data={this.props.recentAssets}/>
      		</div>
      		<RightContent pagetype="home"/>
    		</div>
  	);
	}
}

function mapStateToProps(state) {
    return {
        starredAssets:state.starredAssets,
        recentAssets:state.recentAssets,
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
        getStarredAssets : () => dispatch(actions.getStarredAssets()),
        getRecentAssets : () => dispatch(actions.getRecentAssets())
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
