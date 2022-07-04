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
				return _viewer_renderer_tile;
			} else if (context.type === "Sprite") {
				return _viewer_renderer_sprite;
			} else if (context.type === "Item") {
				return _viewer_renderer_item;
			}
			
			
		});
	};
	
	function _viewer_renderer_module(node) {
		node.innerText = "Tile and Room Renderer";
	};
	
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

	function shapeRenderer(node, shape, backgroundColor, foregroundColor) {

		const _div = window.document.createElement("DIV");
		_div.style.width="600px";
		_div.style.height="600px";
		_div.style.overflow="auto";
		_div.style.resize="both";
		const _canvas = window.document.createElement("CANVAS");
		_canvas.style.width="100%";
		_canvas.style.height="100%";
		node.appendChild(_div);
		_div.appendChild(_canvas);

		var _bgColor = getHtmlColor(backgroundColor);
		var _fgColor = getHtmlColor(foregroundColor);
		
		const _shapeRenderer = {
			draw: function() {
				const _context = _canvas.getContext("2d");
				_context.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";
				_context.fillStyle = _bgColor;
				_context.fillRect(0, 0, _canvas.width, _canvas.height);
				_context.fillStyle = _fgColor;
				const _frame = shape.frameList[0];
				const _maxY = _frame.length;
				const _maxX = _frame[0].length;
				for (let y = 0; y < _maxY; y++) {
					
					for (let x = 0; x < _maxX; x++) {
						if (_frame[y][x] === 1) {
							_context.fillRect(_canvas.width / _maxX * x, _canvas.height / _maxY * y, _canvas.width / _maxX, _canvas.height / _maxY); 
						}
					}
				}
			},
		};
		
		return _shapeRenderer;
	};
	
	function getHtmlColor(bitsyColor) {
		return "rgb(" + bitsyColor + ")";
	};
	
})();

