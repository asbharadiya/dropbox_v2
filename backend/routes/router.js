

module.exports = function(router,passport) {

	var auth = require('./auth')(passport);

	router.post('/api/signin', auth.signin);
	router.post('/api/signup', auth.signup);
	router.post('/api/logout', auth.logout);
	router.get('/api/check_session', isAuthenticated, auth.checkSession);

	router.get('/api/user_profile', isAuthenticated, auth.userProfile);
	
	function isAuthenticated(req, res, next) {
		if(req.isAuthenticated()) {
	    	next();
	  	} else {
			res.status(401).send();
		}
	}

}