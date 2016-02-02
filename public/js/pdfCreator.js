var row_gap = 5;  // The gap between each column
var col_gap = 40; // the gap between each row
var title_marginLeft = 70;  // The x coord of the title
var title_marginTop = 10; // The y coord of the title
var end_X = 200;  // The maximum x coord
var end_Y = 280;  // the maximum y coord
var rosterFontSize = 6; // font size to use for the students
var startX = 10; // The x coord to begin writing the table of students
var startY = 15;  // The y coord to begin writing the table of students
var pdfFileName = "";
var doc = null;
var currentX = 0;
var currentY = 0;
var newPage = false;
/*console.log(students);*/
function generatePDF(format, filename, title, totalSeats, totalStudents) {
  // Sorts the students array based off the option selected
  var formatStr = ""
  var gridLayout = false;
  var lastNameSorted = false;
  var stationLayout = false;
  var maxRowsPerPage = 12
  row_gap = 5;  // The gap between each column
  col_gap = 40; // the gap between each row
  end_X = 200;  // The maximum x coord
  end_Y = 280;  // the maximum y coord
  startX = 10; // The x coord to begin writing the table of students
  startY = 15;  // The y coord to begin writing the table of students
  //console.log(students)

  // Formating title and sorting array based on sorting option selected
  if (filename == "") filename = "SeatingChart"
  if (title == "") title = "Seating Chart"

  if (format == "RowSorted"){
    students.sort(sortByRow);
    formatStr = "Row Sorted"
  }
  else if (format == "ColumnSorted") {
    students.sort(sortByColumns);
    formatStr = "Column Sorted"
  }
  else if (format == "NameSorted") {
    students.sort(sortByName);
    formatStr = "Last Name Sorted"
    lastNameSorted = true;
  }
  else if (format == "GridSorted") {
    seatArr.sort(sortByGrid);
    gridLayout = true;
    formatStr = "Grid Layout"
  }
  else if (format == "StationSorted") {
    seatArr.sort(sortByStation);
    stationLayout = true;
    formatStr = "Station Number Sorted"
  } 

  doc = new jsPDF();
  if (gridLayout) 
    doc = new jsPDF("l"); // Landscape orientatiokn for grid layout

  var emptySeats = [];  // array to hold empty seat strings. To be prined at the end of file
  var nonEmptySeats = [];
  //console.log(filename)
  //console.log(title)

  currentX = startX;
  currentY = startY;
  var downloadString = filename + format;
  //console.log(titleString);

  doc.setFont("helvetica");
  doc.setProperties({
      title: title,
      subject: 'Seating Chart',
      author: 'Online Seating Chart Generator'
  });

  doc.setFontSize(10)

  /* Writing the heading of the pdf */
  doc.text(title_marginLeft-60,title_marginTop,title);
  doc.text(title_marginLeft+100, title_marginTop,formatStr)
  //doc.text(title_marginLeft,title_marginTop, titleString);
  doc.setFontSize(rosterFontSize);

  if (!gridLayout && !stationLayout) {
    //console.log(students) 
    /* Writing roster */
    for (var i = 0; i < students.length; i++) {
      if (currentY <= end_Y) {  // Add students in the current column
        if (students[i] == null || students[i].seat == null){ 
          continue;  // Dont write null students
          //console.log(students[i].firstname + " " + students[i].lastname + " has no assigned seat")
        }
        if (students[i].studentID == "") {  // If it is an empty student push it to the array
          /* Display the empty students along with all students for row and for column charts
           * For alphabetic charts, keep them at the end */
          emptySeats.push(students[i]);
          //console.log(students[i])
        }
        else {  // If not an empty student write it to the pdf
          nonEmptySeats.push(students[i]) // Go down one row
        }
      }
    };

  } /* Perform grid layout */
  else if (gridLayout){
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
    //console.log(Math.floor(end_X/gridRow))
    currentX = startY
    currentY = startX
    doc.cellInitialize();
    for (var i = 0; i < gridRow; i++) {
      for(var j = 0; j < gridCol; j++) {
        var tempStation = seatArr[i*gridCol + j]
        var cellContent = " "
        //console.log(tempStation)
        //console.log(partners)
        if (!tempStation.isGhost) {
          cellContent = tempStation.seatPosition.toString() + "\n"
          var partners = tempStation.students;
          for (var k = 0; k < partners.length; k++) {
            cellContent += partners[k].firstname + ", " + partners[k].lastname
            if (partners[k].studentID != "")
               cellContent += " ______\n"
            else
              cellContent += "\n"
          }
        }
        doc.cell(currentX,currentY,cellWidth,cellHeight, cellContent,i)
        currentX += cellWidth
      }
      currentX = startX
      currentY += cellHeight
    }
  }
  //Sort by station number
  else if (stationLayout) {
    for(var i = 0; i < seatArr.length; i++) {
      var currStation = seatArr[i]
      if (!currStation.isGhost) {
        var partners = currStation.students;
        for (var k = 0; k < partners.length; k++) {
          if (partners[k].studentID == "")
            emptySeats.push(partners[k])
          else
            nonEmptySeats.push(partners[k])
        }
      }
    }
  }

  if (!gridLayout) {
    var ratio1 = end_Y*nonEmptySeats.length/totalSeats
    var ratio2 = end_Y*emptySeats.length/totalSeats
    var top_end_y = ratio1 + 10;
    var bottom_end_y  = top_end_y + ratio2;

    if (lastNameSorted){
      doc.setFontSize(8)//(rosterFontSize+3)
      col_gap += 10;
      top_end_y = end_Y+10;
    }

    doc.text(currentX,currentY, "Assigned Seats:")
    currentY += row_gap;

    for (var i = 0; i < nonEmptySeats.length; i++) {
      doc.text(currentX, currentY, createString(nonEmptySeats[i]).substring(0,32))
      currentY += row_gap
      checkBoundaries(end_X-50, top_end_y)
    };
    console.log('finished top half')
    if (!lastNameSorted) {
      if (newPage) {
        startY = currentY + row_gap;
        bottom_end_y = end_Y;
      } else startY =  top_end_y;// + row_gap;
      currentX = startX
      currentY = startY
      checkBoundaries(end_X, bottom_end_y) 
      doc.text(currentX, currentY, "Available Seats:")
      /* Writing the empty students to the pdf */
      emptySeats.sort(sortByRow);
      currentY += row_gap;
      for(var i = 0; i < emptySeats.length; i++) {
        //console.log(currentY)
        doc.text(currentX, currentY, createString(emptySeats[i]));
        currentY += row_gap; // Same logic as above
        checkBoundaries(end_X, bottom_end_y)
      } 
    } else {
      currentY += 10*row_gap;
      checkBoundaries(end_X, top_end_y)
    }
  }

  /* Writing class info to pdf */
  if (!lastNameSorted) currentY += 2*row_gap
  if (!gridLayout) checkBoundaries(end_X,end_Y)
  var seatPerStation = (seatArr[0].numPerStation != null) ? seatArr[0].numPerStation : 1
  var totalStudentStr = "Total Students: " + totalStudents;
  var totalSeatsStr = "Total Seats: " + totalSeats;
  var seatsPerStatStr = "Students per Seats: " + seatPerStation
  var expectedEmptyStr = "Expected Empty Seats: " + ((totalSeats*seatPerStation) - totalStudents).toString();
  var actualEmptyStr = "Actual Empty Seats: ______";
  var tutorRole = "Tutor: _______\nResponsibility:"
  var bottomInfo = [totalStudentStr, totalSeatsStr, seatsPerStatStr, expectedEmptyStr, actualEmptyStr];
  
  // Adding classroom and updating x coord and y coord
  for (var i = 0; i < bottomInfo.length; i++) {
    //console.log(currentX,currentY)
    doc.text(currentX, currentY, bottomInfo[i]);
    currentY += row_gap;
    if (!gridLayout) checkBoundaries(end_X, end_Y);
  }
  for (var i = 0; i < 4; i++) {
    doc.text(currentX,currentY, tutorRole);
    currentY += 4*row_gap
    if (!gridLayout) checkBoundaries(end_X, end_Y);
  }

  // Save and dowload
  console.log("saving")
  doc.save(downloadString)
}

function checkBoundaries(endx, endy) {
  /* Begin new column is reaches the end */
  if (currentY+10 > endy && currentX+32 < endx) {
    currentY = startY;
    currentX += col_gap;
    newPage = false;
    console.log('switch row at ' + currentY)
  } /* If the current x is greater than the x-max, add new page */
  else if (currentY+10 > end_Y && currentX+32 > endx) {
    doc.addPage();
    newPage = true;
    currentX = startX = 15;
    currentY = startY = 10;
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

