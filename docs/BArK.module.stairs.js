(function () {
	window.BArK = window.BArK || {};
	BArK.modules = BArK.modules || {};
	var modules = BArK.modules;
	var core;
	
	modules.stairs = {};
	
	modules.stairs.name = "BArK.module.stairs";

	modules.stairs.majorVersion = 0;
	
	modules.stairs.minorVersion = 1;
	
	modules.stairs.start = function(){
		core = BArK.core;
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "Module") {
				if (context.id == modules.stairs.name) {
					return _viewer_stairs_module;
				}
			} else if (context.type === "Room") {
				core.ui.toolbox.addTool("One-directional Stairway", function(tool, node) {
					_tool_stairway_1d(tool, node, context);
					return "Add One-directional Stairway";
				});
			}
		});
	};
	
	function _viewer_stairs_module(node) {
		node.innerText = "Building stairways";
	};
	
	
	function _tool_stairway_1d(tool, node, context) {
		const _game = core.game.games.game(context.parent.parent.id);
		const _room = _game.rooms.room(context.id);
		const stairwayEditor = _stairwayEditor(node, _room);
	};
	
	function _stairwayEditor(node, room) {
		const _palette = room.game.palettes.palette(room.pal);
		
		var startX = 7;
		var startY = 8;
		var endX = 0;
		var endY = 0;
		var length = 1;
		var xDiff = 1;
		var yDiff = -1
		_calcEnd();
		
		const _canvas = window.document.createElement("CANVAS");
		_canvas.width = 256;
		_canvas.height = 256;
		_canvas.style.width = "256px";
		_canvas.style.height = "256px";
		_canvas.style.float = "left";
		node.appendChild(_canvas);
		
		const _upButton = window.document.createElement("SPAN");
		_upButton.innerText = "Move Up";
		_upButton.classList.add("button");
		_upButton.addEventListener("click", function() {
			_moveUp();
		});
		node.appendChild(_upButton);

		node.appendChild(window.document.createElement("BR"));
		
		const _leftButton = window.document.createElement("SPAN");
		_leftButton.innerText = "Move Left";
		_leftButton.classList.add("button");
		_leftButton.addEventListener("click", function() {
			_moveLeft();
		});
		node.appendChild(_leftButton);
		
		const _rightButton = window.document.createElement("SPAN");
		_rightButton.innerText = "Move Right";
		_rightButton.classList.add("button");
		_rightButton.addEventListener("click", function() {
			_moveRight();
		});
		node.appendChild(_rightButton);

		node.appendChild(window.document.createElement("BR"));
		
		const _downButton = window.document.createElement("SPAN");
		_downButton.innerText = "Move Down";
		_downButton.classList.add("button");
		_downButton.addEventListener("click", function() {
			_moveDown();
		});
		node.appendChild(_downButton);
		
		node.appendChild(window.document.createElement("BR"));
		node.appendChild(window.document.createElement("BR"));
		
		const _longerButton = window.document.createElement("SPAN");
		_longerButton.innerText = "Longer";
		_longerButton.classList.add("button");
		_longerButton.addEventListener("click", function() {
			_longer();
		});
		node.appendChild(_longerButton);
		
		const _shorterButton = window.document.createElement("SPAN");
		_shorterButton.innerText = "Shorter";
		_shorterButton.classList.add("button");
		_shorterButton.addEventListener("click", function() {
			_shorter();
		});
		node.appendChild(_shorterButton);
		
		node.appendChild(window.document.createElement("BR"));
		node.appendChild(window.document.createElement("BR"));

		const _ulButton = window.document.createElement("SPAN");
		_ulButton.innerText = "Up + Left";
		_ulButton.classList.add("button");
		_ulButton.addEventListener("click", function() {
			_upLeft();
		});
		node.appendChild(_ulButton);
		
		const _urButton = window.document.createElement("SPAN");
		_urButton.innerText = "Up + Right";
		_urButton.classList.add("button");
		_urButton.addEventListener("click", function() {
			_upRight();
		});
		node.appendChild(_urButton);

		node.appendChild(window.document.createElement("BR"));

		const _dlButton = window.document.createElement("SPAN");
		_dlButton.innerText = "Down + Left";
		_dlButton.classList.add("button");
		_dlButton.addEventListener("click", function() {
			_downLeft();
		});
		node.appendChild(_dlButton);
		
		const _drButton = window.document.createElement("SPAN");
		_drButton.innerText = "Down + Right";
		_drButton.classList.add("button");
		_drButton.addEventListener("click", function() {
			_downRight();
		});
		node.appendChild(_drButton);
		
		node.appendChild(window.document.createElement("BR"));
		node.appendChild(window.document.createElement("BR"));

		const _goButton = window.document.createElement("SPAN");
		_goButton.innerText = "Make Stairs";
		_goButton.classList.add("button");
		_goButton.addEventListener("click", function() {
			_go();
		});
		node.appendChild(_goButton);

		const _clearDiv = window.document.createElement("DIV");
		_clearDiv.style.clear = "both";
		node.appendChild(_clearDiv);

		var maxY = room.tilemap.length;
		var maxX = room.tilemap[0].length;
		var cellWidth = _canvas.width / maxX;
		var cellHeight = _canvas.height / maxY;

		_draw();
		
		function _draw() {
			core.renderer.drawRoom(_canvas, room, _palette, 0);
			const _context = _canvas.getContext("2d");
			
			const sx = (startX + 0.5) * cellWidth;
			const sy = (startY + 0.5) * cellHeight;
			const ex = sx + xDiff * (length + 0.4) * cellWidth; 
			const ey = sy + yDiff * (length + 0.4) * cellHeight;
			
			
			_context.fillStyle = "#FF0000";
			_context.strokeStyle = "#FFFFFF";
			_context.lineWidth = cellWidth * 0.2;
			
			_context.beginPath();
			_context.moveTo(sx, sy);
			_context.lineTo(ex, ey);
			_context.stroke();
			
			_context.beginPath();
			_context.arc(sx, sy, cellWidth * 0.4, 0, 2 * Math.PI);
			_context.moveTo(ex, ey);
			_context.lineTo(ex - (cellWidth * xDiff * 0.8), ey);
			_context.lineTo(ex, ey - (cellHeight * yDiff * 0.8));
			_context.closePath();
			_context.fill();
			_context.stroke();
		}
		
		function _calcEnd() {
			endX = startX + (length * xDiff);
			endY = startY + (length * yDiff);
		}
		
		function _moveUp() {
			if (startY < 1)
				return;
			if (endY < 1)
				return;
			startY--;
			_calcEnd();
			_draw();
		}
		
		function _moveLeft() {
			if (startX < 1)
				return;
			if (endX < 1)
				return;
			startX--;
			_calcEnd();
			_draw();
		}
		
		function _moveDown() {
			if (startY > (maxY - 2))
				return;
			if (endY > (maxY - 2))
				return;
			startY++;
			_calcEnd();
			_draw();
		}
		
		function _moveRight() {
			if (startX > (maxX - 2))
				return;
			if (endX > (maxX - 2))
				return;
			startX++;
			_calcEnd();
			_draw();
		}
		
		function _longer() {
			length++;
			_calcEnd();
			if ((endX < 0) || (endX > (maxX - 1)) || (endY < 0) || (endY > (maxY - 1))) {
				length--;
				_calcEnd();
				return;
			}
			_draw();
		}
		
		function _shorter() {
			if (length < 2)
				return;
			length--;
			_calcEnd();
			_draw();
		}
		
		function _upLeft() {
			const oldX = xDiff;
			const oldY = yDiff;
			xDiff = -1;
			yDiff = -1;
			_calcEnd();
			if ((endX < 0) || (endY < 0)) {
				xDiff = oldX;
				xDiff = oldY;
				_calcEnd();
				return;
			}
			_draw();
		}
		
		function _upRight() {
			const oldX = xDiff;
			const oldY = yDiff;
			xDiff = 1;
			yDiff = -1;
			_calcEnd();
			if ((endX > (maxX - 1)) || (endY < 0)) {
				xDiff = oldX;
				yDiff = oldY;
				_calcEnd();
				return;
			}
			_draw();
		}
		
		function _downLeft() {
			const oldX = xDiff;
			const oldY = yDiff;
			xDiff = -1;
			yDiff = 1;
			_calcEnd();
			if ((endX < 0) || (endY > (maxY - 1))) {
				xDiff = oldX;
				yDiff = oldY;
				_calcEnd();
				return;
			}
			_draw();
		}
		
		function _downRight() {
			const oldX = xDiff;
			const oldY = yDiff;
			xDiff = 1;
			yDiff = 1;
			_calcEnd();
			if ((endX > (maxX - 1)) || (endY > (maxY - 1))) {
				xDiff = oldX;
				yDiff = oldY;
				_calcEnd();
				return;
			}
			_draw();
		}
		
		function _go() {
			const exitData = {
				transition_effect: null,
				dlg: null,
			};
			
			for (i = 0; i < length; i++) {
				exitData.x = startX + xDiff * i + xDiff;
				exitData.y = startY + yDiff * i;
				exitData.dest = {
					room: room.id,
					x: startX + xDiff * i + xDiff,
					y: startY + yDiff * i + yDiff,
				};
				room.exits.add(exitData);
				exitData.x -= xDiff;
				exitData.y += yDiff;
				room.exits.add(exitData);
			}

			const _message = window.document.createElement("DIV");
			_message.innerText = "Stairs of length " + length + " added";
			node.appendChild(_message);
		}

		const _editor = {
		};
		
		return _editor;
	}

})();

