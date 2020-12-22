var timeContainer;
var remaining;
$(function () {
  $.get("https://kontests.net/api/v1/codeforces", function () {}).done(
    function (contests) {
      $(".problem-loading").hide();
      $("#contestCount").html(`<span class="Count">${contests.length}</span>`);
      $("#contestCount0").html(`${contests.length}`);
      $(".Count").each(function () {
        var $this = $(this);
        jQuery({ Counter: 0 }).animate(
          { Counter: $this.text() },
          {
            duration: 2000,
            easing: "swing",
            step: function () {
              $this.text(Math.ceil(this.Counter));
            },
          }
        );
      });

      //finding standard contests
      var found = 0;
      for (let i = 0; i < contests.length; ++i) {
        if (
          contests[i].name.includes("Codeforces Round") ||
          contests[i].name.includes("Codeforces Educational") ||
          contests[i].name.includes("Codeforces Global")
        ) {
          found = i;
          break;
        }
      }

      $(".contestName").html(`${contests[found].name}`);
      $(".register").html(
        `<a target="__blank" href="${contests[found].url}"><div class="rg">Register Now</div></a>`
      );

      for (let i = 0; i < contests.length; ++i) {
        var arr = dateTimeSet(contests[i].start_time);
        var html = `
   <div style=" border-radius: 3px; margin-bottom:5px; border-left: 3px solid var(--purple);">
    <div class="countDown" style="background: #192841; box-shadow: 0 1px 2px rgba(0,0,0,3)">
    <br />
    <div class="td" style="color: var(--danger);"><span style="vertical-align: middle; font-size: 13px;" class="material-icons text-info">calendar_today</span> ${arr.date}  | <span style="vertical-align: middle; font-size: 13px;" class="material-icons text-info">schedule</span> ${arr.time} BDT</div>
    <div class="contestName">${contests[i].name}</div>
    <center><a target="blank" href="${contests[i].url}"><div class="btn purple">Go!</div></a></center><br/>
    </div>
    </div>
   `;
        document.getElementById("allSchedule").innerHTML += html;
      }
      var arr = dateTimeSet(contests[found].start_time);
      timeContainer = arr.date + " " + arr.time;
      $(".time").html(`(${timeContainer})`);
      var endTime = dateTimeSet(contests[found].end_time);
      remaining = endTime.date + " " + endTime.time;
      var contestId = contests[found].url.split("/");
      contestId = contestId[contestId.length - 1];
    }
  );
});

function dateTimeSet(time) {
  var TimeArr = time.split("T");
  var date = TimeArr[0];
  var time = TimeArr[1];
  var dateArr = date.split("-");
  var year = dateArr[0];
  var month = parseInt(dateArr[1]);
  var monthName;
  if (month == 1) monthName = "Jan";
  if (month == 2) monthName = "Feb";
  if (month == 3) monthName = "Mar";
  if (month == 4) monthName = "Apr";
  if (month == 5) monthName = "May";
  if (month == 6) monthName = "Jun";
  if (month == 7) monthName = "Jul";
  if (month == 8) monthName = "Aug";
  if (month == 9) monthName = "Sep";
  if (month == 10) monthName = "Oct";
  if (month == 11) monthName = "Nov";
  if (month == 12) monthName = "Dec";
  var day = dateArr[2];
  var fullDate = monthName + " " + day + " " + year;
  // time
  var timeArr = time.split(":");
  var hour = parseInt(timeArr[0]);
  hour = hour + 6;
  fullTime = hour + ":" + timeArr[1] + ":" + "00";
  fullDateTime = fullDate + " " + fullTime;
  return {
    date: fullDate,
    time: fullTime,
  };
};

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var sec = Math.floor((t / 1000) % 60);
  var min = Math.floor((t / 1000 / 60) % 60);
  var hr = Math.floor((t / (1000 * 60 * 60)) % 24);
  var day = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    day: day,
    hr: hr,
    min: min,
    sec: sec,
  };
};

var pointRem = false;
var x = setInterval(function () {
  var rem = getTimeRemaining(timeContainer);
  var end = rem.min;
  if (rem.day < 10) rem.day = "0" + rem.day;
  if (rem.hr < 10) rem.hr = "0" + rem.hr;
  if (rem.min < 10) rem.min = "0" + rem.min;
  if (rem.sec < 10) rem.sec = "0" + rem.sec;
  if (rem.day === "00" && rem.hr != "00" && rem.min != "00") {
    var startIn = `<span class="text-danger num">${rem.hr}</span> hr <span class="text-danger num">${rem.min}</span> min <span class="text-danger num">${rem.sec}</span> sec`;
  } else if (rem.hr === "00" && rem.day === "00" && rem.min != "00") {
    var startIn = `<span class="text-danger num">${rem.min}</span> min <span class="text-danger num">${rem.sec}</span> sec`;
  } else if (rem.min === "00" && rem.hr === "00" && rem.day === "00") {
    var startIn = `<span class="text-danger num">${rem.sec}</span> sec`;
  } else {
    var startIn = `<span class="text-danger num">${rem.day}</span> day <span class="text-danger num">${rem.hr}</span> hr <span class="text-danger num">${rem.min}</span> min <span class="text-danger num">${rem.sec}</span> sec`;
  }
  $("#started").html(startIn);
  var rgp = parseInt(rem.day);
  if (rgp > 2) $(".rg").hide();
  if (end < 0) {
    clearInterval(x);
    $("#started").html("Started!");
    $(".alarm").text("alarm_on");
    $(".rg").text("Participate!");
    $(".time").show();
    $(".remaining").show();
    pointRem = true;
    getpermission(pointRem);
  } else {
    $("#remaining").html("");
  }
}, 1000);

// remaining
function getpermission() {
  var y = setInterval(function () {
    var rem = getTimeRemaining(remaining);
    var end = rem.min;
    if (rem.day < 10) rem.day = "0" + rem.day;
    if (rem.hr < 10) rem.hr = "0" + rem.hr;
    if (rem.min < 10) rem.min = "0" + rem.min;
    if (rem.sec < 10) rem.sec = "0" + rem.sec;
    if (rem.day === "00" && rem.hr != "00" && rem.min != "00") {
      var startIn = `<span class="text-danger num">${rem.hr}</span> hr <span class="text-danger num">${rem.min}</span> min <span class="text-danger num">${rem.sec}</span> sec`;
    } else if (rem.hr === "00" && rem.day === "00" && rem.min != "00") {
      var startIn = `<span class="text-danger num">${rem.min}</span> min <span class="text-danger num">${rem.sec}</span> sec`;
    } else if (rem.min === "00" && rem.hr === "00" && rem.day === "00") {
      var startIn = `<span class="text-danger num">${rem.sec}</span> sec`;
    } else {
      var startIn = `<span class="text-danger num">${rem.day}</span> day <span class="text-danger num">${rem.hr}</span> hr <span class="text-danger num">${rem.min}</span> min <span class="text-danger num">${rem.sec}</span> sec`;
    }
    $("#remaining").html(startIn);
    if (end < 0) {
      clearInterval(y);
      $("#remaining").html("Ended!");
      $("#started").text("");
      $(".alarm").text("alarm_on");
      $(".register").hide();
      pointRem = false;
    } else {
      $("#remaining").show();
    }
  }, 1000);
}
