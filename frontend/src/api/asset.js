const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001'

const headers = {
    'Accept': 'application/json'
};

export const addAsset = (formData) =>
	fetch(api+'/api/add_asset', {
	    method: 'POST',
        credentials: 'include',
        body: formData
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    }); 

export const getAssets = (payload) =>
	fetch(api+'/api/get_assets', {
	    method: 'POST',
        headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    }); 

export const deleteAsset = (payload) =>
	fetch(api+'/api/delete_asset', {
	    method: 'POST',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    }); 

export const starAsset = (payload) =>
	fetch(api+'/api/star_asset', {
	    method: 'POST',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    }); 

export const shareAsset = (payload) =>
	fetch(api+'/api/share_asset', {
	    method: 'POST',
	    headers: {
	    	...headers,
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
	}).then(res => {
		return res.json();
	}).catch(error => {
        return error;
    }); 