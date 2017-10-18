const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const updateUserProfile = (payload) =>
	fetch(api+'/api/user_profile', {
	    method: 'POST',
        credentials: 'include',
        headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    });

export const getUserProfile = () =>
	fetch(api+'/api/user_profile', {
	    method: 'GET',
        headers: {
	    	...headers
        },
        credentials: 'include'
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    }); 

export const getUserActivity = () =>
    fetch(api+'/api/user_activity', {
        method: 'GET',
        headers: {
            ...headers
        },
        credentials: 'include'
    }).then(res => {
        return res.json();
    }).catch(error => {
        return error;
    }); 
