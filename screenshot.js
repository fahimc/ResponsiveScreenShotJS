(function() {
	var ScreenCapture = {
		index : 0,
		page : null,
		system : null,
		URL : "",
		sitename : "",
		sizes : [[320, 480], [320, 568], [600, 1024], [1024, 768], [1280, 800], [1440, 900]],
		currentOrientation:"portrait",
		init : function() {
			this.page = require('webpage').create();
			this.system = require('system');
			//this.page.settings.userAgent = 'Chrome';
			console.log('The default user agent is ' + this.page.settings.userAgent);
			this.checkAddress();

		},
		checkAddress : function() {
			if (this.system.args.length < 2) {
				console.log("ERROR: No URL found");
				console.log("Usage: screenshot.js <some URL>");
				phantom.exit();
			} else {
				this.sitename = this.URL = (this.system.args[1]);

				this.sitename = this.sitename.replace("http://", "");
				this.sitename = this.sitename.replace("https://", "");
				this.sitename = this.sitename.replace("www.", "");
				this.sitename = this.sitename.replace(/\W/g, '');
				this.sitename = this.sitename.split(".")[0];
				console.log(this.sitename);

				this.next();
			}
		},
		next : function() {

			if (this.sizes[this.index]) {
				
				this.takeScreenShot();
			}else if(this.currentOrientation=='portrait'){
				this.currentOrientation='landscape';
				this.index=0;
				this.takeScreenShot();
			} else {
				console.log("DONE");
				phantom.exit();
			}
		},
		takeScreenShot : function() {
			this.page.viewportSize = {
				width : this.sizes[this.index][0],
				height : this.sizes[this.index][1]
			};
			this.page.zoomFactor = 1;
			this.page.paperSize ={ orientation: this.currentOrientation};
			
			var _this = this;
			this.page.open(this.URL, function() {
				_this.onPageLoad();
			});
		},
		onPageLoad : function() {
			var filename = this.currentOrientation+"_"+this.sizes[this.index][0] + 'x' + this.sizes[this.index][1] + '.png';
			var _this = this;
			console.log(filename);
			window.setTimeout(function() {
				_this.page.render("screenshots/" + _this.sitename + "/" + filename);
					_this.index++;
				_this.next();
			}, 2000);
		}
	};

	ScreenCapture.init();
})();
