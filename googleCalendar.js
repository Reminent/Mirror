function handleClientLoad() {
  gapi.load('client:auth2', initClient);
};

function initClient() {
  gapi.client.init({
    apiKey: googleApiKey,
    clientId: oauthClientId,
    discoveryDocs: discoveryDocs,
    scope: scopes
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
};

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    listUpcomingEvents();
  } else {
    gapi.auth2.getAuthInstance().signIn();
  }
};

function appendPre(title, calendarDate) {
  var pre = document.getElementById('calendar');
  var textContent = '<div class="calendar-entry">' +
                      '<div class="calendar-entry-title">' + title + '</div>' +
                      '<div class="calendar-entry-date">' + calendarDate + '</div>' +
                    '</div>';
  return textContent;
};

function listUpcomingEvents() {
  var today = new Date();
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': today.toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 5,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    var processedEvents = "";
    var pre = document.getElementById('calendar');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        processedEvents += appendPre(event.summary, when);
      }
      pre.innerHTML = processedEvents;
    } else {
      appendPre('No upcoming events found.');
    }
  });
};
