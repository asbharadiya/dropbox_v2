import * as api from '../api/asset';

function addAssetSuccess(isDir) {
  	return {type: "ADD_ASSET_SUCCESS",isDir}
}

function addAssetFailure(isDir){
    return {type: "ADD_ASSET_FAILURE",isDir}
}

export function addAsset(file,isDir,superParent,parent,name) {
	return function(dispatch) {
		let formData  = new FormData();
		if(file !== null) {
			formData.append("file",file);
		}
		formData.append("isDirectory",isDir);
		if(parent !== null) {
			formData.append("parent",parent);
		}
		if(superParent !== null) {
			formData.append("superParent",superParent);
		}
		if(name !== null) {
			formData.append("name",name);
		}
	    return api.addAsset(formData).then(response => {
	    	if(response.status === 200){
	    		dispatch(addAssetSuccess(isDir));
	    	} else {
	    		dispatch(addAssetFailure(isDir));
	    	}
	    }).catch(error => {
	      	dispatch(addAssetFailure(isDir));
	    });
	};
}

function getAssetsSuccess(data) {
  	return {type: "GET_ASSETS_SUCCESS",data}
}

function getAssetsFailure(){
    return {type: "GET_ASSETS_FAILURE"}
}

export function getAssets(superParent,parent) {
	return function(dispatch) {
		return api.getAssets({superParent:superParent,parent:parent}).then(response => {
	    	if(response.status === 200){
	    		dispatch(getAssetsSuccess(response.data));
	    	} else {
	    		dispatch(getAssetsFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getAssetsFailure());
	    });
	};
}

function getStarredAssetsSuccess(data) {
  	return {type: "GET_STARRED_ASSETS_SUCCESS",data}
}

function getStarredAssetsFailure(){
    return {type: "GET_STARRED_ASSETS_FAILURE"}
}

export function getStarredAssets() {
	return function(dispatch) {
		return api.getAssets({starred:true}).then(response => {
	    	if(response.status === 200){
	    		dispatch(getStarredAssetsSuccess(response.data));
	    	} else {
	    		dispatch(getStarredAssetsFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getStarredAssetsFailure());
	    });
	};
}

function getRecentAssetsSuccess(data) {
  	return {type: "GET_RECENT_ASSETS_SUCCESS",data}
}

function getRecentAssetsFailure(){
    return {type: "GET_RECENT_ASSETS_FAILURE"}
}

export function getRecentAssets() {
	return function(dispatch) {
		return api.getAssets({recent:true}).then(response => {
	    	if(response.status === 200){
	    		dispatch(getRecentAssetsSuccess(response.data));
	    	} else {
	    		dispatch(getRecentAssetsFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getRecentAssetsFailure());
	    });
	};
}

function deleteAssetSuccess() {
  	return {type: "DELETE_ASSET_SUCCESS"}
}

function deleteAssetFailure(){
    return {type: "DELETE_ASSET_FAILURE"}
}

export function deleteAsset(id) {
	return function(dispatch) {
		return api.deleteAsset({assetId:id}).then(response => {
	    	if(response.status === 200){
	    		dispatch(deleteAssetSuccess());
	    	} else {
	    		dispatch(deleteAssetFailure());
	    	}
	    }).catch(error => {
	      	dispatch(deleteAssetFailure());
	    });
	};
}

function starAssetSuccess(isStarred) {
  	return {type: "STAR_ASSET_SUCCESS",isStarred}
}

function starAssetFailure(isStarred){
    return {type: "STAR_ASSET_FAILURE",isStarred}
}

export function starAsset(id,isStarred) {
	return function(dispatch) {
		return api.starAsset({assetId:id,isStarred:isStarred}).then(response => {
	    	if(response.status === 200){
	    		dispatch(starAssetSuccess(isStarred));
	    	} else {
	    		dispatch(starAssetFailure(isStarred));
	    	}
	    }).catch(error => {
	      	dispatch(starAssetFailure(isStarred));
	    });
	};
}

function shareAssetSuccess() {
  	return {type: "SHARE_ASSET_SUCCESS"}
}

function shareAssetFailure(){
    return {type: "SHARE_ASSET_FAILURE"}
}

export function shareAsset(id,shareWith,targetId) {
	return function(dispatch) {
		return api.shareAsset({assetId:id,shareWith:shareWith,targetId:targetId}).then(response => {
	    	if(response.status === 200){
	    		dispatch(shareAssetSuccess());
	    	} else {
	    		console.log("fail...");
	    		dispatch(shareAssetFailure());
	    	}
	    }).catch(error => {
	      	dispatch(shareAssetFailure());
	    });
	};
}

