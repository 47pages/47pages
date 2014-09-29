var keystone = require('47pages-keystone'),
	Types = keystone.Field.Types;

/**
 * Submission Base Schema
 * ==========
 */

var Submission = {
	schema: {
		title: {
			type: String,
			required: true
		},
		originalTitle: {
			type: String,
			required: true,
			noedit: true
		},
		author: {
			type: Types.Name,
			index: true,
			required: true,
			noedit: true
		},
		submissionDate: {
			type: Types.Date,
			index: true,
			required: true,
			default: Date.now,
			noedit: true
		},
		willingToEdit: {
			type: Types.Boolean,
			noedit: true
		},
		willingToMeetInPerson: {
			type: Types.Boolean,
			dependsOn: {
				willingToEdit: true
			},
			noedit: true
		},
		contactEmail: {
			type: Types.Email,
			required: true,
			noedit: true
		},
		additionalNotes: {
			type: String,
			noedit: true
		},
		status: {
			type: Types.Select,
			options: 'new, staff review, editorial review, copy, design, published',
			default: 'new',
			index: true
		},
		staffMeetingAssignment: {
			type: Types.Relationship,
			ref: 'Meeting',
			dependsOn: {
				status: 'staff review'
			}
		},
		volumeAssignment: {
			type: Types.Relationship,
			ref: 'Volume',
			dependsOn: {
				status: 'design'
			}
		},
		publishOnline: {
			type: Types.Boolean,
			default: false
		}
	},
	hooks: {
		// Don't allow the publish flag to be set without a volume assignment
		// (causes a bug in the view since submissions are joined against volume records)
		pre_save: function (next) {
			if (this.publishOnline && !this.volumeAssignment) {
				var self = this;

				keystone.list('Volume').model
					.find()
					.sort('-number')
					.limit(1)
					.exec(function (err, results) {
						self.volumeAssignment = results[0];
						next();
					});
			}
			else {
				next();
			}
		}
	}
};

module.exports = Submission;