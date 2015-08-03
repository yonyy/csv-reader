var mongoose = require('mongoose');
var seatSchema = new mongoose.Schema({
	rosterName : String,
	students : Array,
	created_at: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Roster', seatSchema);