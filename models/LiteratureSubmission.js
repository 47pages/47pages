var keystone = require('keystone'),
	Types = keystone.Field.Types,
	_ = require('underscore'),
	SubmissionSchema = require('./base/Submission.js');

/**
 * LiteratureSubmission < Submission
 * ==========
 */

var LiteratureSubmission = new keystone.List('LiteratureSubmission', {
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	}
});

LiteratureSubmission.add(_.extend(SubmissionSchema, {
	body: {
		type: Types.Html,
		wysiwyg: true,
		height: 150
	},
	artworkPairing: {
		type: String
	}
}));

LiteratureSubmission.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
LiteratureSubmission.register();
