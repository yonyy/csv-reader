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
  //console.log(stud1)
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