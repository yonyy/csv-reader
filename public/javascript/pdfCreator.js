var row_gap = 5;  // The gap between each column
var col_gap = 50; // the gap between each row
var title_marginLeft = 50;  // The x coord of the title
var title_marginTop = 10; // The y coord of the title
var end_X = 200;  // The maximum x coord
var end_Y = 280;  // the maximum y coord
var rosterFontSize = 6; // font size to use for the students
var startX = 10; // The x coord to begin writing the table of students
var startY = 15;  // The y coord to begin writing the table of students
var pdfFileName = "";
var doc = null;
var currentX = 0
var currentY = 0

/*console.log(students);*/
function generatePDF(format, filename, title, totalSeats, totalStudents) {
  // Sorts the students array based off the option selected
  var formatStr = ""
  var gridLayout = false;
  var stationLayout = false;
  var maxRowsPerPage = 12
  console.log(students)

  // Formating title and sorting array based on sorting option selected
  if (filename == "") filename = "SeatingChart"
  if (title == "") title = "Seating Chart"

  if (format == "RowSorted"){
    students.sort(sortByRow);
    formatStr = "Row Sorted"
  }
	if (format == "ColumnSorted") {
    students.sort(sortByColumns);
    formatStr = "Column Sorted"
  }
	if (format == "NameSorted") {
    students.sort(sortByName);
    formatStr = "Name Sorted"
  }
  if (format == "GridSorted") {
    seatArr.sort(sortByGrid);
    gridLayout = true;
    formatStr = "Grid Layout"
  }
  if (format == "StationSorted") {
    seatArr.sort(sortByStation);
    stationLayout = true;
    formatStr = "Station Number Sorted"
  } 

  doc = new jsPDF();
  if (gridLayout) 
    doc = new jsPDF("l"); // Landscape orientatiokn for grid layout

  var emptySeats = [];  // array to hold empty seat strings. To be prined at the end of file
  console.log(filename)
  console.log(title)

  currentX = startX;
  currentY = startY;
  var titleString = title + " " + formatStr;
  var downloadString = filename + format;
  console.log(titleString);

  doc.setFont("helvetica");
  doc.setProperties({
      title: titleString,
      subject: 'Seating Chart',
      author: 'Online Seating Chart Generator'
  });

  doc.setFontSize(8)

  /* Writing the heading of the pdf */
  doc.text(100,10, titleString);
  //doc.text(title_marginLeft,title_marginTop, titleString);
  doc.setFontSize(rosterFontSize);

  if (!gridLayout && !stationLayout) {
    console.log(students) 
    /* Writing roster */
    for (var i = 0; i < students.length; i++) {
      if (currentY <= end_Y) {  // Add students in the current column
        if (students[i] == null) continue;  // Dont write null students
        if (students[i].studentID == "") {  // If it is an empty student push it to the array
          /* Display the empty students along with all students for row and for column charts
           * For alphabetic charts, keep them at the end */
          if (format == "NameSorted")
            emptySeats.push(createString(students[i]));
          else {
            doc.text(currentX, currentY, "000" + createString(students[i]))
            currentY += row_gap
          }
        }
        else {  // If not an empty student write it to the pdf
          doc.text(currentX, currentY, createString(students[i]))
          currentY += row_gap;  // Go down one row
        }
      }
      checkBoundaries(end_X, end_Y)
    };

    /* Writing the empty students to the pdf */
    for(var i = 0; i < emptySeats.length; i++) {
      doc.text(currentX, currentY, emptySeats[i].toString());
      currentY+= row_gap; // Same logic as above
      checkBoundaries(end_X, end_Y)
    }
  } /* Perform grid layout */
  if (gridLayout){
    //cellWidth = 40;
    //cellHeight = 20
    startX = 15;
    //end_Y = 270;  // changing value of end_y
    end_X = 270
    if (gridRow > 8)
      end_Y = 250
    else
      end_Y = 180

    var cellWidth = Math.floor(end_X/gridCol)
    var cellHeight = Math.floor(end_Y/gridRow) - 5
    console.log(Math.floor(end_X/gridRow))
    currentX = startY
    currentY = startX
    doc.cellInitialize();
    for (var i = 0; i < gridRow; i++) {
      for(var j = 0; j < gridCol; j++) {
        var tempStation = seatArr[i*gridCol + j]
        var cellContent = " "
        console.log(tempStation)
        console.log(partners)
        if (!tempStation.isGhost) {
          cellContent = tempStation.seatPosition.toString() + "\n"
          var partners = tempStation.students;
          for (var k = 0; k < partners.length; k++) {
            cellContent += partners[k].firstname + ", " + partners[k].lastname + " ______" + "\n"
          }
        }
        doc.cell(currentX,currentY,cellWidth,cellHeight, cellContent,i)
        currentX += cellWidth
      }
      currentX = startX
      currentY += cellHeight
    }
  }

  if (stationLayout) {
    for(var i = 0; i < seatArr.length; i++) {
      var currStation = seatArr[i]
      if (!currStation.isGhost) {
        var partners = currStation.students;
        for (var k = 0; k < partners.length; k++) {
          if (partners[k].studentID == "")
            emptySeats.push(createString(partners[k]))
          else {
            doc.text(currentX, currentY, createString(partners[k]))
            currentY += row_gap;  // Go down one row
          }
          console.log(currentY)
          checkBoundaries(end_X, end_Y)
        }
      }
    }
    /* Writing the empty students to the pdf */
    for(var i = 0; i < emptySeats.length; i++) {
      console.log(currentY)
      doc.text(currentX, currentY, emptySeats[i].toString());
      currentY+= row_gap; // Same logic as above
      checkBoundaries(end_X, end_Y)
    }
  }

  /* Writing class info to pdf */
  currentY += 3*row_gap
  if (!gridLayout) checkBoundaries(end_X,end_Y)
  var seatPerStation = (seatArr[0].numPerStation != null) ? seatArr[0].numPerStation : 1
  var totalStudentStr = "Total Students: " + totalStudents;
  var totalSeatsStr = "Total Seats: " + totalSeats;
  var seatsPerStatStr = "Students per Seats: " + seatPerStation
  var expectedEmptyStr = "Expected Empty Seats: " + ((totalSeats*seatPerStation) - totalStudents).toString();
  var actualEmptyStr = "Actual Empty Seats: ______";
  
  var bottomInfo = [totalStudentStr, totalSeatsStr, seatsPerStatStr, expectedEmptyStr, actualEmptyStr];
  
  // Adding classroom and updating x coord and y coord
  for (var i = 0; i < bottomInfo.length; i++) {
    console.log(currentX,currentY)
    doc.text(currentX, currentY, bottomInfo[i]);
    currentY += row_gap;
    if (!gridLayout) checkBoundaries(end_X, end_Y);
  }

  // Save and dowload
  doc.save(downloadString)
}

