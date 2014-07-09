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

var image_mime_types = [
	'image/png',
	'image/jpeg',
	'image/tiff',
	'image/gif',
	'image/svg+xml'
];

ArtSubmission.add(_.extend({
	originalImage: {
		type: Types.LocalFile,
		dest: './submissions/art/original',
		allowedTypes: image_mime_types,
		filename: function (model, filename) {
			var filename_elements = filename.split(('.'));
			return filename_elements[0] + '_' + model._id + '.' + filename_elements[1];
		},
		noedit: true
	},
	editedImage: {
		type: Types.LocalFile,
		dest: './submissions/art/edited',
		allowedTypes: image_mime_types,
		filename: function (model, filename) {
			var filename_elements = filename.split(('.'));
			return filename_elements[0] + '_' + model._id + '.' + filename_elements[1];
		}
	},
	technicalDetails: {
		type: String
	}
}, SubmissionSchema));

ArtSubmission.defaultColumns = 'title, state|20%, submissionDate|20%';
ArtSubmission.register();
