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
		const compatibilityFlags = {
			convertSayToPrint : false,
			combineEndingsWithDialog : false,
			convertImplicitSpriteDialogIds : false,
		};

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

					if (game.versionNumber < 5.0) {
						compatibilityFlags.convertSayToPrint = true;
					}

					if (game.versionNumber < 7.0) {
						compatibilityFlags.combineEndingsWithDialog = true;
						compatibilityFlags.convertImplicitSpriteDialogIds = true;
					}
				}

				//skip blank lines & comments
				i++;
			}
			else if (_getType(curLine) == "PAL") {
				const results = _parsePalette(lines, i);
				i = results.index;
				const palette = game.palettes.add(results.id, results.name, results.colors);
			}
			else if (_getType(curLine) == "TIL") {
				const results = _parseTile(lines, i);
				i = results.index;
				const tile = game.tiles.add(results.tileData);
			}
			else {
				i++;
			}
		}
		
		const gameNode = core.ui.tree.find("Games").addChild(game.title, "Game", game.id);
		gameNode.openAndSelect();
		const dialogsNode = gameNode.addChild("Dialogs", "Dialogs", 0);
		dialogsNode.addChild("title", "Dialog", "title");
		const palettesNode = gameNode.addChild("Palettes", "Palettes", 0);
		for(var i = 0; i < game.palettes.count; i++) {
			palettesNode.addChild(game.palettes.palette(i).name, "Palette", game.palettes.palette(i).id);
		}
		const tilesNode = gameNode.addChild("Tiles", "Tiles", 0);
		for(var i = 0; i < game.tiles.count; i++) {
			tilesNode.addChild(game.tiles.tile(i).name || game.tiles.tile(i).id, "Tile", game.tiles.tile(i).id);
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

	function _parseTitle(lines, i, game) {
		var results = _readDialogScript(lines,i);
		game.dialogs.add("title", results.script, null);
		i = results.index;

		i++;

		return i;
	}
	
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
		tileData.frameList = result.frameList;
		
		// read other properties
		while (i < lines.length && lines[i].length > 0) { // look for empty line
			if (_getType(lines[i]) === "COL") {
				tileData.col = parseInt(getId(lines[i]));
			}
			else if (_getType(lines[i]) === "NAME") {
				/* NAME */
				tileData.name = lines[i].split(/\s(.+)/)[1];
			}
			else if (_getType(lines[i]) === "WAL") {
				var wallArg = getArg(lines[i], 1);
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
	}


	
})();

