# 47pages

The literary magazine of the Claremont Colleges.

# Development

47pages runs on Node.js and uses MongoDB for its database, with a Mongoose abstraction layer. Nodemon is used to run and serve the Node instance, and Grunt is used as a task runner. Node dependencies are managed by npm in `package.json`.

47pages is built off the KeystoneJS CMS framework. A forked and customized version is maintained at github.com/47pages/keystone, and special steps must be taken to link that particular module with Node.

## Getting up and running
- Clone the repos:
	- `git clone git@github.com:47pages/47pages.git`
	- `git clone git@github.com:47pages/keystone.git`
- Install the necessary dependencies: `cd 47pages && npm install`
- Link the custom Keystone module: (create a symlink and tell npm about it)
	- `cd keystone && sudo npm link`
	- `cd 47pages && npm link 47pages-keystone`
- Start the Grunt watch task: `cd 47pages && grunt`
- Start Nodemon: `cd 47pages && nodemon`