function checkBoundaries(endx, endy) {
  /* Begin new column is reaches the end */
  if (currentY > endy) {
    currentY = startY;
    currentX += col_gap;
  } /* If the current x is greater than the x-max, add new page */
  if (currentX > endx) {
    doc.addPage();
    currentX = startX;
    currentY = startY;
  }
}

// Counts the number of seats in the classroom
function countSeats() {
  var expectedSeats = gridCol * gridRow;
  
  for(var i = 0; i < seatArr.length; i++) {
    if (seatArr[i].isGhost) {
      expectedSeats--;
    }
  }
  return expectedSeats;
}

/* Comparison functions to sort seats by their grid layout */
function sortByStation(station1, station2) {
  if (parseInt(station1.seatPosition,10) < parseInt(station2.seatPosition,10))
    return -1;
  if (parseInt(station1.seatPosition,10) > parseInt(station2.seatPosition,10))
    return 1;
  return 0;
}



/* Comparison functions to sort seats by their grid layout */
function sortByGrid(station1, station2) {
  if (parseInt(station1.gridPos,10) < parseInt(station2.gridPos,10))
    return -1;
  if (parseInt(station1.gridPos,10) > parseInt(station2.gridPos,10))
    return 1;
  return 0;
}

/* Comparison functions to sort by lastname */
function sortByName(stud1, stud2) {
  if (stud1.lastname < stud2.lastname)
    return -1;
  if (stud1.lastname > stud2.lastname)
    return 1;
  return 0;
}

/* Comparison function to sort by row */
function sortByRow(stud1, stud2) {
  console.log(stud1)
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

/* Comparison function to sort by column */
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

