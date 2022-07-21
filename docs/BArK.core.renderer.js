(function () {
	window.BArK = window.BArK || {};
	BArK.core = BArK.core || {};
	var core = BArK.core;
	
	core.renderer = {};
	
	core.renderer.name = "BArK.core.renderer";

	core.renderer.majorVersion = 0;
	
	core.renderer.minorVersion = 1;
	
	core.renderer.init = function(){
	};
	
	core.renderer.start = function(){
		
		core.renderer.drawFrame = _drawFrame;
		
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "Module") {
				if (context.id == core.renderer.name) {
					return _viewer_renderer_module;
				}
			} else if (context.type === "Tile") {
				return _viewer_renderer_tile;
			} else if (context.type === "Sprite") {
				return _viewer_renderer_sprite;
			} else if (context.type === "Item") {
				return _viewer_renderer_item;
			} else if (context.type === "Room") {
				return _viewer_renderer_room;
			}
		});
	};
	
	function _viewer_renderer_module(node) {
		node.innerText = "Tile and Room Renderer";
	};
	
	const _blueprintBackground = "rgb(0,82,204)";
	const _blueprintForeground = "rgb(128,159,255)";
	
	function _viewer_renderer_tile(node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _tile = _game.tiles.tile(context.id);
		const _palette = _game.palettes.palette(0);
		let _fgColor = _tile.color;
		if (_fgColor >= _palette.colors.length) {
			_fgColor = _palette.colors.length - 1;
		}
		const _renderer = shapeRenderer(node, _tile, _palette.colors[0], _palette.colors[_fgColor]); 
		_renderer.draw();
	};

	function _viewer_renderer_sprite(node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _sprite = _game.sprites.sprite(context.id);
		const _palette = _game.palettes.palette(0);
		let _fgColor = _sprite.color;
		if (_fgColor >= _palette.colors.length) {
			_fgColor = _palette.colors.length - 1;
		}
		const _renderer = shapeRenderer(node, _sprite, _palette.colors[0], _palette.colors[_fgColor]); 
		_renderer.draw();
	};

	function _viewer_renderer_item(node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _item = _game.items.item(context.id);
		const _palette = _game.palettes.palette(0);
		let _fgColor = _item.color;
		if (_fgColor >= _palette.colors.length) {
			_fgColor = _palette.colors.length - 1;
		}
		const _renderer = shapeRenderer(node, _item, _palette.colors[0], _palette.colors[_fgColor]); 
		_renderer.draw();
	};
	
	function _viewer_renderer_room(node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _room = _game.rooms.room(context.id);
		const _palette = _game.palettes.palette(_room.pal);
		const _renderer = roomRenderer(node, _room, _palette);
		_renderer.draw();
	}
	
	function shapeRenderer(node, shape, backgroundColor, foregroundColor) {

		const _div = window.document.createElement("DIV");
		_div.style.width="256px";
		_div.style.height="256px";
		const _canvas = window.document.createElement("CANVAS");
		_canvas.width = 256;
		_canvas.height = 256;
		_canvas.style.width="100%";
		_canvas.style.height="100%";
		node.appendChild(_div);
		_div.appendChild(_canvas);

		var _bgColor = core.ui.HTMLColor(backgroundColor);
		var _fgColor = core.ui.HTMLColor(foregroundColor);
		var _frameIndex = core.ui.animation.tick % shape.frameList.length;
		
		const _shapeRenderer = {
			draw: function() {
				const _frame = shape.frameList[_frameIndex];
				_drawFrame(_canvas, _frame, _bgColor, _fgColor);
			},
		};
		
		core.ui.animation.tool = function(tick) {
			_frameIndex = tick % shape.frameList.length;
			_shapeRenderer.draw();
		};
		
		return _shapeRenderer;
	};
	
	function _drawFrame(canvas, frame, bg, fg) {
		const _context = canvas.getContext("2d");
		_context.fillStyle = bg;
		_context.fillRect(0, 0, canvas.width, canvas.height);
		_context.fillStyle = fg;
		const _maxY = frame.length;
		const _maxX = frame[0].length;
		for (let y = 0; y < _maxY; y++) {
			
			for (let x = 0; x < _maxX; x++) {
				if (frame[y][x] === 1) {
					_context.fillRect(canvas.width / _maxX * x, canvas.height / _maxY * y, canvas.width / _maxX, canvas.height / _maxY); 
				}
			}
		}
	}
	
	function roomRenderer(node, room, palette) {
		
		const _div = window.document.createElement("DIV");
		_div.style.width="384px";
		_div.style.height="384px";
		const _canvas = window.document.createElement("CANVAS");
		_canvas.width = 384;
		_canvas.height = 384;
		_canvas.style.width="100%";
		_canvas.style.height="100%";
		node.appendChild(_div);
		_div.appendChild(_canvas);
		
		var _tick = core.ui.animation.tick;

		const _roomRenderer = {
			draw: function() {
				_drawRoom(_canvas, room, palette, _tick);
			},
		};
		
		core.ui.animation.tool = function(tick) {
			_tick = tick
			_roomRenderer.draw();
		};
		
		return _roomRenderer;
	};
	
	function _drawRoom(canvas, room, palette, tick) {
		const _context = canvas.getContext("2d");
		_context.fillStyle = core.ui.HTMLColor(palette.colors[0]);
		_context.fillRect(0, 0, canvas.width, canvas.height);
		const _maxCellY = room.tilemap.length;
		const _maxCellX = room.tilemap[0].length;
		const width = canvas.width / _maxCellX;
		const height = canvas.height / _maxCellY;
		for (let y = 0; y < _maxCellY; y++) {
			for (let x = 0; x < _maxCellX; x++) {
				const left = width * x;
				const top = height * y;
				const tile = room.game.tiles.tile(room.tilemap[y][x]);
				if (tile === null) {
					continue;
				}
				var frameIndex = tick % tile.frameList.length;
				const frame = tile.frameList[frameIndex];
				const _maxY = frame.length;
				const _maxX = frame[0].length;
				const pixelWidth = width / _maxX;
				const pixelHeight = height / _maxY;
				var bgindex = tile.bgc;
				if (bgindex >= palette.colors.length) {
					bgindex = 0;
				}
				if (bgindex < 0) {
					bgindex = 0;
				}
				var fgindex = tile.color;
				if (fgindex >= palette.colors.length) {
					fgindex = palette.colors.length - 1;
				}
				const bg = core.ui.HTMLColor(palette.colors[bgindex]);
				const fg = core.ui.HTMLColor(palette.colors[fgindex]);
				_context.fillStyle = bg;
				_context.fillRect(left, top, width, height);
				_context.fillStyle = fg;
				for (let py = 0; py < _maxY; py++) {
					for (let px = 0; px < _maxX; px++) {
						if (frame[py][px] === 1) {
							_context.fillRect(left + pixelWidth * px, top + pixelHeight * py, pixelWidth, pixelHeight);
						}
					}
				}
			}
		}
	};
	
})();

