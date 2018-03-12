var discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var oauthClientId = "523270750292-h66kiavdaoqai49gal1rcdlq4jk02doj.apps.googleusercontent.com";
var googleApiKey = "AIzaSyCkVarR4FD_16i0LiEDwz_W_hitHP3gAhk";
var scopes = "https://www.googleapis.com/auth/calendar.readonly";

function startMirror() {
  date();
  time();
  week();
  weather();
  setInterval(function() {
    weather();
    handleClientLoad();
  }, 3600*1000);
  setInterval(function() {
    date();
    time();
    week();
  }, 500*1000);
};

function weather() {
  var weatherUrl = "https://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/17/lat/62/data.json"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var weatherData = JSON.parse(this.responseText);
      var jsonTime,
          todayDate, todayMorning, todayDay, todayNight,
          temperatureMorning = [], temperatureDay = [], temperatureNight = [];

      for(var i = 0; i < weatherData.timeSeries.length; i++) {
        jsonTime = new Date(weatherData.timeSeries[i].validTime);
        todayDate = new Date();
        todayMorning = new Date(  todayDate.getFullYear(),
                                  todayDate.getMonth(),
                                  todayDate.getDate(),
                                  8, 0, 0);
        todayDay = new Date(  todayDate.getFullYear(),
                              todayDate.getMonth(),
                              todayDate.getDate(),
                              16, 0, 0);
        todayNight = new Date(  todayDate.getFullYear(),
                                todayDate.getMonth(),
                                todayDate.getDate(),
                                23, 1, 0);

        if(jsonTime.getTime() < (todayDate.getTime() + 86400000)) {
          if(jsonTime.getTime() < todayMorning.getTime()) {
            temperatureMorning.push(parseFloat(weatherData.timeSeries[i].parameters[1].values));
          };
          if( jsonTime.getTime() >= todayMorning.getTime() &&
              jsonTime.getTime() < todayDay.getTime()) {
            temperatureDay.push(parseFloat(weatherData.timeSeries[i].parameters[1].values));
          };
          if( jsonTime.getTime() >= todayDay.getTime() &&
              jsonTime.getTime() < todayNight.getTime()) {
            temperatureNight.push(parseFloat(weatherData.timeSeries[i].parameters[1].values));
          };
        };
      };

      writeWeather(temperatureMorning, temperatureDay, temperatureNight);
    };
  };
  xhttp.open("GET", weatherUrl, true);
  xhttp.send();
};

function getSum(total, num) {
  return total + num;
};

function averageTemp(tempArr) {
  if(tempArr.length > 0){
    return Math.round((tempArr.reduce(getSum)/tempArr.length)*10)/10;
  } else {
    return null;
  };
};
function writeWeather(morning, day, night) {
  if(averageTemp(morning) != null) {
    document.getElementById("weather").innerHTML = '<div class="morning-weather">Morgon: ' + averageTemp(morning) + '℃</div>';
  };

  if(averageTemp(day) != null) {
    document.getElementById("weather").innerHTML = '<div class="day-weather">Dag: ' + averageTemp(day) + '℃</div>';
  };

  if(averageTemp(night) != null) {
    document.getElementById("weather").innerHTML = '<div class="night-weather">Kväll: ' + averageTemp(night) + '℃</div>';
  };
};

function date() {
  var today;
  today = new Date().toLocaleDateString();
  document.getElementById("date").innerHTML = today;
};

function week() {
  var d = new Date();
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  document.getElementById("week").innerHTML = weekNo;
};

function time() {
  var date, h, m;
  today = new Date();
  h = today.getHours();
  m = today.getMinutes();
  if(m < 10){
    m = "0" + m;
  }
  if(h < 10){
    h = "0" + h;
  }
  document.getElementById("clock").innerHTML = h + ":" + m;
};
