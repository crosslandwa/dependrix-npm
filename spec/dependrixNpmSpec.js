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
})

function asFunctionThatReturnsPromise (content) {
  return () => Promise.resolve(JSON.stringify(content))
}

function expectReturnedObjectToEqual (expected) {
  return actual => expect(JSON.stringify(actual, null, 2)).toEqual(JSON.stringify(expected, null, 2))
}
