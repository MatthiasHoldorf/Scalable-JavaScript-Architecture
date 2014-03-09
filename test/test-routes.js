///////////////////
// set environment and disable tls rejection
process.env.NODE_ENV = "test";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

///////////////////
// module dependencies
var server  = require("../app"),
    should  = require("should"),
    request = require("supertest");

///////////////////
// act
describe("Routes -", function() {

    it('notAuthorized', function(done) {
        request.agent(server)
            .get('/notAuthorized')
            .expect('Content-Type', /html/)
            .expect(200)
            .expect(/Not authorized!/)
            .end(done);
    });

    it('notAuthorized redirection', function(done) {
        request.agent(server)
            .get('/no-valid-route')
            .expect('Content-Type', /plain/)
            .expect(302)
            .expect('Location', '/notAuthorized')
            .expect(/Moved Temporarily/)
            .end(done);
    });
});