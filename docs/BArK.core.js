(function () {
	window.BArK = window.BArK || {};
	BArK.core = BArK.core || {};
	var core = BArK.core;
	core.start = function() {
		
		var modules = BArK.modules = BArK.modules || {};
		for (const [key, value] of Object.entries(core)) {
			if (typeof value == "object") {
				value.init();
			}
		}
		for (const [key, value] of Object.entries(core)) {
			if (typeof value == "object") {
				value.start();
			}
		}
		for (const [key, value] of Object.entries(modules)) {
			if (typeof value == "object") {
				value.init();
			}
		}
		for (const [key, value] of Object.entries(modules)) {
			if (typeof value == "object") {
				value.start();
			}
		}
		
		core.ui.hooks.tree.attach(function(context) {
			if (context.getData("type") == "BArK") {
				return _viewer_BArK;
			}
		});			
	};
	
	function _viewer_BArK(node) {
		node.innerText = "BArK"
	};
	
})();

