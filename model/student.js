var mongoose = require('mongoose');
var studentSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	email: String,
	isLeftHanded: Boolean,
	isOSD: Boolean,
	created_at: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Student', studentSchema);