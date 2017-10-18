const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const createGroup = (payload) =>
	fetch(api+'/api/create_group', {
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

export const updateGroup = (payload) =>
	fetch(api+'/api/update_group', {
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

export const addRemoveMemberGroup = (payload) =>
	fetch(api+'/api/add_remove_member_group', {
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


export const deleteGroup = (payload) =>
	fetch(api+'/api/delete_group', {
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

export const getGroupById = (id) =>
	fetch(api+'/api/get_group_by_id?id='+id, {
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

export const getGroups = () =>
	fetch(api+'/api/get_groups', {
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

export const searchGroup = (query) =>
	fetch(api+'/api/search_groups?q='+query, {
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

export const searchUsers = (query) =>
	fetch(api+'/api/search_users?q='+query, {
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
