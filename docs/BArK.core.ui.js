(function () {
	window.BArK = window.BArK || {};
	BArK.core = BArK.core || {};
	var core = BArK.core;

	core.ui = {};
	
	core.ui.name = "BArK.core.ui";

	core.ui.majorVersion = 0;
	
	core.ui.minorVersion = 1;
	
	core.ui.init = function(){
		
		// setup hooks
		
		core.ui.hooks = {
			tree: _initHooks(),
		};
		
		// setup animation
		
		core.ui.animation = {
			get tool() { return _currentToolAnimationHook; },
			set tool(callback) { _currentToolAnimationHook = callback; },
			get viewer() { return _currentViewerAnimationHook; },
			set viewer(callback) { _currentViewerAnimationHook = callback; },
			get tick() { return _lastTick; },
		};
		
		core.ui.containerElement = window.document.getElementById("BArK_container");
		
		const leftColumn = window.document.createElement("DIV");
		core.ui.containerElement.appendChild(leftColumn);
		const rightColumn = window.document.createElement("DIV");
		core.ui.containerElement.appendChild(rightColumn);
		
		// setup Tree
		
		core.ui.tree = _initTree();
		core.ui.tree.attach(leftColumn);
		const barkItem = core.ui.tree.addChild("BArK", "BArK", 0);
		const modulesList = barkItem.addChild("Modules", "ModuleList", 0);
		
		for (const [key, value] of Object.entries(core)) {
			if (typeof value == "object") {
				modulesList.addChild(value.name + " v" + value.majorVersion + "." + value.minorVersion, "Module", value.name);
			}
		}
		for (const [key, value] of Object.entries(BArK.modules)) {
			if (typeof value == "object") {
				modulesList.addChild(value.name + " v" + value.majorVersion + "." + value.minorVersion, "Module", value.name);
			}
		}
		
		core.ui.tree.addChild("Games", "GameList", 0);
		
		// setup Toolbox
		
		core.ui.toolbox = _initToolbox(leftColumn);
		
		// setup Viewer
		
		_initViewer(rightColumn);
		
		// setup Tool
		
		_initTool(rightColumn);
		
		// setup ui methods
		
		core.ui.HTMLColor = function(bitsyColor) {
			return "rgb(" + bitsyColor + ")";
		};
		
	};
	
	core.ui.start = function(){
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "Module") {
				if (context.id == core.ui.name) {
					return _viewer_ui;
				}
			};
		});
		
		const barkNode = core.ui.tree.find("BArK")
	};
	
	function _viewer_ui(node) {
		node.innerText = "Core UI functionality";
	};
	
// Hooks

	var _currentViewerAnimationHook = null;
	var _currentToolAnimationHook = null;

    function _initHooks() {
		_hooks = [];
		_setupAnimation();
		return {
			attach: function(hook) {
				_hooks.push(hook);
			},
			run: function(context) {
				_currentViewerAnimationHook = null;
				_currentToolAnimationHook = null;
				core.ui.toolbox.clear();
				_viewer.innerHTML = "";
				var viewerFunction = null;
				_hooks.forEach(function(current) {
					viewerFunction = current(context) || viewerFunction;
				});
				if (viewerFunction) {
					viewerFunction(_viewer, context);
				}
			}
		};
	}
	
	var _performanceOrigin = null;
	var _lastTick = 0;
	const _frameLength = 400; // in milliseconds
	
	function _setupAnimation() {
		_performanceOrigin = performance.now()
		window.requestAnimationFrame(_despatchAnimationHooks);
	}
	
	function _despatchAnimationHooks(now) {
		const delta = now - _performanceOrigin;
		const ticks = Math.floor(delta / _frameLength);
		if (ticks > _lastTick) {
			_lastTick = ticks;
			if (_currentToolAnimationHook != null) 
				_currentToolAnimationHook(_lastTick);
			if (_currentViewerAnimationHook != null)
				_currentViewerAnimationHook(_lastTick);
		}
		window.requestAnimationFrame(_despatchAnimationHooks);
	}

