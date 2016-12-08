'use strict';

var loopback = require('loopback');
var SetThroughProperties = require('../set-through-properties.js');
var expect  = require('chai').expect;
var request = require('supertest');
var app = loopback();

app.set('legacyExplorer', false);
app.set('remoting', {
  context: false,
  cors: false,
});
app.use(loopback.rest());

//WIP more tests
describe('SetThroughProperties', function() {
  var server;
  var User = null;
  var App = null;
  var UserRole = null;
  var db = null;

  /**
   * Create Data Source and Models
   **/
  db = app.dataSource('db', {adapter: 'memory'});

  User = app.model('user', {
    dataSource: 'db',
  });

  App = app.model('app', {
    dataSource: 'db',
  });

  UserRole = app.model('userRole', {
    type: String,
    description: String,
    dataSource: 'db',
  });

  User.hasMany(App, {through: UserRole, as: 'apps', foreignKey: 'userId'});
  App.hasMany(User, {through: UserRole, as: 'users', foreignKey: 'appId'});

  UserRole.belongsTo(User, {as: 'app', foreignKey: 'userId'});
  UserRole.belongsTo(App, {as: 'user', foreignKey: 'appId'});

  /**
   * Setup Mixin
   */
  SetThroughProperties(App, true);
  App.emit('attached');

  /**
   * Populate
   */

  App.create({});

  beforeEach(function(done) {
    server = app.listen(done);
  });

  afterEach(function(done) {
    server.close(done);
  });

  it('should set through model properties', function(done) {
    request(server).post('/apps/1/users')
      .send({userRole: {type: 'collaborator'}})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        UserRole.find('', function(err, roles) {
          if (err) return done(err);

          expect(JSON.stringify(roles)).to.equal(JSON.stringify([{
            id: 1,
            userId: 1,
            appId: 1,
            type: 'collaborator',
          }]));
          done();
        });
      });
  });
});
