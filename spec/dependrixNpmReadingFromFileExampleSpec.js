const DependrixNpm = require('..')
const fs = require('fs')

describe('dependrix-npm', () => {
  it('analyses a npm package-lock.json file read in by a client', done => {
    DependrixNpm([
      () => new Promise((resolve, reject) => fs.readFile(
        `${__dirname}/../package-lock.json`,
        (err, data) => err ? reject(err) : resolve(data.toString('utf-8'))
      ))
    ])
      .then(expectReturnedObjectToEqual({
        projects: {
          'dependrix-npm': {
            version: '1.0.0',
            dependencies: []
          }
        }
      }))
      .then(done, done.fail)
  })
})

function expectReturnedObjectToEqual (expected) {
  return actual => expect(JSON.stringify(actual, null, 2)).toEqual(JSON.stringify(expected, null, 2))
}
