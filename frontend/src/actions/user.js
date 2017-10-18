import * as api from '../api/user';

function updateUserProfileSuccess() {
  	return {type: "UPDATE_USER_PROFILE_SUCCESS"}
}

function updateUserProfileFailure(){
    return {type: "UPDATE_USER_PROFILE_FAILURE"}
}

export function updateUserProfile(payload) {
	return function(dispatch) {
		return api.updateUserProfile(payload).then(response => {
	    	if(response.status === 200){
	    		dispatch(updateUserProfileSuccess());
	    	} else {
	    		dispatch(updateUserProfileFailure());
	    	}
	    }).catch(error => {
	      	dispatch(updateUserProfileFailure());
	    });
	};
}

function getUserProfileSuccess(data) {
  	return {type: "GET_USER_PROFILE_SUCCESS",data}
}

function getUserProfileFailure(){
    return {type: "GET_USER_PROFILE_FAILURE"}
}

export function getUserProfile() {
	return function(dispatch) {
		return api.getUserProfile().then(response => {
	    	if(response.status === 200){
	    		dispatch(getUserProfileSuccess(response.data));
	    	} else {
	    		dispatch(getUserProfileFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getUserProfileFailure());
	    });
	};
}

function getUserActivitySuccess(data) {
  	return {type: "GET_USER_ACTIVITY_SUCCESS",data}
}

function getUserActivityFailure(){
    return {type: "GET_USER_ACTIVITY_FAILURE"}
}

export function getUserActivity() {
	return function(dispatch) {
		return api.getUserActivity().then(response => {
	    	if(response.status === 200){
	    		dispatch(getUserActivitySuccess(response.data));
	    	} else {
	    		dispatch(getUserActivityFailure());
	    	}
	    }).catch(error => {
	      	dispatch(getUserActivityFailure());
	    });
	};
}