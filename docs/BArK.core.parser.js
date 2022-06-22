(function () {
	window.BArK = window.BArK || {};
	BArK.core = BArK.core || {};
	var core = BArK.core;
	var gameCount = 0;
	
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
	
	var _sym = {
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
			else {
				i++;
			}
		}
		core.ui.tree.find("Games").addChild(game.title, "Game", gameCount++);
	}
	
	function _parseTitle(lines, i, game) {
		var results = _readDialogScript(lines,i);
		game.title = results.script;
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

	function _setTitle(titleSrc) {
		//dialog[titleDialogId] = { src:titleSrc, name:null };
	}
	
	/*
	TODO
	
	Add dialogs to Game so that I can set the title dialog as a dialog.
	
	Rework get title and set title to use the title dialog.
	
	*/
	
	
})();

