var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var locals = res.locals,
		view = new keystone.View(req, res);

	locals.page = 'staff';

	view.render('staff');
};