// Tree	

	var _currentTreeNode = null;
	
	function _selectNode(node) {
		if (_currentTreeNode == node) {
			return;
		}
		_currentTreeNode?.deselect();
		_currentTreeNode = node;
		_currentTreeNode.select();
		core.ui.hooks.tree.run(node);
	}
	
	function _wrapTreeNode(node, parent) {
		const children = [];
		
		const _wrapper = {
			addChild: function(name, type, id) {
				var list;
				if (node.childElementCount == 1) {
					const caret = node.querySelector("span");
					caret.classList.add("caret");
					caret.addEventListener("click", function() {
						this.parentElement.querySelector(".nested").classList.toggle("active");
						this.classList.toggle("caret-down");
					});
					list = window.document.createElement("UL");
					list.classList.add("nested");
					node.appendChild(list);
				}
				else {
					list = node.querySelector("ul")
				}
				
				const item = window.document.createElement("LI");
				const wrapper = _wrapTreeNode(item, _wrapper);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectNode(wrapper);
				});
				wrapper.type = type;
				wrapper.name = name;
				wrapper.id = id;
				const caret = window.document.createElement("SPAN");
				item.appendChild(caret);
				const textNode = window.document.createTextNode(name);
				item.appendChild(textNode);
				list.appendChild(item);
				children.push(wrapper);
				return wrapper;
			},
			
			select: function() {
				node.classList.add("select");
			},
			
			deselect: function() {
				node.classList.remove("select");
			},
			
			get parent() {
				return parent;
			},
			
			get root() {
				var p = _wrapper;
				while (p.parent) {
					p = p.parent;
				}
				return p;
			},
			
			get count() {
				return children.length;
			},
			
			child: function(index) {
				return children[index];
			},
			
			find: function(search) {
				return _treeFind(_wrapper, search);
			},
			
			open: function() {
				node.querySelector("span.caret")?.classList.add("caret-down");
				node.parentElement.classList.add("active");
				if (_wrapper.parent != _wrapper.root) {
					_wrapper.parent.open();
				}
			},
			
			openAndSelect: function() {
				_wrapper.open();
				_selectNode(_wrapper);
			},
			
			close: function() {
				node.querySelector("span").classList.remove("caret-down");
				node.parentElement.classList.remove("active");
			},
		
		};
		
		return _wrapper;
	}
	
	function _initTree() {
		const treeElement = window.document.createElement("UL");
		treeElement.id = "BArK_tree";
		
		const children = [];
		
		var _tree = {
			attach: function(node) {
				node.appendChild(treeElement);
			},
			
			addChild: function(name, type, id) {
				const item = window.document.createElement("LI");
				const wrapper = _wrapTreeNode(item, _tree);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectNode(wrapper);
				});
				wrapper.type = type;
				wrapper.name = name;
				wrapper.id = id;
				const caret = window.document.createElement("SPAN");
				item.appendChild(caret);
				const textNode = window.document.createTextNode(name);
				item.appendChild(textNode);
				treeElement.appendChild(item);
				children.push(wrapper);
				return wrapper;
			},
			
			get parent() {
				return null;
			},
			
			get root() {
				return _tree;
			},
			
			get count() {
				return children.length;
			},
			
			child: function(index) {
				return children[index];
			},
			
			find: function(search) {
				return _treeFind(_tree, search);
			},
			
		};
		
		return _tree;
	}
	
	function _treeFind(node, search) {
		if (search.length < 1) {
			return node;
		}
		const split = search.split(".");
		search = split.shift();
		if (search.length < 1) {
			return node;
		}
		for (var i = 0; i < node.count; i++) {
			switch(search[0]) {
				case '#': // search by id
				if (node.child(i).id == search.substr(1)) {
					return _treeFind(node.child(i), split.join('.'));
				}
				break;
				case '@': // search by type
				if (node.child(i).type == search.substr(1)) {
					return _treeFind(node.child(i), split.join('.'));
				}
				break;
				default: // search by name
				if (node.child(i).name == search) {
					return _treeFind(node.child(i), split.join('.'));
				}
				break;
			}
		}
		return null;
	}

// Toolbox

	var _currentTool = null;

	function wrapTool(node) {
		return {
			name: function() {
				return node.innerText;
			},
			
			select: function() {
				node.classList.add("select");
			},
			
			deselect: function() {
				node.classList.remove("select");
			}
		};
	};
	
	function _selectTool(tool, callback) {
		if (_currentTool == tool) {
			return;
		}
		_tool.innerHTML = "";
		_tool.setAttribute("data-name", "\u2005");
		_currentTool?.deselect();
		_currentTool = tool;
		_currentTool.select();
		callback(tool, _tool);
	}

	function _initToolbox(node) {
		var toolboxElement = window.document.createElement("DIV");
		toolboxElement.id = "BArK_toolbox";
		node.appendChild(toolboxElement);
		const tools = [];
		
		var _toolbox = {
			clear: function() {
				toolboxElement.innerHTML = "";
				while (tools.length > 0) {
					tools.pop();
				}
				_currentTool = null;
				_clearTool();
			},
			addTool: function(name, callback) {
				const item = window.document.createElement("DIV");
				item.innerText = name;
				toolboxElement.appendChild(item);
				const tool = wrapTool(item);
				tools.push(tool);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectTool(tool, callback);
				});
			},
		};
		
		return _toolbox;
	}
	
// Viewer	

	var _viewer = null;

	function _initViewer(node) {
		_viewer = window.document.createElement("DIV");
		_viewer.id = "BArK_viewer";
		node.appendChild(_viewer);
	}
	
// Tool

	var _tool = null;
	
	function _initTool(node) {
		_tool = window.document.createElement("DIV");
		_tool.id = "BArK_tool";
		_tool.setAttribute("data-name", "\u2005");
		node.appendChild(_tool);
	}
	
	function _clearTool() {
		_tool.innerHTML = "";
		_tool.setAttribute("data-name", "\u2005");
	}
	

})();

