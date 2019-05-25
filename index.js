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
            dependencies: []
          }
        }
      )
    }), { projects: {} }))
}

module.exports = DependrixNpm
