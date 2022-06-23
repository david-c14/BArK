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
					return _viewer_game_module;
				}
			};
			if (context.type == "Game") {
				return _viewer_game;
			}
		});
	};
	
	function _viewer_game_module(node) {
		node.innerText = "Core Game model";
	};
	
	function _viewer_game(node, context) {
		const game = games[context.id];
		node.innerHTML = game.title + "<br />Version: " + game.versionNumber;
	}
	
	const games = [];
	var gameCount = 0;

	core.game.game = function() {
		const _dialogs = dialogs();
		const _palettes = palettes();
		const _id = gameCount++;
		
		const game = {
			get title() {
				return _dialogs.dialog("title").src;
			},
			
			set title(title) {
				_dialogs.dialog("title").src = title;
			},
			
			get dialogs() {
				return _dialogs;
			},
			
			get palettes() {
				return _palettes;
			},
			
			get id() {
				return _id;
			},
			
			versionNumber: 0,
			
		};
		games.push(game);
		return game;
	};
	
	function dialogs() {
		const _list = [];
		
		const _dialogs = {
			add: function(id, src, name) {
				const _dialog = dialog(id, src, name);
				_list.push(_dialog);
				return _dialog;
			},
			
			get count() {
				return _list.length;
			},
			
			dialog: function(index) {
				if (typeof index == "string") {
					for (var i = 0; i < _list.length; i++) {
						if (_list[i].id == index) {
							return _list[i];
						}
					}
					return null;
				}
				return _list[index];
			},
		};
		
		return _dialogs;
	};

	function dialog(id, src, name) {
		const _dialog = {
			id: id,
			src: src,
			name: name,
		};
		return _dialog;
	};
	
	function palettes() {
		const _list = [];
		
		const _palettes = {
			add: function(id, name, colors) {
				const _palette = palette(id, name, colors);
				_list.push(_palette);
				return _palette;
			},
			
			get count() {
				return _list.length;
			},
			
			palette: function(index) {
				if (typeof index == "string") {
					for (var i = 0; i < _list.length; i++) {
						if (_list[i].id == index) {
							return _list[i];
						}
					}
					return null;
				}
				return _list[index];
			},
		};
		
		return _palettes;
	}
	
	function palette(id, name, colors) {
		const _palette = {
			id: id,
			name: name,
			colors: colors,
		}
		return _palette;
	}

})();

