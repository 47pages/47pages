var keystone = require('47pages-keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals,
		query;

	// Set locals
	locals.page = 'art';
	locals.art_submissions = [];

	// Pass the published art submissions to the view
	query = keystone.list('ArtSubmission').model
			.find()
			.where('publishOnline').equals(true)
			.populate('volumeAssignment');

	view.on('init', function (next) {
		query.exec(function (err, results) {
			locals.art_submissions = results;
			next();
		});
	});

	// Render the view
	view.render('art');
};
