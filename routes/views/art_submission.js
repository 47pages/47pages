var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals,
		query;

	// Set locals
	locals.page = 'art';
	locals.art_submission = null;

	// Pass the published art submission to the view
	query = keystone.list('ArtSubmission').model
			.findOne()
			.where('slug', req.params.slug)
			.where('publishOnline').equals(true)
			.populate('volumeAssignment');

	view.on('init', function (next) {
		query.exec(function (err, result) {
			locals.art_submission = result;
			next();
		});
	});

	// Render the view
	view.render('art_submission');
};
