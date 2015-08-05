var mongoose = require('mongoose');
var seatSchema = new mongoose.Schema({
	rosterName : String,
	totalStudents: Number,
	students : Array,
	created_at: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Roster', seatSchema);