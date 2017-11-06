const chai = require('chai');  
const expect = require('chai').expect;
 
chai.use(require('chai-http'));
 
const app = require('../app.js');

describe('http tests when not authorized', function(){
	
	before(function() {
 
	});
	 
	after(function() {
	 
	});

	it('should give not authorized error when calling add asset api', function(){
		return chai.request(app)
  		.post('/api/add_asset')
  		.send({})
  		.then(function(res) {throw new Error('Failed');expect(res).to.have.status(401);
  		})
  		.catch(function(err){
        expect(err).to.have.status(401);
  		});
	});

});

describe('http tests when authorized', function(){

	var cookie = '';
  var createdGroupId;

	before(function() {
 		return chai.request(app)
  	  .post('/clear_db')
  		.then(function(res) {
  			
  		})
  		.catch(function(err){
  			throw new Error('Failed');
  		});
	});

  before(function() {
    return chai.request(app)
      .post('/api/signup')
      .send({
        first_name:"Ankit",
        last_name:"Bharadiya",
        email:"ankit@gmail.com",
        password:"ankit"
      })
      .then(function(res) {
        cookie = res.headers['set-cookie'][0].split(';')[0];
      })
      .catch(function(err){
        throw new Error('Failed');
      });
  });
	 
	after(function() {
	 
	});
	
	it('should be able to search users with search query', function(){
		return chai.request(app)
  		.get('/api/search_users?q=a')
  		.set('Cookie', cookie)
  		.then(function(res) {
  			expect(res).to.have.status(200);
  			expect(res.body.data).to.be.an('array');
  		})
  		.catch(function(err) {
        throw new Error('Failed');
      });
	});

	it('should give error when required fields are missing while updating user profile', function(){
		return chai.request(app)
  		.post('/api/user_profile')
      .send({
        first_name:"Ankit"
      })
  		.set('Cookie', cookie)
  		.then(function(res) {
  			throw new Error('Failed');
  		})
  		.catch(function(err) {
        expect(err).to.have.status(400);
      });
	});

	it('should be able to update user profile when required fields are provided', function(){
		return chai.request(app)
  		.post('/api/user_profile')
  		.send({
        first_name:"Ankit",
        last_name:"Bharadiya"
      })
  		.set('Cookie', cookie)
  		.then(function(res) {
  			expect(res).to.have.status(200);
  		})
  		.catch(function(err) {
        throw new Error('Failed');
	    });
	});

	it('should give error when required fields are missing while creating new group', function(){
		return chai.request(app)
  		.post('/api/create_group')
  		.send({})
  		.set('Cookie', cookie)
  		.then(function(res) {
  			throw new Error('Failed');
  		})
  		.catch(function(err) {
        expect(err).to.have.status(400);
      });
	});

  it('should be able to create new group when required fields are provided', function(){
    return chai.request(app)
      .post('/api/create_group')
      .send({
        name:"new_group"
      })
      .set('Cookie', cookie)
      .then(function(res) {
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        throw new Error('Failed');
      });
  });

  it('should be able to get all the assets owned by the logged in user', function(){
    return chai.request(app)
      .get('/api/get_groups')
      .set('Cookie', cookie)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        createdGroupId = res.body.data[0]._id;
      })
      .catch(function(err) {
        throw new Error('Failed');
      });
  });

  it('should be able to get group created in last step', function(){
    return chai.request(app)
      .get('/api/get_group_by_id?id='+createdGroupId)
      .set('Cookie', cookie)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('object');
      })
      .catch(function(err) {
        throw new Error('Failed');
      });
  });

  it('should give error when required fields are missing while adding new folder', function(){
    return chai.request(app)
      .post('/api/add_asset')
      .send({
        isDirectory:"true"
      })
      .set('Cookie', cookie)
      .then(function(res) {
        throw new Error('Failed');
      })
      .catch(function(err) {
        expect(err).to.have.status(400);
      });
  });

  it('should be able to add new folder when required fields are provided', function(){
    return chai.request(app)
      .post('/api/add_asset')
      .send({
        isDirectory:"true",
        name:"New_folder"
      })
      .set('Cookie', cookie)
      .then(function(res) {
        expect(res).to.have.status(200);
      })
      .catch(function(err) {
        throw new Error('Failed');
      });
  });

});