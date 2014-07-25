var keystone = require('keystone');

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
			.populate('volumeAssignment');

	view.on('init', function (next) {
		query.exec(function (err, results) {
			locals.art_submissions = results;
			console.log(results);
			next();
		});
	});

	// Render the view
	view.render('art');
};
