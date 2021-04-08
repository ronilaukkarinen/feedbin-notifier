function setAlarm() {
	var interval = parseInt(localStorage['interval'], 10) || 15;

	chrome.alarms.create('feedbin-updater', {
		delayInMinutes: interval,
		periodInMinutes: interval
	});
	
	chrome.alarms.onAlarm.addListener(getNumberOfUnreadFeeds);
}

function getNumberOfUnreadFeeds(alarm) {
	if(alarm && alarm.name == 'feedbin-updater') {
		
		var user = localStorage["email"];
		var password = localStorage["password"];

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = handleStateChange;

		if(user == null || user == '' || password == null || password == '') {
			
			console.log('Request without credentials.')
			xhr.open('GET', 'https://api.feedbin.com/v2/unread_entries.json', true);

		} else {

			console.log('Request with credentials.')
			xhr.withCredentials = true;
			xhr.open('GET', 'https://api.feedbin.com/v2/unread_entries.json', true, user, password);

		}

		xhr.send();
	}
}

function handleStateChange()
{
	if(this.readyState == this.DONE) {

		if(this.status == 200 && this.responseText != null) {

			var numberOfFeeds = JSON.parse(this.responseText).length;
			updateIconOverlay(numberOfFeeds);

		} else {
			updateIconOverlay(null);
		}
	}
}

function updateIconOverlay(numberOfFeeds) {
	if(numberOfFeeds != null) {

		if(numberOfFeeds > 999) {

			chrome.browserAction.setBadgeText({ 'text': '999+' });

		} else if(numberOfFeeds == 0) {

			chrome.browserAction.setBadgeText({ 'text': '' });

		} else {

			chrome.browserAction.setBadgeText({ 'text': numberOfFeeds.toString() });

		}

		// Make background transparent
		chrome.browserAction.setBadgeBackgroundColor({ 'color': [0, 0, 0, 0] });
	} else {
		chrome.browserAction.setBadgeText({ 'text': '!' });

		// An error occurred, show the user by setting the background color to an opaque red.
		chrome.browserAction.setBadgeBackgroundColor({ 'color': [255, 0, 0, 255] });
	}
}

if (chrome.runtime && chrome.runtime.onStartup) {
	setAlarm();
	getNumberOfUnreadFeeds({name: 'feedbin-updater'});

	// Open feedbin.com on click on the button
	chrome.browserAction.onClicked.addListener(function(tab) {
		chrome.tabs.create({'url': 'https://feedbin.com'}, function(tab) {});
	});
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);

		if(request.refresh !== null && request.refresh) {

			getNumberOfUnreadFeeds({name: 'feedbin-updater'});

		} else if(request.newCount !== null) {

			updateIconOverlay(request.newCount);
			
		}
	}
);