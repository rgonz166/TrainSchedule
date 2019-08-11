var i = 0; //firebase 

var firebaseConfig = {
    apiKey: "AIzaSyAbi5twj6U0vmaWGMTMRV8Z2Argbt_dKHY",
    authDomain: "train-scheduler-c4e86.firebaseapp.com",
    databaseURL: "https://train-scheduler-c4e86.firebaseio.com",
    projectId: "train-scheduler-c4e86",
    storageBucket: "",
    messagingSenderId: "90147602430",
    appId: "1:90147602430:web:6784f1668f3bfd72"
};
firebase.initializeApp(firebaseConfig);


var database = firebase.database();

$("#form-information").on("submit", function (event) {
  event.preventDefault();

  var name = $("#train-name").val().trim();
  var destination = $("#train-destination").val().trim();
  var firstTime = $("#first-train-time").val().trim();
  var frequency = $("#train-frequency").val().trim();

  database.ref().push({
    name: name,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency
  });

  $("#train-name").val("");
  $("#train-destination").val("");
  $("#first-train-time").val("");
  $("#train-frequency").val("");

  return false;
});

database.ref().orderByChild("dateAdded").on("child_added", function (childSnapshot) {

  var addButton = $("<button>").html("<span class='glyphicon glyphicon-edit'></span>").addClass("button-update").attr("data-i", i).attr("data-key", childSnapshot.key);
  var remove = $("<button>").html("<span class='glyphicon glyphicon-remove'></span>").addClass("remove-button").attr("data-i", i).attr("data-key", childSnapshot.key);

  var firstTime = childSnapshot.val().firstTime;
  var currentFre = parseInt(childSnapshot.val().frequency);
  var trainNum = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(trainNum);
  console.log(firstTime);
  var currT = moment();
  var timeCal = moment().subtract(1, "years");
  var diffTime = currT.diff(moment(trainNum), "minutes");
  var tRemainder = diffTime % currentFre;
  var minCount = currentFre - tRemainder;
  var nextTrain = currT.add(minCount, "minutes").format("hh:mm A");
  var btime = moment(trainNum).diff(timeCal, "minutes");
  var bmin = Math.ceil(moment.duration(btime).asMinutes());

  if ((timeCal - trainNum) < 0) {
    nextTrain = childSnapshot.val().firstTime;
    console.log("Before First Train");
    minCount = bmin;
  } else {
    nextTrain = moment().add(minCount, "minutes").format("hh:mm A");
    minCount = currentFre - tRemainder;
  }


  var newRow = $("<tr>");
  newRow.addClass("row-" + i);
  var trName = $("<td>").text(childSnapshot.val().name);
  var trDest = $("<td>").text(childSnapshot.val().destination);
  var trFreq = $("<td>").text(childSnapshot.val().frequency);
  var nxtTr = $("<td>").text(nextTrain);
  var minCnt = $("<td>").text(minCount);
  var rmBtn = $("<td>").append(remove);

  newRow
    .append(trName)
    .append(trDest)
    .append(trFreq)
    .append(nxtTr)
    .append(minCnt)
    .append(rmBtn)

  $("#train-schedule-body").append(newRow);

  i++;

}, function (error) {

  alert(error.code);

});

$(document).on("click", ".remove-button", deleteRow);
$(document).on("click", ".button-update", changeRow);
$(document).on("click", ".submitButton", createRow);

function changeRow() {
  $(".row-" + $(this).attr("data-i")).children().eq(1).html("<textarea class='newTrain'></textarea>");
  $(".row-" + $(this).attr("data-i")).children().eq(2).html("<textarea class='newDestination'></textarea>");
  $(".row-" + $(this).attr("data-i")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
  $(this).toggleClass("button-update").toggleClass("submitButton");
};

function deleteRow() {
  $(".row-" + $(this).attr("data-i")).remove();
  database.ref().child($(this).attr("data-key")).remove();
};



function createRow() {
  var newTrain = $(".newTrain").val().trim();
  var newDestination = $(".newDestination").val().trim();
  var newFrequency = $(".newFrequency").val().trim();

  database.ref().child($(this).attr("data-key")).child("name").set(newTrain);
  database.ref().child($(this).attr("data-key")).child("destination").set(newDestination);
  database.ref().child($(this).attr("data-key")).child("frequency").set(newFrequency);

  $(".row-" + $(this).attr("data-i")).children().eq(1).html(newTrain);
  $(".row-" + $(this).attr("data-i")).children().eq(2).html(newDestination);
  $(".row-" + $(this).attr("data-i")).children().eq(3).html(newFrequency);
  $(this).toggleClass("button-update").toggleClass("submitButton");
};