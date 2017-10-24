var kafka = require('./kafka/client');

module.exports = function(passport) {
	var module = {};

	module.signin = function(req,res){
		passport.authenticate('local-signin', function(err,user) {
	        if(err) {
	            return res.status(500).send();
	        }
	        if(!user) {
	            return res.status(401).send();
	        }
	        req.session.passport = {user: user};
	        return res.status(200).send();
	    })(req, res);
	}

	module.signup = function(req,res){
		passport.authenticate('local-signup', function(err,user) {
			if(err) {
	            return res.status(500).send();
	        }
	        if(!user) {
	        	return res.status(400).send();
	        }
	        req.session.passport = {user: user};
	        return res.status(200).send();
	    })(req, res);
	}

	module.checkSession = function(req,res){
		res.status(200).send({status:200,data:{uname:req.user.uname}});
	}

	module.logout = function(req,res){
		req.session.destroy();
    	res.status(200).send();
	}

	return module;
}