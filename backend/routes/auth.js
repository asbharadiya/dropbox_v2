var kafka = require('./kafka/client');

module.exports = function(passport) {
	var module = {};

	module.signin = function(req,res){
		passport.authenticate('local-signin', function(err,result) {
	        if(err) {
	            return res.status(500).send();
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).send(result.message);
	    })(req, res);
	}

	module.signup = function(req,res){
		passport.authenticate('local-signup', function(err,result) {
			if(err) {
	            return res.status(500).send();
	        }
	        if(result.code === 200) {
	        	req.session.passport = {user: result.data};
	        }
	        return res.status(result.code).send(result.message);
	    })(req, res);
	}

	module.checkSession = function(req,res){
		res.status(200).send({status:200,data:{uname:req.user.uname}});
	}

	module.logout = function(req,res){
		req.session.destroy();
    	res.status(200).send('Success');
	}

	return module;
}