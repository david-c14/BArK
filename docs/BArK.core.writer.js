(function () {	window.BArK = window.BArK || {};	BArK.core = BArK.core || {};	var core = BArK.core;		core.writer = {};		core.writer.name = "BArK.core.writer";	core.writer.majorVersion = 0;		core.writer.minorVersion = 1;		core.writer.init = function(){	};		core.writer.start = function(){		core.ui.hooks.tree.attach(function(context) {			if (context.type == "Game") {				core.ui.toolbox.addTool("Game Data", function(tool, node) {					_tool_game_data(tool, node, context);				});			} else if (context.type == "Module") {				if (context.id == core.writer.name) {					return _viewer_writer_module;				}			};		});	};		function _viewer_writer_module(node) {		node.innerText = "Core Writer model";	};		function _tool_game_data(tool, node, context) {		node.setAttribute("data-name", "Game Data");		const textArea = window.document.createElement("TEXTAREA");		textArea.style.height="400px";		textArea.style.width="100%";		textArea.style.whiteSpace="pre";		node.appendChild(textArea);		const gameId = context.id;		const game = core.game.games[gameId];		const text = _write(game);				textArea.value = text;	};	function _write(game) {		var _text = game.title;		_text += "\n\n";		_text += "# BITSY VERSION " + game.version;		_text += "\n\n";		_text += "! ROOM FORMAT 1\n\n";				_text += _writePalettes(game.palettes);		_text += _writeRooms(game.rooms);		_text += _writeTiles(game.tiles);		_text += _writeSprites(game.sprites);		_text += _writeItems(game.items);		_text += _writeDialogs(game.dialogs);		_text += _writeVariables(game.variables);				return _text;	}		function _writePalettes(palettes) {		var _text = "";		for (let i = 0; i < palettes.count; i++) {			_text += _writePalette(palettes.palette(i));		}		return _text;	}		function _writePalette(palette) {		var _text = "PAL " + palette.id + "\n";		if (palette.name != null) {			_text += "NAME " + palette.name + "\n";		}		for (i in palette.colors) {			for (j in palette.colors[i]) {				_text += palette.colors[i][j];				if (j < 2) _text += ",";			}			_text += "\n";		}		_text += "\n";		return _text;	}		function _writeRooms(rooms) {		var _text = "";		for (let i = 0; i < rooms.count; i++) {			_text += _writeRoom(rooms.room(i));		}		return _text;	}		function _writeRoom(room) {		var _text = "ROOM " + room.id + "\n";		for (i in room.tilemap) {			for (j in room.tilemap[i]) {				_text += room.tilemap[i][j];				if (j < room.tilemap[i].length - 1) _text += ",";			}			_text += "\n";		}		if (room.name != null) {			_text += "NAME " + room.name + "\n";		}		for (i in room.items) {			const item = room.items[i];			_text += "ITM " + item.id + " " + item.x + "," + item.y + "\n";		}		for (let i = 0; i < room.exits.count; i++) {			const exit = room.exits.exit(i);			_text += "EXT " + exit.x + "," + exit.y + " " + exit.dest.room + " " + exit.dest.x + "," + exit.dest.y;			if (exit.transition_effect != null) {				_text += " FX " + exit.transition_effect;			}			if (exit.dlg != null) {				_text += " DLG " + exit.dlg;			}			_text += "\n";		}		for (let i = 0; i < room.ends.count; i++) {			const end = room.ends.end(i);			_text += "END " + end.dlg + " " + end.x + "," + end.y + "\n";		}		if (room.pal != null && room.pal != "default") {			_text += "PAL " + room.pal + "\n";		}		_text += "\n";		return _text;	}		function _writeTiles(tiles) {		var _text = "";		for (let i = 0; i < tiles.count; i++) {			_text += _writeTile(tiles.tile(i));		}		return _text;	}		function _writeTile(tile) {		var _text = "TIL " + tile.id + "\n";		_text += _writeDrawing(tile.frameList);		if (tile.name != null) {			_text += "NAME " + tile.name + "\n";		}		if (tile.wall != null) {			_text += "WAL " + tile.wall + "\n";		}		if (tile.col != null && tile.col != 1) {			_text += "COL " + tile.col + "\n";		}		_text += "\n";		return _text;	}		function _writeSprites(sprites) {		var _text = "";		for (let i = 0; i < sprites.count; i++) {			_text += _writeSprite(sprites.sprite(i));		}		return _text;	}		function _writeSprite(sprite) {		var _text = "SPR " + sprite.id + "\n";		_text += _writeDrawing(sprite.frameList);		if (sprite.name != null) {			_text += "NAME " + sprite.name + "\n";		}		if (sprite.dlg != null) {			_text += "DLG " + sprite.dlg + "\n";		}		if (sprite.room != null) {			_text += "POS " + sprite.room + " " + sprite.x + "," + sprite.y + "\n";		}		for (itemId in sprite.inventory) {			_text += "ITM " + itemId + " " + sprite.inventory[itemId] + "\n";		}		if (sprite.col != null && sprite.col != 2) {			_text += "COL " + sprite.col + "\n";		}		_text += "\n";		return _text;	}		function _writeItems(items) {		var _text = "";		for (let i = 0; i < items.count; i++) {			_text += _writeItem(items.item(i));		}		return _text;	}		function _writeItem(item) {		var _text = "ITM " + item.id + "\n";		_text += _writeDrawing(item.frameList);		if (item.name != null) {			_text += "NAME " + item.name + "\n";		}		if (item.dlg != null) {			_text += "DLG " + item.dlg + "\n";		}		if (item.col != null && item.col != 2) {			_text += "COL " + item.col + "\n";		}		_text += "\n";		return _text;	}		function _writeDrawing(frameList) {		var _text = "";		for (f in frameList) {			for (y in frameList[f]) {				for (x in frameList[f][y]) {					_text += frameList[f][y][x];				}				_text += "\n";			}			if (f < (frameList.length - 1)) _text += ">\n";		}		return _text;	}		function _writeDialogs(dialogs) {		var _text = "";		for (let i = 0; i < dialogs.count; i++) {			_text += _writeDialog(dialogs.dialog(i));		}		return _text;	}		function _writeDialog(dialog) {		var _text = "DLG " + dialog.id + "\n";		_text += dialog.src + "\n";		if (dialog.name != null) {			_text += "NAME " + dialog.name + "\n";		}		_text += "\n";		return _text;	}		function _writeVariables(variables) {		var _text = "";		for (let i = 0; i < variables.count; i++) {			_text += _writeVariable(variables.variable(i));		}		return _text;	}		function _writeVariable(variable) {		return "VAR " + variable.id + "\n" + variable.value + "\n\n";	}	})();