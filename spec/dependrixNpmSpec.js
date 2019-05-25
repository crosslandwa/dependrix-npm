const DependrixNpm = require('..')

describe('dependrix-npm', () => {
  it('parses the name and version of the project described in each passed package-lock.json', done => {
    DependrixNpm([
      asFunctionThatReturnsPromise({ name: 'project-a', version: '1.0.0' }),
      asFunctionThatReturnsPromise({ name: 'project-b', version: '2.0.0' })
    ])
      .then(expectReturnedObjectToEqual({
        projects: {
          'project-a': {
            version: '1.0.0',
            dependencies: []
          },
          'project-b': {
            version: '2.0.0',
            dependencies: []
          }
        }
      }))
      .then(done, done.fail)
  })

  it('parses the name, version and each dependency, and whether it is a dev dependency or not', done => {
    DependrixNpm([
      asFunctionThatReturnsPromise({
        name: 'project-a',
        version: '1.0.0',
        dependencies: {
          'lib-a': { version: '3.0.0', dev: false },
          'lib-b': { version: '4.0.0', dev: true }
        }
      })
    ])
      .then(expectReturnedObjectToEqual({
        projects: {
          'project-a': {
            version: '1.0.0',
            dependencies: [
              {
                id: 'lib-a',
                version: '3.0.0',
                scope: ''
              },
              {
                id: 'lib-b',
                version: '4.0.0',
                scope: 'dev'
              }
            ]
          }
        }
      }))
      .then(done, done.fail)
  })

  it('parses nested dependencies', done => {
    DependrixNpm([
      asFunctionThatReturnsPromise({
        name: 'project-a',
        version: '1.0.0',
        dependencies: {
          'top-level-lib': {
            version: '3.0.0',
            dev: false,
            dependencies: {
              'nested-lib': { version: '4.0.0' }
            }
          }
        }
      })
    ])
      .then(expectReturnedObjectToEqual({
        projects: {
          'project-a': {
            version: '1.0.0',
            dependencies: [
              {
                id: 'top-level-lib',
                version: '3.0.0',
                scope: ''
              },
              {
                id: 'nested-lib',
                version: '4.0.0',
                scope: ''
              }
            ]
          }
        }
      }))
      .then(done, done.fail)
  })
})

function asFunctionThatReturnsPromise (content) {
  return () => Promise.resolve(JSON.stringify(content))
}

function expectReturnedObjectToEqual (expected) {
  return actual => expect(JSON.stringify(actual, null, 2)).toEqual(JSON.stringify(expected, null, 2))
}
