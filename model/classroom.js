var mongoose = require('mongoose');
var classroomSchema = new mongoose.Schema({
	name: String,
	height: Number,
	width: Number,
	totalGhosts: Number,
	created_at: {
		type: Date,
		default: Date.now
	},
	gridHTML: String
});

mongoose.model('Classroom', classroomSchema);