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
			add: function(treeNode) {
				const _game = game(treeNode, "" + _gameCount++);
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
	
	function game(treeNode, id) {
		const _treeNode = treeNode.addChild("", "Game", id);

		const _game = {
			get treeNode() {
				return _treeNode;
			},
			
			get title() {
				return _dialogs.dialog("title").src;
			},
			
			set title(title) {
				_dialogs.dialog("title").src = title;
				_treeNode.name = title;
				_treeNode.text = title;
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
			
			get tunes() {
				return _tunes;
			},
			
			get blips() {
				return _blips;
			},
			
			get id() {
				return _id;
			},
			
			versionNumber: 0,
			defaultFont: null,
			textDirection: null,
			fontData: null,
			textMode: "0",
			doc: null,
			
		};
		const _dialogs = dialogs(_game, _treeNode);
		const _palettes = palettes(_game, _treeNode);
		const _tiles = tiles(_game, _treeNode);
		const _sprites = sprites(_game, _treeNode);
		const _items = items(_game, _treeNode);
		const _rooms = rooms(_game, _treeNode);
		const _variables = variables(_game, _treeNode);
		const _fonts = fonts(_game, _treeNode);
		const _tunes = tunes(_game, _treeNode);
		const _blips = blips(_game, _treeNode);
		const _id = id;
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
	
	function dialogs(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Dialogs", "Dialogs", 0);
		
		const _dialogs = {
			add: function(id, src, name) {
				const _dialog = dialog(id, src, name, _game, _treeNode);
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

	function dialog(id, src, name, game, treeNode) {
		const _game = game;
		
		const _dialog = {
			id: id,
			src: src,
			name: name,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(name || id, "Dialog", id);
		return _dialog;
	};
	
	function palettes(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Palettes", "Palettes", 0);
		
		const _palettes = {
			add: function(id, name, colors) {
				const _palette = palette(id, name, colors, _game, _treeNode);
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
	
	function palette(id, name, colors, game, treeNode) {
		const _game = game;
		const _palette = {
			id: id,
			name: name,
			colors: colors,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		}
		const _treeNode = treeNode.addChild(name || id, "Palette", id);
		return _palette;
	};
	
	function tiles(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Tiles", "Tiles", 0);
		
		const _tiles = {
			add: function(tileData) {
				const _tile = tile(tileData, game, _treeNode);
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
	
	function tile(tileData, game, treeNode) {
		const _game = game;
		const _tile = { 
			id: tileData.id,
			name: tileData.name,
			color: tileData.col,
			bgc: tileData.bgc,
			isAnimated: tileData.animation.isAnimated,
			frameList: tileData.animation.frameList,
			frameIndex: tileData.animation.frameIndex,
			frameCount: tileData.animation.frameCount,
			wall: tileData.isWall,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(_tile.name || _tile.id, "Tile", _tile.id);
		return _tile;
	};
	
	function sprites(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Sprites", "Sprites", 0);
		
		const _sprites = {
			add: function(spriteData) {
				const _sprite = sprite(spriteData, game, _treeNode);
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
	
	function sprite(spriteData, game, treeNode) {
		const _game = game;
		const _sprite = {
			id: spriteData.id,
			name: spriteData.name,
			color: spriteData.col,
			bgc: spriteData.bgc,
			blip: spriteData.blip,
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
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(_sprite.name || _sprite.id, "Sprite", _sprite.id);
		
		return _sprite;
	};

	function items(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Items", "Items", 0);
		
		function _getNextId() {
			const _sortedList = _list.sort(function(a,b) { return parseInt(b.id, 36) - parseInt(a.id, 36); });
			if (_sortedList.length < 1) 
				return "0";
			let id = parseInt(_sortedList[0].id, 36);
			id++;
			return id.toString(36);
		};
		
		const _items = {
			add: function(itemData) {
				if (itemData.id === "") {
					itemData.id = _getNextId();
				}
				const _item = item(itemData, game, _treeNode);
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
	
	function item(itemData, game, treeNode) {
		const _game = game;
		const _item = {
			id: itemData.id,
			name: itemData.name,
			color: itemData.col,
			bgc: itemData.bgc,
			blip: itemData.blip,
			isAnimated: itemData.animation.isAnimated,
			frameList: itemData.animation.frameList,
			frameIndex: itemData.animation.frameIndex,
			frameCount: itemData.animation.frameCount,
			dlg: itemData.dlg,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(_item.name || _item.id, "Item", _item.id);
		
		return _item;
	};
	
	function exits(room, treeNode) {
		const _list = [];
		const _room = room;
		const _treeNode = treeNode.addChild("Exits", "Exits", 0);
		var _idGen = 0;
		
		const _exits = {
			add: function(exitData) {
				const _exit = exit(exitData, room, _idGen++, _treeNode);
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
	
	function exit(exitData, room, id, treeNode) {
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
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(_exit.label, "Exit", _exit.id);
		return _exit;
	}
	
	function ends(room, treeNode) {
		const _list = [];
		const _room = room;
		const _treeNode = treeNode.addChild("Endings", "Endings", 0);
		var _idGen = 0;
		
		const _ends = {
			add: function(endData) {
				const _end = end(endData, room, _idGen++, _treeNode);
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
	
	function end(endData, room, id, treeNode) {
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
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(_end.label, "Ending", _end.id);
		return _end;
	}
	
	function rooms(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Rooms", "Rooms", 0);
		
		const _rooms = {
			add: function(roomData) {
				const _room = room(roomData, game, _treeNode);
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
	
	function room(roomData, game, treeNode) {
		const _game = game;
		const _room = {
			id: roomData.id,
			name: roomData.name,
			pal: roomData.pal,
			avatar: roomData.avatar,
			tune: roomData.tune,
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
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(_room.name || _room.id, "Room", _room.id);
		const _exits = exits(_room, _treeNode);
		for (let i = 0; i < roomData.exits.length; i++) {
			_exits.add(roomData.exits[i])
		}
		const _ends = ends(_room, _treeNode);
		for (let i = 0; i < roomData.ends.length; i++) {
			_ends.add(roomData.ends[i]);
		}
		
		return _room;
	}
	
	function variables(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Variables", "Variables", 0);
		
		const _variables = {
			add: function(id, value) {
				const _variable = variable(id, value, game, _treeNode);
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
	
	function variable(id, value, game, treeNode) {
		const _game = game;
		const _variable = {
			id: id,
			value: value,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(id, "Variable", id);
		return _variable;
	}
	
	function fonts(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Fonts", "Fonts", 0);
		
		const _fonts = {
			add: function(id, data) {
				const _font = font(id, data, game, _treeNode);
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
	
	function font(id, data, game, treeNode) {
		const _game = game;
		const _font = {
			id: id,
			data: data,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(id, "Font", id);
		
		return _font;
	}
	
	function tunes(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Tunes", "Tunes", 0);
		
		const _tunes = {
			add: function(id, data) {
				const _tune = tune(id, data, game, _treeNode);
				_list.push(_tune);
				return _tune;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			tune: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _tunes;
	}
	
	function tune(id, data, game, treeNode) {
		const _game = game;
		const _tune = {
			id: id,
			data: data,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(id, "Tune", id);
		
		return _tune;
	}
	
	function blips(game, treeNode) {
		const _list = [];
		const _game = game;
		const _treeNode = treeNode.addChild("Blips", "Blips", 0);
		
		const _blips = {
			add: function(id, data) {
				const _blip = blip(id, data, game, _treeNode);
				_list.push(_blip);
				return _blip;
			},
			
			get count() {
				return _list.length;
			},
			
			get game() {
				return _game;
			},
			
			blip: function(index) {
				return _listItem(_list, index);
			},
		};
		
		return _blips;
	}
	
	function blip(id, data, game, treeNode) {
		const _game = game;
		const _blip = {
			id: id,
			data: data,
			get game() {
				return _game;
			},
			get treeNode() {
				return _treeNode;
			},
		};
		const _treeNode = treeNode.addChild(id, "Blip", id);
		
		return _blip;
	}

})();

