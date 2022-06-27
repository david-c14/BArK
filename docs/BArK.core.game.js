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
		const _tiles = tiles();
		const _sprites = sprites();
		const _items = items();
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
			
			get tiles() {
				return _tiles;
			},
			
			get sprites() {
				return _sprites;
			},
			
			get items() {
				return _items;
			},
			
			get id() {
				return _id;
			},
			
			versionNumber: 0,
			
		};
		games.push(game);
		return game;
	};
	
	function _listItem(list, index) {
		if (typeof index == "string") {
			for (var i = 0; i < list.length; i++) {
				if (list[i].id == index) {
					return list[i];
				}
			}
			return null;
		}
		return list[index];
	}
	
	function dialogs(game) {
		const _list = [];
		const _game = game;
		
		const _dialogs = {
			add: function(id, src, name) {
				const _dialog = dialog(id, src, name, _game);
				_list.push(_dialog);
				return _dialog;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			dialog: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _dialogs;
	};

	function dialog(id, src, name, game) {
		const _game = game;
		
		const _dialog = {
			id: id,
			src: src,
			name: name,
			get game() {
				return _game;
			},
		};
		return _dialog;
	};
	
	function palettes(game) {
		const _list = [];
		const _game = game;
		
		const _palettes = {
			add: function(id, name, colors) {
				const _palette = palette(id, name, colors, _game);
				_list.push(_palette);
				return _palette;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			palette: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _palettes;
	};
	
	function palette(id, name, colors, game) {
		const _game = game;
		const _palette = {
			id: id,
			name: name,
			colors: colors,
			get game() {
				return _game;
			},
		}
		return _palette;
	};
	
	function tiles(game) {
		const _list = [];
		const _game = game;
		
		const _tiles = {
			add: function(tileData) {
				const _tile = tile(tileData, game);
				_list.push(_tile);
				return _tile;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			tile: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _tiles;
	};
	
	function tile(tileData, game) {
		const _game = game;
		const _tile = { 
			id: tileData.id,
			name: tileData.name,
			color: tileData.col,
			isAnimated: tileData.animation.isAnimated,
			frameList: tileData.animation.frameList,
			frameIndex: tileData.animation.frameIndex,
			frameCount: tileData.animation.frameCount,
			wall: tileData.wall,
			get game() {
				return _game;
			},
		};
		
		return _tile;
	};
	
	function sprites(game) {
		const _list = [];
		const _game = game;
		
		const _sprites = {
			add: function(spriteData) {
				const _sprite = sprite(spriteData, game);
				_list.push(_sprite);
				return _sprite;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			sprite: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _sprites;
	};
	
	function sprite(spriteData, game) {
		const _game = game;
		const _sprite = {
			id: spriteData.id,
			name: spriteData.name,
			color: spriteData.col,
			isAnimated: spriteData.animation.isAnimated,
			frameList: spriteData.animation.frameList,
			frameIndex: spriteData.animation.frameIndex,
			frameCount: spriteData.animation.frameCount,
			room: spriteData.room,
			x: spriteData.x,
			y: spriteData.y,
			inventory: spriteData.inventory,
			dlg: spriteData.dlg,
		};
		
		return _sprite;
	};

	function items(game) {
		const _list = [];
		const _game = game;
		
		const _items = {
			add: function(itemData) {
				const _item = item(itemData, game);
				_list.push(_item);
				return _item;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			item: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _items;
	};
	
	function item(itemData, game) {
		const _game = game;
		const _item = {
			id: itemData.id,
			name: itemData.name,
			color: itemData.col,
			isAnimated: itemData.animation.isAnimated,
			frameList: itemData.animation.frameList,
			frameIndex: itemData.animation.frameIndex,
			frameCount: itemData.animation.frameCount,
			dlg: itemData.dlg,
		};
		
		return _item;
	};

})();

