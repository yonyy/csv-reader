var row_gap = 5;
var col_gap = 50;
var title_marginLeft = 70;
var title_marginTop = 10;
var end_X = 200;
var end_Y = 290;
var rosterFontSize = 6;
var startX = 5;
var startY = 15;
var pdfFileName = "";

/*console.log(students);*/
function generatePDF(format, filename, title) {
  if (format == "RowSorted")
    students.sort(sortByRow);
	if (format == "ColumnSorted")
    students.sort(sortByColumns);
	if (format == "NameSorted")
    students.sort(sortByName);
  
  var doc = new jsPDF();
  var emptySeats = [];
  var numEmpty = 0;
  console.log(filename)
  console.log(title)
  var totalSeats = countSeats(); 
  var removedStudents = 0;
  var currentX = startX;
  var currentY = startY;
  if (filename == "") filename = "SeatingChart"
  if (title == "") title = "Seating Chart"
  var titleString = title+ " " + format;
  var downloadString = filename + format;
  console.log(titleString);

  doc.setFont("helvetica");
  doc.margins = 1;
  doc.setProperties({
      title: titleString,
      subject: 'Seating Chart',
      author: 'Online Seating Chart Generator'
  });

  /* Writing the heading of the pdf */
  doc.text(title_marginLeft,title_marginTop, titleString);
  doc.setFontSize(rosterFontSize);
/*  doc.text(currentX, currentY, createString(students[0]))*/
  
  /* Writing roster */
  for (var i = 0; i < students.length; i++) {
    if (currentY <= end_Y) {
      console.log(createString(students[i]));
      if (students[i] == null) continue;
      if (students[i].studentID == "") {
        emptySeats.push(createString(students[i]));
        removedStudents++;
      }
      else {
        doc.text(currentX, currentY, createString(students[i]))
        currentY += row_gap;
      }
/*      checkCoord(currentX,currentY,doc);*/
    }
    if (currentY > end_Y) {
      currentY = startY;
      currentX += col_gap;
    }
    if (currentX > end_X) {
      doc.addPage();
      currentX = startX;
      currentY = startY;
    }
  };

  /* Writing the empty students to the pdf */
  for(var i = 0; i < emptySeats.length; i++) {
    doc.text(currentX, currentY, emptySeats[i].toString());
    currentY+= row_gap;
    if (currentY > end_Y) {
      currentY = startY;
      currentX += col_gap;
    }
    if (currentX > end_X) {
      doc.addPage();
      currentX = startX;
      currentY = startY;
    }
  }

  /* Writing class info to pdf */
  currentY += 3*row_gap  
  var totalStudentStr = "Total Students: " + (students.length - removedStudents).toString();
  var totalSeatsStr = "Total Seats: " + totalSeats;
  var expectedEmptyStr = "Expected Empty Seats: " + (totalSeats - students.length + removedStudents).toString();
  var actualEmptyStr = "Actual Empty Seats: ______";
  
  var bottomInfo = [totalStudentStr, totalSeatsStr, expectedEmptyStr, actualEmptyStr];
  for (var i = 0; i < bottomInfo.length; i++) {
    doc.text(currentX, currentY, bottomInfo[i]);
    currentY += row_gap;
    if (currentY > end_Y) {
      currentY = startY;
      currentX += col_gap;
    }
    if (currentX > end_X) {
      doc.addPage();
      currentX = startX;
      currentY = startY;
    }
  }
  doc.save(downloadString)
}

function checkCoord(x,y,doc) {
  if (y > end_Y) {
    y = startY;
    x += col_gap;
  }
  if (x > end_X) {
    doc.addPage();
    x = startX;
    y = startY;
  }
}

function countSeats() {
  var expectedSeats = gridCol * gridRow;
  for(var i = 0; i < seatArr.length; i++) {
    if (seatArr[i].isGhost) {
      expectedSeats--;
    }
  }
  return expectedSeats;
}

/* Comparison functions */
function sortByName(stud1, stud2) {
  if (stud1.lastname < stud2.lastname)
    return -1;
  if (stud1.lastname > stud2.lastname)
    return 1;
  return 0;
}

function sortByRow(stud1, stud2) {
  var seatPos1 = stud1.seat.seatPosition;
  var seatPos2 = stud2.seat.seatPosition;
  var row1 = seatPos1[0]
  var row2 = seatPos2[0]
  var pos1 = "";
  var pos2 = "";
  for (var i = 1; i < seatPos1.length; i++) {
    pos1 += seatPos1[i]
  }

  for (var i = 1; i < seatPos2.length; i++) {
    pos2 += seatPos2[i];
  }
  var int_pos1 = parseInt(pos1,10);
  var int_pos2 = parseInt(pos2,10);

  if(row1 == row2) {
    if (int_pos1 < int_pos2)
      return -1;
    else
      return 1;
  }
  else if(row1 < row2)
    return -1;
  else
    return 1;
}

function sortByColumns(stud1, stud2) {
  var seatPos1 = stud1.seat.seatPosition;
  var seatPos2 = stud2.seat.seatPosition;
  var row1 = seatPos1[0]
  var row2 = seatPos2[0]
  var pos1 = "";
  var pos2 = "";
  for (var i = 1; i < seatPos1.length; i++) {
    pos1 += seatPos1[i]
  }

  for (var i = 1; i < seatPos2.length; i++) {
    pos2 += seatPos2[i];
  }
  var int_pos1 = parseInt(pos1,10);
  var int_pos2 = parseInt(pos2,10);

  if(int_pos1 == int_pos2) {
    if (row1 < row2)
      return -1;
    else
      return 1;
  }
  else if(int_pos1 < int_pos2)
    return -1;
  else
    return 1;
}

