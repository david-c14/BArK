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
				value.start();
			}
		}
		
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "BArK") {
				return _viewer_BArK;
			}
		});			

		const barkNode = core.ui.tree.find("BArK")
		
		barkNode.select();
	};

	function _viewer_BArK(node) {
		node.innerHTML = "<center><h1>BArK</h1><h2><em>B</em>itsy <em>Ar</em>my <em>K</em>nife</h2>Copyright &copy; 2022 carbon14 (David O'Rourke)<br/><br/></center>"
	};
	
})();

