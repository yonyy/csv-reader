var mongoose = require('mongoose');
var StudentSchema = require('./student');
var seatSchema = new mongoose.Schema({
	position: String,
	student: StudentSchema,
	isLeftHandedSeat: Boolean,
	isGhostSeat: Boolean,
	isEmpty: Boolean,
	created_at: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Seat', seatSchema);