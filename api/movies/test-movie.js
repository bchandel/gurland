let setupDb = require('../../config/database');
let config = require('../../config/config.json');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = require('chai').expect;
let movie = require('./movie');
let server = require('../../server');

let envConfig = config[config.env];
let db ;

chai.use(chaiHttp);

describe('Record Module', () => {

  describe("Test Movie service", () => {
		before((done) =>{
			let req = {
				dbPath:  envConfig.mongoURL + envConfig.dbName
			};
			setupDb.getDBConnection(req, {}, done);
			db = req.db;
		});
	
		it("getAllMovies() should return all movie records", () => {
			let movieService =  movie.movieService(db);
			
			return movieService.getAllMovies().then((record) => {
				record.forEach((data) => {
					expect(data).to.have.property("name");
					expect(data).to.have.property("description");
					expect(data).to.have.property("release_date");
					expect(data).to.have.property("geners");
					expect(data).to.have.property("duration");
					expect(data).to.have.property("rating");
				});
			});
		});
		
		it("should add movie", () => {
			let movieService =  movie.movieService(db);
			let payload = {
				"name" : "test123", 
				"description": "test movie",
				"release_date": "11-10-2021", 
				"genres": [{
					"name": "Comedy test"
				}], 
				"duration": "00:51:00",
				"rating": "3.4/5"
		   };
			return movieService.addMovie(payload).then((record) => {
				expect(record).to.have.property("_id");
				expect(record).to.have.property("name");
				expect(record).to.have.property("description");
				expect(record).to.have.property("release_date");
				expect(record).to.have.property("genres");
				expect(record).to.have.property("duration");
				expect(record).to.have.property("rating");
			});
		});

		it("should remove movie by name", () => {
			let movieService =  movie.movieService(db);
			let name =  "test123" ;
			return movieService.removeMovieByName(name).then((record) => {
				expect(record).to.have.property("n").equal(1);
				expect(record).to.have.property("ok");
				expect(record).to.have.property("deletedCount").equal(1);
			});
		});
	});

	describe('Test /api/movie/get-all-movies RESTAPI', () => {

		it('it should GET all the records', (done) => {
			
			chai.request(server)
			.get('/api/movie/get-all-movies')
			.send()
			.end((err, record) => {
				expect(record.body.success).to.be.equal(true);
				expect(record.body).to.have.property("data");
				expect(record.body).to.have.property("success");
				done();
			});
		});
	});

	describe('Test /api/movie/add-movie RESTAPI', () => {

		it('it should add gener', (done) => {
			let payload = {
				"name" : "test123", 
				"description": "test movie",
				"release_date": "11-10-2021", 
				"genres": [{
					"name": "Comedy test"
				}], 
				"duration": "00:51:00",
				"rating": "3.4/5"
		   	};
			chai.request(server)
			.post('/api/movie/add-movie')
			.send(payload)
			.end((err, record) => {
				expect(record.body).to.have.property("success");
				expect(record.body).to.have.property("data").to.be.a('object');
				expect(record.body.success).to.be.equal(true);
				done();
			});
		});

		
	});

	describe('Test /api/movie/remove-movie/:name RESTAPI', () => {

		it('it should remove gener by name', (done) => {
			let name = "test123"
			chai.request(server)
			.delete('/api/movie/remove-movie/'+name)
			.send()
			.end((err, record) => {
				expect(record.body).to.have.property("succes");
				expect(record.body).to.have.property("message");
				expect(record.body.succes).to.be.equal(true);
				expect(record.body.message).to.be.equal(`Movie deleted!`);
				done();
			});
		});

		
	});
});
