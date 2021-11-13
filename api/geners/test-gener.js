let setupDb = require('../../config/database');
let config = require('../../config/config.json');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = require('chai').expect;
let gener = require('./gener');
let server = require('../../server');

let envConfig = config[config.env];
let db ;

chai.use(chaiHttp);

describe('Gener Module', () => {

  describe("Test Gener service", () => {
		before((done) =>{
			let req = {
				dbPath:  envConfig.mongoURL + envConfig.dbName
			};
			setupDb.getDBConnection(req, {}, done);
			db = req.db;
		});
	
		it("should return all geners", () => {
			let generService =  gener.generService(db);

			return generService.getAllGeners().then((record) => {
				record.forEach((data) => {
					expect(data).to.have.property("name");
					expect(data).to.have.property("description");
				});
			});
		});
		
	});

	describe('Test /api/geners/get-all-geners RESTAPI', () => {

		it('it should GET all the records', (done) => {
			
			chai.request(server)
			.get('/api/geners/get-all-geners')
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
