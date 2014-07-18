var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Meeting
 * ==========
 */

var Meeting = new keystone.List('Meeting', {
	map: {
		name: 'date'
	},
	autokey: {
		path: 'slug',
		from: 'date',
		unique: true
	},
	nocreate: true,
	nodelete: true
});

Meeting.add({
	date: {
		type: Types.Date
	},
	minutes: {
		type: Types.Html,
		wysiwyg: true,
		height: 150
	}
});

Meeting.relationship({
	path: 'art submissions',
	ref: 'ArtSubmission',
	refPath: 'staffMeetingAssignment'
});

Meeting.relationship({
	path: 'literature submissions',
	ref: 'LiteratureSubmission',
	refPath: 'staffMeetingAssignment'
});

Meeting.defaultColumns = 'date';
Meeting.register();
