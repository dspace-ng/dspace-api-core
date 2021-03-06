var Player = require('../models/player');
var LocalPlayer = require('../models/localPlayer');
var RemotePlayer = require('../models/remotePlayer');

var Track = require('../collections/track');
var Story = require('../collections/story');

describe('Player', function(){

  var uuid = 'd05f6115-676e-445c-8242-fa319df4a897';

  describe('initialize', function(){

    var player = new Player({ uuid: uuid });

    it('should use uuid attribute as id', function(){
      expect(player.id).to.equal(uuid);
    });

    it('should set @type to *person*', function(){
      expect(player.get('@type')).to.equal('person');
    });

    it('should throw error if no uuid');

    it('should create track', function(){
      expect(player.track).to.be.an.instanceOf(Track);
    });

    it('should create story', function(){
      expect(player.story).to.be.an.instanceOf(Story);
    });


  });

  //FIXME for now we test with LocalPlayer, soon same API for RemotePlayer
  describe('geolocation', function(){

    player = new LocalPlayer();

    it('should subscribe to *position* event with _newPosition'); // ???

  });

  describe('geo', function(){

    beforeEach(function(){
      player = new Player({ uuid: uuid }, { store: {} });
    });

    var firstPosition = { coords: { latitude: 47, longitude: 15}, timestamp: 1381855568774 };
    var secondPosition = { coords: { latitude: 55, longitude: 22}, timestamp: 1381855569774 };
    var thirdPosition = { coords: { latitude: 52, longitude: 28}, timestamp: 1381855572774  };

    describe('currentPosition', function(){

      it('should return *undefined* if track empty', function(){
        expect(player.track.length).to.equal(0);
        expect(player.currentPosition()).to.be.undefined;
      });

      it('should return last position on track', function(){
        player.track.add(firstPosition);
        player.track.add(secondPosition);
        expect(player.currentPosition().toJSON()).to.deep.equal(secondPosition);
      });
    });

    describe('_newPosition', function(){


      it('should add it to track', function(){
        player.track.reset();
        player.track.add(firstPosition);

        player._newPosition(secondPosition);
        expect(player.track.length).to.equal(2);
        player._newPosition(thirdPosition);
        expect(player.track.length).to.equal(3);
      });

      it('should trigger *change:position* for first position', function(done){
        player.track.reset();
        player.on('change:position', function(position){
          expect(position.coords).to.be.an('object');
          done();
        });
        player._newPosition(firstPosition);
      });

      it('should trigger *change:position* for next position', function(done){
        player.track.reset();
        player.track.add(firstPosition);
        player.on('change:position', function(position){
          expect(position.coords).to.be.an('object');
          done();
        });
        player._newPosition(secondPosition);
      });
    });
  });
});


describe('LocalPlayer', function(){

  describe('uuid', function(){

    beforeEach(function(){
      player = new LocalPlayer({ channels: { track: {} } },{ dspace: {}});
      localStorage.clear();
    });

    it('if finds uuid saved in localStorage should use it', function(){
      var uuid = '4a4674b2-3b30-44f0-bbdc-fd2efc64237b';
      localStorage.uuid = uuid;
      var player = new LocalPlayer();
      expect(player.get('uuid')).to.equal(uuid);
    });

    it('if no uuid saved in localStorage should generate on and save it to localStorage', function(){
      var player = new LocalPlayer();
      expect(player.get('uuid')).to.exist;
      expect(localStorage.uuid).to.equal(player.get('uuid'));
    });

    it('should initialize geolocation', function(){
      var player = new LocalPlayer();
      expect(player.geolocation).to.be.an('object');
    });

    it('should call superclass passing attrs and options', function(){
      sinon.spy(Player.prototype, 'initialize');
      var attrs = { foo: 'bar' };
      var options = { beep: 'boop' };
      var player = new LocalPlayer(attrs, options);
      expect(Player.prototype.initialize).calledWith(attrs, options);
      Player.prototype.initialize.restore();
    });

    it('should setup channel for publishing position');
    it('should publish changes to the position');
  });
});


describe('RemotePlayer', function(){

  //beforeEach(function(){
    //this.uuid = 'd05f6115-676e-445c-8242-fa319df4a897';
    //this.attrs = { uuid: this.uuid, channels: { track: {}} };
    //this.options = { dspace: {} };
    //this.fakeChan = { on: function(){} };
    //this.options.dspace.getGeolocationChannel = sinon.stub.returns(this.fakeChan);
  //});

  //describe('initialize', function(){
    //it('should call superclass passing attrs and options', function(){
      //sinon.spy(Player.prototype, 'initialize');
      //var player = new RemotePlayer(this.attrs, this.options);
      //expect(Player.prototype.initialize).calledWith(this.attrs, this.options);
      //Player.prototype.initialize.restore();
    //});

    //it('should set geolocation', function(){
      //var player = new RemotePlayer(this.attrs, this.options);
      //expect(player.geolocation).to.exist;

    //});
  //});

});
