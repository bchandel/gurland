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
		
		it("should add gener", () => {
			let generService =  gener.generService(db);
			let payload = {
				"name" : "generr",
				"description": "gener"
			};
			return generService.addGener(payload).then((record) => {
				expect(record).to.have.property("_id");
				expect(record).to.have.property("name");
				expect(record).to.have.property("description");
			});
		});

		it("should remove gener by name", () => {
			let generService =  gener.generService(db);
			let name =  "generr" ;
			return generService.removeGenerByName(name).then((record) => {
				expect(record).to.have.property("n").equal(1);
				expect(record).to.have.property("ok");
				expect(record).to.have.property("deletedCount").equal(1);
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

	describe('Test /api/geners/add-gener RESTAPI', () => {

		it('it should add gener', (done) => {
			let payload = {
				"name" : "generr",
				"description": "gener"
			}
			chai.request(server)
			.post('/api/geners/add-gener')
			.send(payload)
			.end((err, record) => {
				expect(record.body).to.have.property("success");
				expect(record.body).to.have.property("data").to.be.a('object');
				expect(record.body.success).to.be.equal(true);
				done();
			});
		});

		
	});

	describe('Test /api/geners/remove-gener/:name RESTAPI', () => {

		it('it should remove gener by name', (done) => {
			let name = "generr"
			chai.request(server)
			.delete('/api/geners/remove-gener/'+name)
			.send()
			.end((err, record) => {
				expect(record.body).to.have.property("succes");
				expect(record.body).to.have.property("message");
				expect(record.body.succes).to.be.equal(true);
				expect(record.body.message).to.be.equal(`${name} Gener deleted!`);
				done();
			});
		});

		
	});
});
