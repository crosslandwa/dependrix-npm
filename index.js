/**
 * Takes an array of functions.
 * Each returns a promise that resolves to the string content of a package-lock.json file
 */
function DependrixNpm (providers) {
  return Promise.all(providers.map(provider => provider().then(JSON.parse)))
    .then(parsed => parsed.reduce((acc, packageLock) => ({
      projects: Object.assign(
        {},
        acc.projects,
        {
          [packageLock.name]: {
            version: packageLock.version,
            dependencies: flattenDependencies(packageLock.dependencies || {})
          }
        }
      )
    }), { projects: {} }))
}

function flattenDependencies (dependencies, found = {}) {
  const flat = []

  Object.keys(dependencies).forEach(dependencyId => {
    const dependency = dependencies[dependencyId]
    const key = `${dependencyId}-${dependency.version}`
    if (!found[key]) {
      found[key] = true
      flat.push(model(dependencyId, dependency))
    }
    if (dependency.dependencies) {
      flat.push(...flattenDependencies(dependency.dependencies, found))
    }
  })

  return flat
}

const model = (id, dependency) => ({
  id,
  version: dependency.version,
  scope: dependency.dev ? 'dev' : ''
})

module.exports = DependrixNpm
