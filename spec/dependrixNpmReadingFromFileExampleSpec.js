const DependrixNpm = require('..')
const fs = require('fs')

describe('dependrix-npm', () => {
  it('analyses a npm package-lock.json file read in by a client', done => {
    DependrixNpm([
      () => new Promise((resolve, reject) => fs.readFile(
        `${__dirname}/example-package-lock.json`,
        (err, data) => err ? reject(err) : resolve(data.toString('utf-8'))
      ))
    ])
      .then(expectReturnedObjectToEqual({
        projects: {
          'dependrix-npm': {
            version: '1.0.0',
            dependencies: [
              {
                id: '@babel/code-frame',
                version: '7.0.0',
                scope: 'dev'
              },
              {
                id: 'eslint-import-resolver-node',
                version: '0.3.2',
                scope: 'dev'
              },
              {
                id: 'debug',
                version: '2.6.9',
                scope: 'dev'
              },
              {
                id: 'ms',
                version: '2.0.0',
                scope: 'dev'
              }
            ]
          }
        }
      }))
      .then(done, done.fail)
  })
})

function expectReturnedObjectToEqual (expected) {
  return actual => expect(JSON.stringify(actual, null, 2)).toEqual(JSON.stringify(expected, null, 2))
}
