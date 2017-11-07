var multer = require('multer');

var upload = multer({storage: multer.memoryStorage()});

module.exports = function(router,passport) {

	var auth = require('./auth')(passport);
	var user = require('./user');
	var group = require('./group');
	var asset = require('./asset');

	router.post('/api/signin', auth.signin);
	router.post('/api/signup', auth.signup);
	router.post('/api/logout', auth.logout);
	router.get('/api/check_session', isAuthenticated, auth.checkSession);

	router.get('/api/user_profile', isAuthenticated, user.getUserProfile);
	router.get('/api/user_profile_without_pooling', isAuthenticated, user.getUserProfileWithoutPooling);
	router.get('/api/user_profile_with_db_pooling', isAuthenticated, user.getUserProfileWithDbPooling);
	router.get('/api/user_profile_without_kafka', isAuthenticated, user.getUserProfileWithoutKafka);
	router.post('/api/user_profile', isAuthenticated, user.updateUserProfile);
	router.get('/api/user_activity', isAuthenticated, user.getUserActivity);
	router.get('/api/search_users', isAuthenticated, user.searchUsers);

	router.post('/api/create_group', isAuthenticated, group.createGroup);
	router.post('/api/update_group', isAuthenticated, group.updateGroup);
	router.post('/api/add_remove_member_group', isAuthenticated, group.addRemoveMemberGroup);
	router.post('/api/delete_group', isAuthenticated, group.deleteGroup);
	router.get('/api/get_group_by_id', isAuthenticated, group.getGroupById);
	router.get('/api/get_groups', isAuthenticated, group.getGroups);
	router.get('/api/search_groups', isAuthenticated, group.searchGroups);

	router.post('/api/add_asset', isAuthenticated, upload.single('file'), asset.addAsset);
	router.post('/api/get_assets',asset.getAssets);
	router.post('/api/delete_asset',asset.deleteAsset);
	router.post('/api/star_asset',asset.addOrRemoveStarredAsset);
	router.post('/api/share_asset',asset.shareAsset);
	router.get('/api/download_asset/:assetId/:superParent?',asset.downloadAsset);
	
	function isAuthenticated(req, res, next) {
		if(req.session.passport && req.session.passport.user._id) {
			next();
	  	} else {
	  		console.log(req.session);
			res.status(401).send();
		}
	}

}