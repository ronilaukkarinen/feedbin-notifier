(function()
{
	var _this = {
		target:document.getElementsByTagName('title')[0],
		oldValue:document.title
	};

	_this.onChange = function() {
		if(_this.oldValue !== document.title)
		{
			_this.oldValue = document.title;
			
			var match = document.title.match(/Feedbin(?: \((\d+)\))*/);

			if(match !== null && match.length > 1)
			{
				var unreadCount = 0;
				
				if(match[1] !== undefined) {
					unreadCount = match[1];
				}

				chrome.runtime.sendMessage({newCount: unreadCount}, function() {});
			} 
		}
	};

	_this.delay = function() {
		setTimeout(_this.onChange, 1);
	};

	_this.target.addEventListener('DOMSubtreeModified', _this.delay, false);
})()