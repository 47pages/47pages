var keystone = require('keystone'),
	Types = keystone.Field.Types,
	_ = require('underscore'),
	SubmissionSchema = require('./base/Submission.js');

/**
 * ArtSubmission < Submission
 * ==========
 */

var ArtSubmission = new keystone.List('ArtSubmission', {
	map: {
		name: 'title'
	},
	autokey: {
		path: 'slug',
		from: 'title',
		unique: true
	}
});

ArtSubmission.add(_.extend(SubmissionSchema, {
	image: {
		type: Types.LocalFile,
		dest: '/submissions/art',
		allowedTypes: ['png']
	},
	technicalDetails: {
		type: String
	}
}));

ArtSubmission.defaultColumns = 'title, state|20%, submissionDate|20%';
ArtSubmission.register();
