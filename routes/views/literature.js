var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals,
		query;

	// Set locals
	locals.page = 'literature';
	locals.literature_submissions = [];

	// Pass the published literature submissions to the view
	query = keystone.list('LiteratureSubmission').model.find().populate('volumeAssignment');

	view.on('init', function (next) {
		query.exec(function (err, results) {
			locals.literature_submissions = results;
			next();
		});
	});

	// Render the view
	view.render('literature');
};
