var mongoose = require('mongoose');
var SeatSchema = require('./seat');
var studentSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	isLeftHanded: Boolean,
	isOSD: Boolean,
	seat: SeatSchema,
	created_at: {
		type: Date,
		default: Date.now
	},
	seats: [SeatSchema],
});

mongoose.model('Student', studentSchema);