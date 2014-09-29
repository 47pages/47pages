auth = require('../node_modules/47pages-keystone/routes/api/auth');

exports.create = {
	User: [
		{
			email: 'admin@47pages.org',
			password: 'password',
			name: {
				first: 'Admin',
				last: ''
			},
			isAdmin: true,
			permissionLevel: auth.permissionLevels.admin
		},
		{
			email: 'editor@47pages.org',
			password: 'password',
			name: {
				first: 'Editor',
				last: ''
			},
			isEditor: true,
			permissionLevel: auth.permissionLevels.editor
		},
		{
			email: 'senior_design@47pages.org',
			password: 'password',
			name: {
				first: 'Senior',
				last: 'Design'
			},
			isSeniorDesign: true,
			permissionLevel: auth.permissionLevels.senior
		},
		{
			email: 'senior_literature@47pages.org',
			password: 'password',
			name: {
				first: 'Senior',
				last: 'Literature'
			},
			isSeniorLiterature: true,
			permissionLevel: auth.permissionLevels.senior
		},
		{
			email: 'senior_art@47pages.org',
			password: 'password',
			name: {
				first: 'Senior',
				last: 'Art'
			},
			isSeniorArt: true,
			permissionLevel: auth.permissionLevels.senior
		},
		{
			email: 'junior_literature@47pages.org',
			password: 'password',
			name: {
				first: 'Junior',
				last: 'Literature'
			},
			isJuniorLiterature: true,
			permissionLevel: auth.permissionLevels.junior
		},
		{
			email: 'junior_art@47pages.org',
			password: 'password',
			name: {
				first: 'Junior',
				last: 'Art'
			},
			isJuniorArt: true,
			permissionLevel: auth.permissionLevels.junior
		},
		{
			email: 'staff@47pages.org',
			password: 'password',
			name: {
				first: 'Staff',
				last: ''
			},
			isStaff: true,
			permissionLevel: auth.permissionLevels.staff
		}
	]
};