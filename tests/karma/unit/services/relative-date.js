describe('RelativeDate Service', () => {
  'use strict';

  let service;
  let formatDateRelativeDay = sinon.stub(),
    formatDateRelativeTime = sinon.stub(),
    formatDateAge = sinon.stub();

  const resetStubs = () => {
    formatDateAge.reset();
    formatDateAge.returns('someage');

    formatDateRelativeDay.reset();
    formatDateRelativeDay.returns('somerelativeday');

    formatDateRelativeTime.reset();
    formatDateRelativeTime.returns('somerelativetime');
  };

  const TEST_DATE = 2398472085558;

  beforeEach(() => {
    module('inboxApp');
    module($provide => {
      $provide.value('FormatDate', {
        relative: function(timestamp, options) {
          if (options.withoutTime) {
            return formatDateRelativeDay();
          }
          return formatDateRelativeTime();
        },
        age: formatDateAge
      });
    });
    inject((_RelativeDate_) => {
      service = _RelativeDate_;
    });
    resetStubs();
  });

  afterEach(() => {
    let elements = document.querySelectorAll('.update-relative-date');
    elements.forEach(element => {
      element.remove();
    });
  });

  it('returns correct CSS selector', done => {
    let actual = service.getCssSelector();
    chai.expect(actual).to.equal('update-relative-date');
    done();
  });

  it('generates correct dataset', done => {
    let options = {
      RelativeDate: service,
      FormatDate: { someObject: 'somevalue' },
      prefix: 'prefix',
      suffix: 'suffix',
      camelCase: 123456,
      text: 'string',
      undef: undefined,
      isFalse: false,
      isNull: null,
      obj: { someProperty: 'somevalue' }
    };

    let actual = service.generateDataset(TEST_DATE, options);
    chai.expect(actual).to.equal('data-date="2398472085558" data-camel-case="123456" data-text="string"');
    done();
  });

  it('does nothing with no elements are present', done => {
    service.updateRelativeDates();
    chai.expect(formatDateRelativeTime.callCount).to.equal(0);
    chai.expect(formatDateAge.callCount).to.equal(0);
    done();
  });

  it('does not update relative date when no date is present, date is undefined or incorrect', done => {
    let spanNoDate = document.createElement('span');
    spanNoDate.appendChild(document.createTextNode('sometext'));
    spanNoDate.setAttribute('id', 'spanNoDate');
    spanNoDate.className += 'update-relative-date';
    document.body.appendChild(spanNoDate);

    let spanUndefDate = document.createElement('span');
    spanUndefDate.appendChild(document.createTextNode('sometext'));
    spanUndefDate.setAttribute('id', 'spanUndefDate');
    spanUndefDate.setAttribute('data-date', '');
    spanUndefDate.className += 'update-relative-date';
    document.body.appendChild(spanUndefDate);

    let spanBadDate = document.createElement('span');
    spanBadDate.appendChild(document.createTextNode('sometext'));
    spanBadDate.setAttribute('id', 'spanBadDate');
    spanBadDate.setAttribute('data-date', 'alpha');
    spanBadDate.className += 'update-relative-date';
    document.body.appendChild(spanBadDate);

    service.updateRelativeDates();

    chai.expect(document.getElementById('spanNoDate').innerHTML).to.equal('sometext');
    chai.expect(document.getElementById('spanUndefDate').innerHTML).to.equal('sometext');
    chai.expect(document.getElementById('spanBadDate').innerHTML).to.equal('sometext');

    chai.expect(formatDateRelativeTime.callCount).to.equal(0);
    chai.expect(formatDateAge.callCount).to.equal(0);
    done();
  });

  it('processes age option correctly', done => {
    let spanAge = document.createElement('span');
    spanAge.appendChild(document.createTextNode('sometext'));
    spanAge.setAttribute('id', 'spanAge');
    spanAge.setAttribute('data-date', '123456789');
    spanAge.setAttribute('data-age', 'true');
    spanAge.className += 'update-relative-date';
    document.body.appendChild(spanAge);

    let spanNoAge = document.createElement('span');
    spanNoAge.appendChild(document.createTextNode('sometext'));
    spanNoAge.setAttribute('id', 'spanNoAge');
    spanNoAge.setAttribute('data-date', '123456789');
    spanNoAge.className += 'update-relative-date';
    document.body.appendChild(spanNoAge);

    service.updateRelativeDates();

    chai.expect(document.getElementById('spanAge').innerHTML).to.equal('someage');
    chai.expect(document.getElementById('spanNoAge').innerHTML).to.equal('somerelativetime');

    chai.expect(formatDateRelativeTime.callCount).to.equal(1);
    chai.expect(formatDateAge.callCount).to.equal(1);

    done();
  });

  it('processes withoutTime option correctly', done => {
    let spanWithoutTime = document.createElement('span');
    spanWithoutTime.setAttribute('id', 'spanWithoutTime');
    spanWithoutTime.setAttribute('data-date', '123456789');
    spanWithoutTime.setAttribute('data-without-time', 'true');
    spanWithoutTime.className += 'update-relative-date';
    document.body.appendChild(spanWithoutTime);

    let spanNoWithoutTime = document.createElement('span');
    spanNoWithoutTime.setAttribute('id', 'spanNoWithoutTime');
    spanNoWithoutTime.setAttribute('data-date', '123456789');
    spanNoWithoutTime.className += 'update-relative-date';
    document.body.appendChild(spanNoWithoutTime);

    service.updateRelativeDates();
    chai.expect(document.getElementById('spanWithoutTime').innerHTML).to.equal('somerelativeday');
    chai.expect(document.getElementById('spanNoWithoutTime').innerHTML).to.equal('somerelativetime');

    chai.expect(formatDateRelativeTime.callCount).to.equal(1);
    chai.expect(formatDateRelativeDay.callCount).to.equal(1);

    done();
  });
});