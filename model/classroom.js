var mongoose = require('mongoose');
var classroomSchema = new mongoose.Schema({
	name: String,
	height: Number,
	width: Number,
	ghostSeats: Array,
	leftSeats: Array,
	totalSeats: Number, 
	created_at: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Classroom', classroomSchema);