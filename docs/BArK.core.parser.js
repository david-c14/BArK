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
			if (context.getData("type") == "GameList") {
				core.ui.toolbox.addTool("Import Game", function(tool, node) {
					_tool_import_game(tool, node);
				});
			} else if (context.getData("type") == "Module") {
				if (context.getData("id") == core.parser.name) {
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
			node.setAttribute("data-name", "Loading please wait");
			const reader = new FileReader();
			reader.addEventListener("load", function() {
				_parseText(reader.result, dropBox);
				node.setAttribute("data-name", "Done");
			});
			reader.readAsText(droppedFiles[0]);
		});
		dropBox.addEventListener("paste", function(event) {
			event.stopPropagation();
			node.setAttribute("data-name", "Loading please wait");
			const text = event.clipboardData.getData("text/plain");
			_parseText(text, dropBox);
			node.setAttribute("data-name", "Done");
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
	
	function _parse(text) {
	}
})();

