(function () {
	window.BArK = window.BArK || {};
	BArK.core = BArK.core || {};
	var core = BArK.core;

	core.game = {};
	
	core.game.name = "BArK.core.game";

	core.game.majorVersion = 0;
	
	core.game.minorVersion = 1;
	
	core.game.init = function(){
	};
	
	core.game.start = function(){
		core.ui.hooks.tree.attach(function(context) {
			if (context.getData("type") == "Module") {
				if (context.getData("id") == core.game.name) {
					return _viewer_game;
				}
			};
		});
	};
	
	function _viewer_game(node) {
		node.innerText = "Core Game model";
	};

	core.game.newGame = function() {
		var _title = "Write your game title here";
		const game = {
			get title() {
				return _title;
			},
			set title(title) {
				_title = title;
			},
		};

		return game;
	};
	
	

})();

