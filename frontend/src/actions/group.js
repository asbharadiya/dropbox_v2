import * as api from '../api/group';

function addGroupSuccess() {
  	return {type: "ADD_GROUP_SUCCESS"}
}

function addGroupFailure(){
    return {type: "ADD_GROUP_FAILURE"}
}

export function createGroup(name) {
	return function(dispatch) {
		return api.createGroup({name:name}).then(response => {
	    	if(response.status === 200){
	    		dispatch(addGroupSuccess());
	    	} else {
	    		dispatch(addGroupFailure());
	    	}
	    }).catch(error => {
	      	dispatch(addGroupFailure());
	    });
	};
}

function updateGroupSuccess() {
  	return {type: "UPDATE_GROUP_SUCCESS"}
}

function updateGroupFailure(){
    return {type: "UPDATE_GROUP_FAILURE"}
}

export function updateGroup(name,id) {
	return function(dispatch) {
		return api.updateGroup({name:name,groupId:id}).then(response => {
	    	if(response.status === 200){
	    		dispatch(updateGroupSuccess());
	    	} else {
	    		dispatch(updateGroupFailure());
	    	}
	    }).catch(error => {
	      	dispatch(updateGroupFailure());
	    });
	};
}

function deleteGroupSuccess() {
  	return {type: "DELETE_GROUP_SUCCESS"}
}

function deleteGroupFailure(){
    return {type: "DELETE_GROUP_FAILURE"}
}

export function deleteGroup(id) {
	return function(dispatch) {
		return api.deleteGroup({groupId:id}).then(response => {
	    	if(response.status === 200){
	    		dispatch(deleteGroupSuccess());
	    	} else {
	    		dispatch(deleteGroupFailure());
	    	}
	    }).catch(error => {
	      	dispatch(deleteGroupFailure());
	    });
	};
}

function getGroupsSuccess(data) {
  	return {type: "GET_GROUPS_SUCCESS",data}
}

function getGorupsFailure(){
    return {type: "GET_GROUPS_FAILURE"}
}

export function getGroups() {
	return function(dispatch) {
		return api.getGroups().then(response => {
	    	if(response.status === 200){
	    		dispatch(getGroupsSuccess(response.data));
	    	} else {
	    		dispatch(getGorupsFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getGorupsFailure());
	    });
	};
}

function getGroupByIdSuccess(data) {
  	return {type: "GET_GROUP_BY_ID_SUCCESS",data}
}

function getGorupByIdFailure(){
    return {type: "GET_GROUP_BY_ID_FAILURE"}
}

export function getGroupById(id) {
	return function(dispatch) {
		return api.getGroupById(id).then(response => {
	    	if(response.status === 200){
	    		dispatch(getGroupByIdSuccess(response.data));
	    	} else {
	    		dispatch(getGorupByIdFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getGorupByIdFailure());
	    });
	};
}

function addRemoveMemberSuccess() {
  	return {type: "ADD_REMOVE_MEMBER_SUCCESS"}
}

function addRemoveMemberFailure(){
    return {type: "ADD_REMOVE_MEMBER_FAILURE"}
}

export function addRemoveMemberGroup(groupId,memberId,action) {
	return function(dispatch) {
		return api.addRemoveMemberGroup({groupId:groupId,memberId:memberId,action:action}).then(response => {
	    	if(response.status === 200){
	    		dispatch(addRemoveMemberSuccess());
	    	} else {
	    		dispatch(addRemoveMemberFailure());
	    	}
	    }).catch(error => {
	      	dispatch(addRemoveMemberFailure());
	    });
	};
}
