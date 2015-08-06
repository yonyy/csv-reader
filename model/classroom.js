var mongoose = require('mongoose');
var classroomSchema = new mongoose.Schema({
	className: String,
	height: Number,
	width: Number,
	classType: String,
	ghostSeats: Array,
	leftSeats: Array,
	totalSeats: Number,
	numPerStation: Number,
	seatOrder : Array,
	created_at: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Classroom', classroomSchema);