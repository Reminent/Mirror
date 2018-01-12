window.onload = start_mirror;

function start_mirror() {
  weather();
  setInterval(function() {
    date();
    time();
    week();
  }, 500);
};

function weather() {
  var weatherUrl = "https://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/17/lat/62/data.json"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var weatherData = JSON.parse(this.responseText)
      var hej = "hej"
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

      document.getElementById("weather").innerHTML =  "temp morning: " + averageTemp(temperatureMorning) + "<br>" +
                                                      "temp day: " + averageTemp(temperatureDay) + "<br>" +
                                                      "temp night: " + averageTemp(temperatureNight);
    };
  };
  xhttp.open("GET", weatherUrl, true);
  xhttp.send();
};

function getSum(total, num) {
  return total + num;
}

function averageTemp(tempArr) {
  if(tempArr.length > 0){
    return Math.round((tempArr.reduce(getSum)/tempArr.length)*10)/10;
  };
}

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
  document.getElementById("time").innerHTML = h + ":" + m;
};

function calendar() {

};
