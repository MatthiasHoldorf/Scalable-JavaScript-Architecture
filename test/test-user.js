///////////////////
// set environment
process.env.NODE_ENV = "test";

///////////////////
// module dependencies
var server  = require("../app"),
    should  = require("should"),
    model   = require("../app/model");

///////////////////
// setup
var testUserOne = new model.UserModel({
        _id: 1,
        first_name: "Rainer",
        last_name: "Zufall",
        email: "rainer.zufall@mail.com"
    }),

    testUserTwo = new model.UserModel({
        _id: 2,
        first_name: "Max",
        last_name: "Mustermann",
        email: "max.mustermann@mail.com"
    }),

    // Saving the same user document (testUserOne) twice, would result in an update.
    // Therefore, a second user document with the same _id is necessary.
    duplicateUser = new model.UserModel({
        _id: 1,
        first_name: "Rainer",
        last_name: "Zufall",
        email: "rainer.zufall@mail.com"
    });

///////////////////
// act
describe("User Collection -", function() {
    before(function(done) {
        // clear database
        model.UserModel.collection.remove(done);
    });

    it("should save user", function(done) {
        testUserOne.save(function(error, user) {
            should.not.exist(error);
            user.should.have.property("first_name", "Rainer");
            done();
        });
    });

    it("should save additional user", function(done) {
        testUserTwo.save(function(error, user) {
            should.not.exist(error);
            user.should.have.property("first_name", "Max");
            model.UserModel.count(function(error, count){
                count.should.equal(2);
                done();
            });
        });
    });

    it("should not save user with duplicate id", function(done) {
        duplicateUser.save(function(error) {
            error.should.have.property("code", 11000);
            done();
        });
    });

    it("#getUser() should find user with id 1", function(done) {
        model.UserModel.getUser(1, function(user) {
            should.exist(user);
            done();
        });
    });

    it("#getUser() should not find user with id 3", function(done) {
        model.UserModel.getUser(3, function(user) {
            should.not.exist(user);
            done();
        });
    });

    it("#getUsers() should find 2 user in database", function(done) {
        model.UserModel.getUsers(function(user) {
            user.length.should.equal(2);
            done();
        });
    });

    it("should update user", function(done) {
        testUserOne.last_name = "Updated";

        testUserOne.save(function(error, user) {
            should.not.exist(error);
            user.should.have.property("last_name", "Updated");
            done();
        });
    });

    it("should delete user", function(done) {
        model.UserModel.find({"_id:" :  2}).remove(function(error) {
            should.not.exist(error);
            done();
        });
    });

    it("should delete all user", function(done) {
        model.UserModel.find({}).remove(function(error) {
            should.not.exist(error);

            model.UserModel.count(function(error, count) {
                should.not.exist(error);
                count.should.equal(0);
                done();
            });
        });
    });

    after(function(done) {
        // clear database
        model.UserModel.collection.remove(done);
    });
});