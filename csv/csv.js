/* File to generate a csv file filled with random student names, emails, and ids */

var random = require("random-name")
var csv = require("fast-csv")
var fs = require("fs")
var path = require("path")
var csvStream = csv.format({headers: false});
var writableStream = fs.createWriteStream(path.resolve("./", "RandomNames.csv"))
var names = []

writableStream.on("finish", function () {
	console.log("done");
});

csvStream.pipe(writableStream)

/* Generate a csv with proper format */
for (var i = 0; i < 110; i++) {
	var random_first = random.first()
	var random_last = random.last()
	var email = random_first.toLowerCase() + "@sample.edu"
	var id = (i+1).toString()
	csvStream.write({
		last : random_last,
		first : random_first,
		email : email,
		id : id	
	});
	console.log(id + ") " + random_first + " : " + email)
}

csvStream.end();


/* Generate a csv with improper format */
csvStream = csv.format({headers: false});
writableStream = fs.createWriteStream(path.resolve("./", "Wrong.csv"))
writableStream.on("finish", function () {
	console.log("done");
});
csvStream.pipe(writableStream)

for (var i = 0; i < 50; i++) {
	var random_first = random.first()
	var random_last = random.last()
	var email = random_first.toLowerCase() + "@sample.edu"
	var id = (i+1).toString()

	csvStream.write({
		id : id,
		last : random_last,
		first : random_first,
		fakeinfo : Math.random() * 100,
		email : email,
	});
}

csvStream.end();

