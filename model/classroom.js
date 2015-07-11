var mongoose = require('mongoose');
var SeatSchema = require('./seat');
var classroomSchema = new mongoose.Schema({
	name: String,
	height: Number,
	width: Number,
	created_at: {
		type: Date,
		default: Date.now
	},
	ghost_seat: [String],
	lefthanded_seat: [String]
});

mongoose.model('Classroom', classroomSchema);