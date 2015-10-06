describe('relativeDay filter', function() {

  'use strict';

  var compile,
      scope,
      datetime = sinon.stub(),
      relative = sinon.stub();

  beforeEach(function() {
    module('inboxApp');
    module(function ($provide) {
      $provide.value('FormatDate', {
        datetime: datetime,
        relative: relative
      });
    });
    inject(function(_$compile_, _$rootScope_) {
      compile = _$compile_;
      scope = _$rootScope_.$new();
    });
  });

  afterEach(function() {
    KarmaUtils.restore(datetime, relative);
  });

  it('should render nothing when no date', function() {
    scope.date = undefined;
    var element = compile('<div ng-bind-html="date | relativeDay"></div>')(scope);
    scope.$digest();
    chai.expect(element.html()).to.equal('<span></span>');
  });

  it('should render date', function() {
    datetime.returns('1st Jan 2020');
    relative.returns('in 5 days');
    scope.date = moment().add(5, 'days').valueOf();
    var element = compile('<div ng-bind-html="date | relativeDay"></div>')(scope);
    scope.$digest();
    chai.expect(element.find('span').attr('title')).to.equal('1st Jan 2020');
    chai.expect(element.text()).to.equal('in 5 days');
  });

  it('should render "today"', function() {
    datetime.returns('1st Jan 2020');
    scope.date = moment().valueOf();
    var element = compile('<div ng-bind-html="date | relativeDay"></div>')(scope);
    scope.$digest();
    chai.expect(element.find('span').attr('title')).to.equal('1st Jan 2020');
    chai.expect(element.text()).to.equal('today');
  });

});
