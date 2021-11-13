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
});
