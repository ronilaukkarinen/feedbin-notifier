// Saves options to localStorage
function saveOptions(evt) {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var interval = parseInt(document.getElementById('interval').value, 10);

	// Set values in localStorage
	localStorage['email'] = email;
	localStorage['password'] = password;
	localStorage['interval'] = interval;

	// Notify user
	var button = document.getElementById('close-button');
	button.addEventListener('click', function() {
		var box = this.parentNode;

		box.classList.add('hide-alert');
		box.classList.remove('show-alert');
	});
	
	var alert = document.getElementById('status');
	alert.classList.add('show-alert');
	alert.classList.remove('hide-alert');

	setTimeout(function() {
		alert.classList.add('hide-alert');
		alert.classList.remove('show-alert');
	}, 3000);

	// Recreate the alarm
	chrome.alarms.create('feedbin-updater', {
		delayInMinutes: interval,
		periodInMinutes: interval
	});
	
	refreshFeeds();
	
	evt.preventDefault();
	return false;
}

function matches(el, selector) {
	  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector)(selector);
}

// Restores options page state
function restoreOptions() {
	var email = localStorage["email"];
	var password = localStorage["password"];
	var interval = localStorage["interval"];

	// Set values
	if(email)
		document.getElementById('email').value = email;

	if(password)
		document.getElementById('password').value = password;

	if(interval)
		document.getElementById('interval').value = interval;
}

function refreshFeeds() {
	chrome.runtime.sendMessage({refresh: true}, function() {});
}

document.addEventListener('DOMContentLoaded', function(){
	restoreOptions();
	document.getElementById('settings').addEventListener('submit', saveOptions);
});