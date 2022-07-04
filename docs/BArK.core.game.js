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
		const _game = core.game.games.game(context.id);
		node.innerHTML = _game.title + "<br />Version: " + _game.versionNumber;
	}
	
	core.game.games = games();
	
	function games() {
		const _list = [];
		var _gameCount = 0;
		
		const _games = {
			add: function() {
				const _game = game("" + _gameCount++);
				_list.push(_game);
				return _game;
			},
			get count() {
				return _list.length;
			},
			game: function(index) {
				return _listItem(_list, index);
			},
		};
		return _games;
	}
	
	function game(id) {
		const _dialogs = dialogs();
		const _palettes = palettes();
		const _tiles = tiles();
		const _sprites = sprites();
		const _items = items();
		const _rooms = rooms();
		const _variables = variables();
		const _fonts = fonts();
		const _id = id;
		
		const _game = {
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
			
			get rooms() {
				return _rooms;
			},
			
			get variables() {
				return _variables;
			},
			
			get fonts() {
				return _fonts;
			},
			
			get id() {
				return _id;
			},
			
			versionNumber: 0,
			defaultFont: null,
			textDirection: null,
			fontData: null,
			
		};
		return _game;
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
			wall: tileData.isWall,
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
			get game() {
				return _game;
			},
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
			get game() {
				return _game;
			},
		};
		
		return _item;
	};
	
	function exits(room) {
		const _list = [];
		const _room = room;
		var _idGen = 0;
		
		const _exits = {
			add: function(exitData) {
				const _exit = exit(exitData, room, _idGen++);
				_list.push(_exit);
				return _exit;
			},
			
			get count() {
				return _list.length;
			},
			
			get room() {
				return _room;
			},
			
			exit: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _exits;
	}
	
	function exit(exitData, room, id) {
		const _room = room;
		const _exit = {
			id: id,
			x: exitData.x,
			y: exitData.y,
			dest: exitData.dest,
			transition_effect: exitData.transition_effect,
			dlg: exitData.dlg,
			get room() {
				return _room;
			},
			get label() {
				return _exit.id + " (" + _exit.x + "," + _exit.y + ")";
			},
		};
		
		return _exit;
	}
	
	function ends(room) {
		const _list = [];
		const _room = room;
		var _idGen = 0;
		
		const _ends = {
			add: function(endData) {
				const _end = end(endData, room, _idGen++);
				_list.push(_end);
				return _end;
			},
			
			get count() {
				return _list.length;
			},
			
			get room() {
				return _room;
			},
			
			end: function(index) {
				return _listItem(_list, index);
			},
			
		};
		
		return _ends;
	}
	
	function end(endData, room, id) {
		const _room = room;
		const _end = {
			id: id,
			dlg: endData.id,
			x: endData.x,
			y: endData.y,
			get room() {
				return _room;
			},
			get label() {
				return _end.id + " (" + _end.x + "," + _end.y + ")";
			},
		};
		
		return _end;
	}
	
	function rooms(game) {
		const _list = [];
		const _game = game;
		
		const _rooms = {
			add: function(roomData) {
				const _room = room(roomData, game);
				_list.push(_room);
				return _room;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			room: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _rooms;
	}
	
	function room(roomData, game) {
		const _game = game;
		const _room = {
			id: roomData.id,
			name: roomData.name,
			pal: roomData.pal,
			get ends() {
				return _ends;
			},
			get exits() {
				return _exits;
			},
			items: roomData.items,
			tilemap: roomData.tilemap,
			get game() {
				return _game;
			},
		};
		const _exits = exits(_room);
		for (let i = 0; i < roomData.exits.length; i++) {
			_exits.add(roomData.exits[i])
		}
		const _ends = ends(_room);
		for (let i = 0; i < roomData.ends.length; i++) {
			_ends.add(roomData.ends[i]);
		}
		
		return _room;
	}
	
	function variables(game) {
		const _list = [];
		const _game = game;
		
		const _variables = {
			add: function(id, value) {
				const _variable = variable(id, value, game);
				_list.push(_variable);
				return _variable;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			variable: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _variables;
	}
	
	function variable(id, value, game) {
		const _game = game;
		const _variable = {
			id: id,
			value: value,
			get game() {
				return _game;
			},
		};
		
		return _variable;
	}
	
	function fonts(game) {
		const _list = [];
		const _game = game;
		
		const _fonts = {
			add: function(id, data) {
				const _font = font(id, data, game);
				_list.push(_font);
				return _font;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			font: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _fonts;
	}
	
	function font(id, data, game) {
		const _game = game;
		const _font = {
			id: id,
			data: data,
			get game() {
				return _game;
			},
		};
		
		return _font;
	}

})();

