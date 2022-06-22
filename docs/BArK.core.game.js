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
			if (context.type == "Module") {
				if (context.id == core.game.name) {
					return _viewer_game;
				}
			};
		});
	};
	
	function _viewer_game(node) {
		node.innerText = "Core Game model";
	};

	core.game.game = function() {
		var _title = "Write your game title here";
		const _dialogs = dialogs();
		
		const game = {
			get title() {
				return _title;
			},
			
			set title(title) {
				_title = title;
			},
			
			get dialogs() {
				return _dialogs;
			},
			
		};

		return game;
	};
	
	function dialogs() {
		const _list = [];
		
		const _dialogs = {
			add: function() {
				const dialog = dialog();
				_list.push(dialog);
				return dialog;
			},
			
			get count() {
				return _list.length;
			},
			
			dialog: function(index) {
				return _list[index];
			},
		};
		
		return _dialogs;
	};
	
	function dialog() {
		const _dialog = {
		};
		return _dialog;
	};
	
	

})();

