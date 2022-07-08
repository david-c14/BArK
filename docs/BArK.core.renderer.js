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
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "Module") {
				if (context.id == core.renderer.name) {
					return _viewer_renderer_module;
				}
			} else if (context.type === "Tile") {
				core.ui.toolbox.addTool("Edit Animation", function(tool, node) {
					_tool_animation_tile(tool, node, context);
				});
				return _viewer_renderer_tile;
			} else if (context.type === "Sprite") {
				core.ui.toolbox.addTool("Edit Animation", function(tool, node) {
					_tool_animation_sprite(tool, node, context);
				});
				return _viewer_renderer_sprite;
			} else if (context.type === "Item") {
				core.ui.toolbox.addTool("Edit Animation", function(tool, node) {
					_tool_animation_item(tool, node, context);
				});
				return _viewer_renderer_item;
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
	
	function _tool_animation_tile(tool, node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _tile = _game.tiles.tile(context.id);
		const _animator = frameAnimator(node, _tile);
	};
	
	function _tool_animation_sprite(tool, node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _sprite = _game.sprites.sprite(context.id);
		const _animator = frameAnimator(node, _sprite);
	};
	
	function _tool_animation_item(tool, node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _item = _game.items.item(context.id);
		const _animator = frameAnimator(node, _item);
	};
	
	function frameAnimator(node, shape) {
		const _div = window.document.createElement("DIV");
		_div.style.width="80px";
		_div.style.height="400px";
		_div.style.overflowY = "scroll";
		node.appendChild(_div);
		for(let i = 0; i < shape.frameList.length; i++) {
			const _canvas = window.document.createElement("CANVAS");
			_canvas.style.width = "64px";
			_canvas.style.height = "64px";
			_div.appendChild(_canvas);
			_drawFrame(_canvas, shape.frameList[i], _blueprintBackground, _blueprintForeground);
		}
	}
	
	function shapeRenderer(node, shape, backgroundColor, foregroundColor) {

		const _div = window.document.createElement("DIV");
		_div.style.width="256px";
		_div.style.height="256px";
		const _canvas = window.document.createElement("CANVAS");
		_canvas.style.width="100%";
		_canvas.style.height="100%";
		node.appendChild(_div);
		_div.appendChild(_canvas);

		var _bgColor = getHtmlColor(backgroundColor);
		var _fgColor = getHtmlColor(foregroundColor);
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
		_context.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";
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
	
	function getHtmlColor(bitsyColor) {
		return "rgb(" + bitsyColor + ")";
	};
	
})();

