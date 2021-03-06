const test = require('tap').test;
const Filters = require('../../lib/filters');

const jsonBuffer = (body) => Buffer.from(JSON.stringify(body));

test('filter on body', t => {
  const filter = Filters(require(__dirname + '/../fixtures/relay.json'));

  t.plan(8);
  t.ok('filters loaded');

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: [
        {
          modified: ['package.json', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res, '/', 'allows the path request');
  });

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: [
        {
          modified: ['file2.txt']
        },
        {
          modified: ['.snyk', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error, null, 'no error');
    t.equal(res, '/', 'allows the path request');
  });

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: [
        {
          modified: ['file2.txt']
        },
        {
          modified: ['file3.txt', 'file1.txt']
        }
      ]
    })
  }, (error, res) => {
    t.equal(error.message, 'blocked', 'has been blocked');
    t.equal(res, undefined, 'no follow allowed');
  });

  filter({
    url: '/',
    method: 'POST',
    body: jsonBuffer({
      commits: []
    })
  }, error => {
    t.equal(error.message, 'blocked', 'has been blocked');
  });

});
