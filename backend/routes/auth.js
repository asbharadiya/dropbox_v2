var mongo = require("./mongo");

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
		passport.authenticate('local-signup', function(err,user, info) {
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
		res.status(200).send({status:200,data:{uname:req.user.first_name+" "+req.user.last_name}});
	}

	module.logout = function(req,res){
		req.session.destroy();
    	res.status(200).send();
	}

	module.userProfile = function(req,res){
		res.status(200).send({status:200,data:{first_name:req.user.first_name,last_name:req.user.last_name,email:req.user.email,date_of_birth:req.user.date_of_birth}});
	}

	return module;
}