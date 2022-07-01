(function () {	window.BArK = window.BArK || {};	BArK.core = BArK.core || {};	var core = BArK.core;		core.writer = {};		core.writer.name = "BArK.core.writer";	core.writer.majorVersion = 0;		core.writer.minorVersion = 1;		core.writer.init = function(){	};		core.writer.start = function(){		core.ui.hooks.tree.attach(function(context) {			if (context.type == "Game") {				core.ui.toolbox.addTool("Game Data", function(tool, node) {					_tool_game_data(tool, node, context);				});			} else if (context.type == "Module") {				if (context.id == core.writer.name) {					return _viewer_writer_module;				}			};		});	};		function _viewer_writer_module(node) {		node.innerText = "Core Writer model";	};		function _tool_game_data(tool, node, context) {		node.setAttribute("data-name", "Game Data");		const textArea = window.document.createElement("TEXTAREA");		textArea.style.height="100px";		textArea.style.width="100%";		textArea.style.whiteSpace="pre";		node.appendChild(textArea);		const gameId = context.id;		const game = core.game.games[gameId];		const text = _write(game);				textArea.value = text;	};	function _write(game) {		var _text = game.title;		_text += "\n\n";		_text += "# BITSY VERSION " + game.version;		_text += "\n\n";		_text += "! ROOM FORMAT 1\n\n";				_text += _writePalettes(game.palettes);				return _text;	}		function _writePalettes(palettes) {		var _text = "";		for (let i = 0; i < palettes.count; i++) {			_text += _writePalette(palettes.palette(i));		}		return _text;	}		function _writePalette(palette) {		var _text = "PAL " + palette.id + "\n";		if (palette.name != null) {			_text += "NAME " + palette.name + "\n";		}		for (i in palette.colors) {			for (j in palette.colors[i]) {				_text += palette.colors[i][j];				if (j < 2) _text += ",";			}			_text += "\n";		}		_text += "\n";		return _text;	}		})();