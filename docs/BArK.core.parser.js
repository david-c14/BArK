(function () {
	window.BArK = window.BArK || {};
	BArK.core = BArK.core || {};
	var core = BArK.core;
	
	core.parser = {};
	
	core.parser.name = "BArK.core.parser";

	core.parser.majorVersion = 0;
	
	core.parser.minorVersion = 1;
	
	core.parser.init = function() { 
	};
	
	core.parser.start = function() { 
		core.ui.hooks.tree.attach(function(context) { 
			if (context.type == "GameList") {
				core.ui.toolbox.addTool("Import Game", function(tool, node) {
					_tool_import_game(tool, node);
				});
			} else if (context.type == "Module") {
				if (context.id == core.parser.name) {
					return _viewer_parser;
				}
			}
		});
	};
	
	function _viewer_parser(node) {
		node.innerText = "Bitsy Parser";
	}
	
	function _tool_import_game(tool, node) {
		node.setAttribute("data-name", "Import Game : Paste or drag game here");
		
		const dropBox = window.document.createElement("TEXTAREA");
		dropBox.style.height="100px";
		dropBox.style.width="100%";
		dropBox.addEventListener("dragover", function(event) {
			event.preventDefault();
			event.stopPropagation();
		});
		dropBox.addEventListener("drop", function(event) {
			event.preventDefault();
			event.stopPropagation();
			const droppedFiles = event.dataTransfer.files;
			if (droppedFiles.length != 1) {
				window.alert("Only 1 file at a time please");
				return;
			}
			const reader = new FileReader();
			reader.addEventListener("load", function() {
				_parseText(reader.result, dropBox);
			});
			reader.addEventListener("error", function() {
				window.alert(reader.error.message);
			});
			reader.readAsText(droppedFiles[0]);
		});
		dropBox.addEventListener("paste", function(event) {
			event.stopPropagation();
			const text = event.clipboardData.getData("text/plain");
			_parseText(text, dropBox);
		});
		node.appendChild(dropBox);
	}
	
	function _parseText(text, dropBox) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(text, "text/html");
		const gameData = doc.getElementById("exportedGameData");
		if (gameData) {
			_parse(gameData.text.slice(1));
			return;
		}
		_parse(text);
	}
	
	const _sym = {
		DialogOpen : '"""',
		DialogClose : '"""',
		CodeOpen : "{",
		CodeClose : "}",
		Linebreak : "\n",
		Separator : ":",
		List : "-",
		String : '"',
		ConditionEnd : "?",
		Else : "else",
		ElseExp : ":", 
		Set : "=",
		Operators : ["==", ">=", "<=", ">", "<", "-", "+", "/", "*"], 
	};	
	
	const _tilesize = 8;
	const _mapsize = 16;
	const _width = _mapsize * _tilesize;
	const _height = _mapsize * _tilesize;	
	
	function _parse(text) {
		const game = core.game.game();
		var lines = text.split("\n");
		var i = 0;

		while (i < lines.length) {
			var curLine = lines[i];

			if (i == 0) {
				var title;
				i = _parseTitle(lines, i, game);
			}
			else if (curLine.length <= 0 || curLine.charAt(0) === "#") {
				// collect version number (from a comment.. hacky I know)
				if (curLine.indexOf("# BITSY VERSION ") != -1) {
					game.versionNumber = parseFloat(curLine.replace("# BITSY VERSION ", ""));
				}

				//skip blank lines & comments
				i++;
			}
			else if (_getType(curLine) === "PAL") {
				const results = _parsePalette(lines, i);
				i = results.index;
				game.palettes.add(results.id, results.name, results.colors);
			}
			else if (_getType(curLine) === "TIL") {
				const results = _parseTile(lines, i);
				i = results.index;
				game.tiles.add(results.tileData);
			}
			else if (_getType(curLine) === "SPR") {
				const results = _parseSprite(lines, i);
				i = results.index;
				game.sprites.add(results.spriteData);
			}
			else if (_getType(curLine) === "ITM") {
				const results = _parseItem(lines, i);
				i = results.index;
				game.items.add(results.itemData);
			}
			else if (_getType(curLine) === "ROOM") {
				const results = _parseRoom(lines, i);
				i = results.index;
				game.rooms.add(results.roomData);
			}
			else if (_getType(curLine) === "DLG") {
				const results = _parseDialog(lines, i);
				i = results.index;
				game.dialogs.add(results.data.id, results.data.src, results.data.name);
			}
			else if (_getType(curLine) === "VAR") {
				const results = _parseVariable(lines, i);
				i = results.index;
				game.variables.add(results.id, results.value);
			}
			else {
				i++;
			}
		}
		
		const gameNode = core.ui.tree.find("Games").addChild(game.title, "Game", game.id);
		gameNode.openAndSelect();
		const palettesNode = gameNode.addChild("Palettes", "Palettes", 0);
		for(var i = 0; i < game.palettes.count; i++) {
			palettesNode.addChild(game.palettes.palette(i).name, "Palette", game.palettes.palette(i).id);
		}
		const tilesNode = gameNode.addChild("Tiles", "Tiles", 0);
		for(var i = 0; i < game.tiles.count; i++) {
			tilesNode.addChild(game.tiles.tile(i).name || game.tiles.tile(i).id, "Tile", game.tiles.tile(i).id);
		}
		const spritesNode = gameNode.addChild("Sprites", "Sprites", 0);
		for(var i = 0; i < game.sprites.count; i++) {
			spritesNode.addChild(game.sprites.sprite(i).name || game.sprites.sprite(i).id, "Sprite", game.sprites.sprite(i).id);
		}
		const itemsNode = gameNode.addChild("Items", "Items", 0);
		for(var i = 0; i < game.items.count; i++) {
			itemsNode.addChild(game.items.item(i).name || game.items.item(i).id, "Item", game.items.item(i).id);
		}
		const roomsNode = gameNode.addChild("Rooms", "Rooms", 0);
		for(var i = 0; i < game.rooms.count; i++) {
			const room = game.rooms.room(i);
			const roomNode = roomsNode.addChild(room.name || room.id, "Room", room.id);
			const exitsNode = roomNode.addChild("Exits", "Exit", 0);
			for(let j = 0; j < room.exits.count; j++) {
				exitsNode.addChild(room.exits.exit(j).label, "Exit", room.exits.exit(j).id);
			}
			const endsNode = roomNode.addChild("Endings", "Endings", 0);
			for(let j = 0; j < room.ends.count; j++) {
				endsNode.addChild(room.ends.end(j).label, "Ending", room.ends.end(j).id);
			}
		}
		const dialogsNode = gameNode.addChild("Dialogs", "Dialogs", 0);
		for(let i = 0; i < game.dialogs.count; i++) {
			dialogsNode.addChild(game.dialogs.dialog(i).name || game.dialogs.dialog(i).id, "Dialog", game.dialogs.dialog(i).id);
		}
		const varsNode = gameNode.addChild("Variables", "Variables", 0);
		for(let i = 0; i < game.variables.count; i++) {
			varsNode.addChild(game.variables.variable(i).id, "Variable", game.variables.variable(i).id);
		}
	}
	
	function _getType(line) {
		return _getArg(line,0);
	}

	function _getId(line) {
		return _getArg(line,1);
	}

	function _getArg(line,arg) {
		return line.split(" ")[arg];
	}

	function _getCoord(line,arg) {
		return _getArg(line,arg).split(",");
	}

	function _parseTitle(lines, i, game) {
		var results = _readDialogScript(lines,i);
		game.dialogs.add("title", results.script, null);
		i = results.index;

		i++;

		return i;
	}
	
	function _parsePalette(lines,i) { //todo this has to go first right now :(
		var id = _getId(lines[i]);
		i++;
		var colors = [];
		var name = null;
		while (i < lines.length && lines[i].length > 0) { //look for empty line
			var args = lines[i].split(" ");
			if (args[0] === "NAME") {
				name = lines[i].split(/\s(.+)/)[1];
			}
			else {
				var col = [];
				lines[i].split(",").forEach(function(i) {
					col.push(parseInt(i));
				});
				colors.push(col);
			}
			i++;
		}
		return { id: id, name: name, colors: colors, index:i };
	}
	
	function _parseTile(lines, i) {
		const id = _getId(lines[i]);
		const tileData = _createDrawingData("TIL", id);

		i++;

		// read & store tile image source
		const result = _parseDrawingCore(lines, i);
		i = result.index;
		
		tileData.animation.frameCount = result.frameList.length;
		tileData.animation.isAnimated = tileData.animation.frameCount > 1;
		tileData.animation.frameList = result.frameList;
		
		// read other properties
		while (i < lines.length && lines[i].length > 0) { // look for empty line
			if (_getType(lines[i]) === "COL") {
				tileData.col = parseInt(_getId(lines[i]));
			}
			else if (_getType(lines[i]) === "NAME") {
				/* NAME */
				tileData.name = lines[i].split(/\s(.+)/)[1];
			}
			else if (_getType(lines[i]) === "WAL") {
				var wallArg = _getArg(lines[i], 1);
				if (wallArg === "true") {
					tileData.isWall = true;
				}
				else if (wallArg === "false") {
					tileData.isWall = false;
				}
			}

			i++;
		}

		return { tileData: tileData, index: i };
	}
	
	function _parseSprite(lines, i) {
		const id = _getId(lines[i]);
		const spriteData = _createDrawingData("SPR", id);
		
		i++;
		
		// read & store sprite image source
		const result = _parseDrawingCore(lines, i);
		i = result.index;
		
		spriteData.animation.frameCount = result.frameList.length;
		spriteData.animation.isAnimated = spriteData.animation.frameCount > 1;
		spriteData.animation.frameList = result.frameList;
		
		// read other properties
		while (i < lines.length && lines[i].length > 0) { // look for empty line
			if (_getType(lines[i]) === "COL") {
				spriteData.col = parseInt(_getId(lines[i]));
			}
			else if (_getType(lines[i]) === "POS") {
				const posArgs = lines[i].split(" ");
				spriteData.room = posArgs[1];
				const coordArgs = posArgs[2].split(",");
				spriteData.x = parseInt(coordArgs[0]);
				spriteData.y = parseInt(coordArgs[1]);
			}
			else if (_getType(lines[i]) === "DLG") {
				spriteData.dlg = _getId(lines[i]);
			}
			else if (_getType(lines[i]) === "NAME") {
				spriteData.name = lines[i].split(/\s(.+)/)[1];
			}
			else if (_getType(lines[i]) === "ITM") {
				const itemId = _getId(lines[i]);
				const itemCount = parseFloat(_getArg(lines[i], 2));
				spriteData.inventory[itemId] = itemCount;
			}
			
			i++;
		};
		
		return { spriteData: spriteData, index: i };
		
	};

	function _parseItem(lines, i) {
		const id = _getId(lines[i]);
		const itemData = _createDrawingData("ITM", id);
		
		i++;
		
		// read & store item image source
		const result = _parseDrawingCore(lines, i);
		i = result.index;
		
		itemData.animation.frameCount = result.frameList.length;
		itemData.animation.isAnimated = itemData.animation.frameCount > 1;
		itemData.animation.frameList = result.frameList;
		
		// read other properties
		while (i < lines.length && lines[i].length > 0) { // look for empty line
			if (_getType(lines[i]) === "COL") {
				itemData.col = parseInt(_getId(lines[i]));
			}
			else if (_getType(lines[i]) === "DLG") {
				itemData.dlg = _getId(lines[i]);
			}
			else if (_getType(lines[i]) === "NAME") {
				itemData.name = lines[i].split(/\s(.+)/)[1];
			}
			
			i++;
		};
		
		return { itemData: itemData, index: i };
		
	};

	function _createDrawingData(type, id) {

		var drawingData = {
			type : type,
			id : id,
			name : null,
			col : (type === "TIL") ? 1 : 2,
			animation : {
				isAnimated : false,
				frameIndex : 0,
				frameCount : 1,
			},
		};

		// add type specific properties
		if (type === "TIL") {
			// default null value indicates it can vary from room to room (original version)
			drawingData.isWall = null;
		}

		if (type === "AVA" || type === "SPR") {
			// default sprite location is "offstage"
			drawingData.room = null;
			drawingData.x = -1;
			drawingData.y = -1;
			drawingData.inventory = {};
		}

		if (type === "AVA" || type === "SPR" || type === "ITM") {
			drawingData.dlg = null;
		}

		return drawingData;
	}

	function _parseDrawingCore(lines, i) {
		var frameList = []; //init list of frames
		frameList.push( [] ); //init first frame
		var frameIndex = 0;
		var y = 0;
		while ( y < _tilesize ) {
			var l = lines[i+y];
			var row = [];
			for (x = 0; x < _tilesize; x++) {
				row.push( parseInt( l.charAt(x) ) );
			}
			frameList[frameIndex].push( row );
			y++;

			if (y === _tilesize) {
				i = i + y;
				if ( lines[i] != undefined && lines[i].charAt(0) === ">" ) {
					// start next frame!
					frameList.push( [] );
					frameIndex++;
					//start the count over again for the next frame
					i++;
					y = 0;
				}
			}
		}

		return { frameList: frameList, index: i };
	};
	
	function _parseRoom(lines, i) {
		const id = _getId(lines[i]);
		const roomData = {
			id: id,
			tilemap: [],
			ends: [],
			exits: [],
			items: [],
			pal: null,
			name: null,
		};
		i++;
		
		const end = i + _mapsize;
		var y = 0;
		for (; i < end; i++) {
			roomData.tilemap.push( [] );
			const lineSep = lines[i].split(",");
			for (var x = 0; x < _mapsize; x++) {
				roomData.tilemap[y].push(lineSep[x]);
			}
			y++;
		}
		
		while (i < lines.length && lines[i].length > 0) { // look for empty line
			if (_getType(lines[i]) === "ITM") {
				const itemId = _getId(lines[i]);
				const itemCoord = lines[i].split(" ")[2].split(",");
				const item = {
					id: itemId,
					x: parseInt(itemCoord[0]),
					y: parseInt(itemCoord[1]),
				};
				roomData.items.push(item);
			}
			else if (_getType(lines[i]) === "EXT") {
				const exitArgs = lines[i].split(" ");
				const exitCoords = exitArgs[1].split(",");
				const destName = exitArgs[2];
				const destCoords = exitArgs[3].split(",");
				const exit = {
					x: parseInt(exitCoords[0]),
					y: parseInt(exitCoords[1]),
					dest: {
						room: destName,
						x: parseInt(destCoords[0]),
						y: parseInt(destCoords[1]),
					},
					transition_effect: null,
					dlg: null,
				};
				
				var exitArgIndex = 4;
				while (exitArgIndex < exitArgs.length) {
					if (exitArgs[exitArgIndex] == "FX") {
						exit.transition_effect = exitArgs[exitArgIndex + 1];
						exitArgIndex += 2;
					}
					else if (exitArgs[exitArgIndex] == "DLG") {
						exit.dlg = exitArgs[exitArgIndex + 1];
						exitArgIndex += 2;
					}
					else {
						exitArgIndex += 1;
					}
				}
				roomData.exits.push(exit);
			}
			else if (_getType(lines[i]) === "END") {
				const endId = _getId(lines[i]);
				const endCoords = _getCoord(lines[i], 2);
				const end = {
					id: endId,
					x: parseInt(endCoords[0]),
					y: parseInt(endCoords[1]),
				};
				
				roomData.ends.push(end);
			}
			else if (_getType(lines[i]) === "PAL") {
				roomData.pal = _getId(lines[i]);
			}
			else if (_getType(lines[i]) === "NAME") {
				const name = lines[i].split(/\s(.+)/)[1];
				roomData.name = name;
			}
			
			i++;
		}
		
		return { roomData: roomData, index: i };
		
	};
	
	function _readDialogScript(lines, i) {
		var scriptStr = "";
		if (lines[i] === _sym.DialogOpen) {
			scriptStr += lines[i] + "\n";
			i++;
			while(lines[i] != _sym.DialogClose) {
				scriptStr += lines[i] + "\n";
				i++;
			}
			scriptStr += lines[i];
			i++;
		}
		else {
			scriptStr += lines[i];
			i++;
		}
		return { script:scriptStr, index:i };
	}
	
	function _parseScript(lines, i) {
		const id = _getId(lines[i]);
		i++;
		
		const results = _readDialogScript(lines, i)
		i = results.index;
		
		const dialogData = {
			src: results.script,
			name: null,
			id: id,
		};
		
		return {data: dialogData, index: i};
	};
	
	function _parseDialog(lines, i) {
		const results = _parseScript(lines, i);
		i = results.index;
		if (lines[i].length > 0 && _getType(lines[i]) === "NAME") {
			results.data.name = lines[i].split(/\s(.+)/)[1];
			i++;
		}
		results.index = i;
		return results;
		
	};
	
	function _parseVariable(lines, i) {
		const id = _getId(lines[i]);
		i++;
		const value = lines[i];
		i++;
		return { id: id, value: value, index: i };
	};
	
})();

