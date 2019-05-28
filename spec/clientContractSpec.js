const DependrixNpm = require('..')
const { validateModel } = require('dependrix-visualisation')

describe('dependrix-npm', () => {
  it('generates output that meets requirements of dependrix-visualisation schema', done => {
    DependrixNpm([
      asFunctionThatReturnsPromise({
        name: 'project-a',
        version: '1.0.0',
        dependencies: {
          'lib-a': {
            version: '1.0.0',
            dependencies: {
              'lib-b': { version: '1.0.0' }
            }
          },
          'lib-b': {
            version: '2.0.0',
            dependencies: {
              'lib-a': { version: '1.0.0' }
            }
          }
        }
      }),
      asFunctionThatReturnsPromise({ name: 'project-b', version: '2.0.0' })
    ])
      .then(validateModel)
      .then(done, done.fail)
  })
})

function asFunctionThatReturnsPromise (content) {
  return () => Promise.resolve(JSON.stringify(content))
}
