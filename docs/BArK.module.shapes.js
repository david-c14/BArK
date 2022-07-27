(function () {
	window.BArK = window.BArK || {};
	BArK.modules = BArK.modules || {};
	var modules = BArK.modules;
	var core;
	
	modules.shapes = {};
	
	modules.shapes.name = "BArK.module.shapes";

	modules.shapes.majorVersion = 0;
	
	modules.shapes.minorVersion = 1;
	
	modules.shapes.start = function(){
		core = BArK.core;
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "Module") {
				if (context.id == modules.shapes.name) {
					return _viewer_shapes_module;
				}
			} else if (context.type === "Tile") {
				core.ui.toolbox.addTool("Edit Animation", function(tool, node) {
					_tool_animation_tile(tool, node, context);
					return "Edit Tile Animation";
				});
			} else if (context.type === "Sprite") {
				core.ui.toolbox.addTool("Edit Animation", function(tool, node) {
					_tool_animation_sprite(tool, node, context);
					return "Edit Sprite Animation";
				});
			} else if (context.type === "Item") {
				core.ui.toolbox.addTool("Edit Animation", function(tool, node) {
					_tool_animation_item(tool, node, context);
					return "Edit Item Animation";
				});
			}
			
			
		});
	};
	
	function _viewer_shapes_module(node) {
		node.innerText = "Tile, Sprite and Item editing";
	};
	
	const _blueprintBackground = "rgb(0,82,204)";
	const _blueprintForeground = "rgb(128,159,255)";
	
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
		core.ui.helpKey("module_shapes_editAnimation");
		
		var _selectedIndex = -1;
		
		const _addButton = window.document.createElement("SPAN");
		_addButton.innerText = "Add Frame";
		_addButton.classList.add("button");
		_addButton.addEventListener("click", function() { _addFrame();
		});
		node.appendChild(_addButton);

		const _delButton = window.document.createElement("SPAN");
		_delButton.innerText = "Remove Frame";
		_delButton.classList.add("button");
		_delButton.addEventListener("click", function() { _removeFrame();
		});
		node.appendChild(_delButton);

		const _upButton = window.document.createElement("SPAN");
		_upButton.innerText = "Move Frame Up";
		_upButton.classList.add("button");
		_upButton.addEventListener("click", function() { _moveUpFrame();
		});
		node.appendChild(_upButton);

		const _downButton = window.document.createElement("SPAN");
		_downButton.innerText = "Move Frame Down";
		_downButton.classList.add("button");
		_downButton.addEventListener("click", function() { _moveDownFrame();
		});
		node.appendChild(_downButton);
		
		const _div = window.document.createElement("DIV");
		_div.style.width="170px";
		_div.style.height="400px";
		_div.style.overflowY = "scroll";
		_div.style.marginLeft = "5px";
		_div.style.marginTop = "5px";
		node.appendChild(_div);
		_fillList();
		
		function _fillList() {
			_div.innerHTML = "";
			for(let i = 0; i < shape.frameList.length; i++) {
				const _canvas = window.document.createElement("CANVAS");
				_canvas.width = 128;
				_canvas.height = 128;
				_canvas.style.width = "128px";
				_canvas.style.height = "128px";
				_canvas.classList.add("list")
				_div.appendChild(_canvas);
				core.renderer.drawFrame(_canvas, shape.frameList[i], _blueprintBackground, _blueprintForeground);
				_canvas.addEventListener("click", function(event) {
					event.stopPropagation();
					_canvasClick(_canvas, event.offsetX, event.offsetY);
				});
			}
		}
		
		function _canvasClick(canvas, x, y) {
			for(let i = 0; i < _div.childElementCount; i++) {
				const child = _div.children[i];
				if (child === canvas) {
					if (_selectedIndex === i) {
						_canvasPaint(canvas, x, y)
					}
					else {
						_selectedIndex = i;
						_highlightSelected();
					}
				}
			}
		};
		
		function _highlightSelected() {
			for(let i = 0; i < _div.childElementCount; i++) {
				const child = _div.children[i];
				if (_selectedIndex === i) {
					child.classList.add("select");
					child.scrollIntoView();
				}
				else {
					child.classList.remove("select");
				}
			}
		}
		
		function _canvasPaint(canvas, fx, fy) {
			const x = Math.min(Math.max(Math.floor(fx / 16), 0), 7);
			const y = Math.min(Math.max(Math.floor(fy / 16), 0), 7);
			const pixel = shape.frameList[_selectedIndex][y][x];
			shape.frameList[_selectedIndex][y][x] = (pixel === 1)?0:1;
			core.renderer.drawFrame(canvas, shape.frameList[_selectedIndex], _blueprintBackground, _blueprintForeground);
		}
		
		function _addFrame() {
			var frame;
			if (_selectedIndex > -1)
				frame = shape.frameList[_selectedIndex];
			else 
				frame = shape.frameList[shape.frameList.length - 1];
			const newFrame = [];
			for (let y = 0; y < frame.length; y++) {
				const line = [];
				for (let x = 0; x < frame[y].length; x++) {
					line.push(frame[y][x]);
				}
				newFrame.push(line);
			}
			shape.frameList.push(newFrame);
			_fillList();
			_selectedIndex = shape.frameList.length - 1;
			_highlightSelected();
		}
		
		function _removeFrame() {
			if (shape.frameList.length < 2) {
				window.alert("You cannot remove the last frame");
				return;
			}
			if (_selectedIndex < 0) {
				window.alert("You must select a frame to remove");
				return;
			}
			shape.frameList.splice(_selectedIndex, 1);
			if (_selectedIndex >= shape.frameList.length) 
				_selectedIndex = shape.frameList.length - 1;
			_fillList();
			_highlightSelected();
		}
		
		function _moveUpFrame() {
			if (_selectedIndex < 0) {
				window.alert("You must select a frame to move");
				return;
			}
			if (_selectedIndex === 0) {
				window.alert("The selected frame is already the first frame");
				return;
			}
			const frame = shape.frameList[_selectedIndex];
			shape.frameList.splice(_selectedIndex, 1);
			_selectedIndex = _selectedIndex - 1;
			shape.frameList.splice(_selectedIndex, 0, frame);
			_fillList();
			_highlightSelected();
		}
		
		function _moveDownFrame() {
			if (_selectedIndex < 0) {
				window.alert("You must select a frame to move");
				return;
			}
			if (_selectedIndex >= shape.frameList.length - 1) {
				window.alert("The selected frame is already the last frame");
				return;
			}
			const frame = shape.frameList[_selectedIndex];
			shape.frameList.splice(_selectedIndex, 1);
			_selectedIndex = _selectedIndex + 1;
			shape.frameList.splice(_selectedIndex, 0, frame);
			_fillList();
			_highlightSelected();
		}
		
	}
	
})();

