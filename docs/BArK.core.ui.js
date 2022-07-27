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
		
		core.ui.helpKey = _helpKey;
		
	};
	
	core.ui.start = function(){
		core.ui.hooks.tree.attach(function(context) {
			if (context.type == "Module") {
				if (context.id == core.ui.name) {
					return _viewer_ui;
				}
			};
		});
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
				_resetViewer();
				var viewerFunction = null;
				_hooks.forEach(function(current) {
					viewerFunction = current(context) || viewerFunction;
				});
				if (viewerFunction) {
					viewerFunction(_viewer, context);
				}
				else {
					_defaultViewerFunction(_viewer, context);
				}
			}
		};
	}
	
	function _defaultViewerFunction(node, context) {
		const _h1 = window.document.createElement("H1");
		_h1.innerText = context.text;
		_h1.style.textAlign = "center";
		node.appendChild(_h1);
		for (i = 0; i < context.count; i++) {
			let _childNode = window.document.createElement("DIV");
			let _childContext = context.child(i);
			_childNode.innerText = _childContext.text;
			_childNode.classList.add("listItem");
			_childNode.addEventListener("click", function() {
				_childContext.openAndSelect();
			});
			node.appendChild(_childNode);
		}
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
	
	function _selectTreeNode(treeNode) {
		if (_currentTreeNode == treeNode) {
			return;
		}
		_currentTreeNode?.deselect();
		treeNode.select();
	}
	
	function _wrapTreeNode(element, parent) {
		const children = [];
		
		const _treeNode = {
			addChild: function(name, type, id) {
				var list;
				if (element.childElementCount == 1) {
					const caret = element.querySelector("span");
					caret.classList.add("caret");
					caret.addEventListener("click", function() {
						this.classList.toggle("caret-down");
						if (this.classList.contains("caret-down")) {
							this.parentElement.querySelector(".nested").classList.add("active");
						}
						else {
							this.parentElement.querySelector(".nested").classList.remove("active");
						}
					});
					list = window.document.createElement("UL");
					list.classList.add("nested");
					element.appendChild(list);
				}
				else {
					list = element.querySelector("ul")
				}
				
				const item = window.document.createElement("LI");
				const treeNode = _wrapTreeNode(item, _treeNode);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectTreeNode(treeNode);
				});
				treeNode.type = type;
				treeNode.name = name;
				treeNode.id = id;
				const caret = window.document.createElement("SPAN");
				item.appendChild(caret);
				const textNode = window.document.createTextNode(name);
				item.appendChild(textNode);
				list.appendChild(item);
				children.push(treeNode);
				return treeNode;
			},
			
			select: function() {
				if (_currentTreeNode == _treeNode) {
					return;
				}
				_currentTreeNode?.deselect();
				element.classList.add("select");
				_currentTreeNode = _treeNode;
				core.ui.hooks.tree.run(_treeNode);
			},
			
			deselect: function() {
				element.classList.remove("select");
				_currentTreeNode = null;
			},
			
			get parent() {
				return parent;
			},
			
			get root() {
				var p = _treeNode;
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
				return _treeFind(_treeNode, search);
			},
			
			open: function() {
				element.querySelector("span.caret")?.classList.add("caret-down");
				element.querySelector(".nested")?.classList.add("active");
				element.parentElement.classList.add("active");
				if (_treeNode.parent != _treeNode.root) {
					_treeNode.parent.open();
				}
			},
			
			openAndSelect: function() {
				_treeNode.open();
				_selectTreeNode(_treeNode);
			},
			
			close: function() {
				element.querySelector("span").classList.remove("caret-down");
				element.querySelector(".nested").classList.remove("active");
				element.parentElement.classList.remove("active");
			},
			
			get text() {
				return element.childNodes[1].textContent;
			},
			
			set text(value) {
				element.childNodes[1].textContent = value;
			},
		
		};
		
		return _treeNode;
	}
	
	function _initTree() {
		const treeElement = window.document.createElement("UL");
		treeElement.id = "BArK_tree";
		
		const children = [];
		
		var _tree = {
			attach: function(node) {
				const containerElement = window.document.createElement("DIV");
				containerElement.setAttribute("data-name", "Explore");
				node.appendChild(containerElement);
				containerElement.appendChild(treeElement);
			},
			
			addChild: function(name, type, id) {
				const item = window.document.createElement("LI");
				const treeNode = _wrapTreeNode(item, _tree);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectTreeNode(treeNode);
				});
				treeNode.type = type;
				treeNode.name = name;
				treeNode.id = id;
				const caret = window.document.createElement("SPAN");
				item.appendChild(caret);
				const textNode = window.document.createTextNode(name);
				item.appendChild(textNode);
				treeElement.appendChild(item);
				children.push(treeNode);
				return treeNode;
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
	
	function _treeFind(treeNode, search) {
		if (search.length < 1) {
			return treeNode;
		}
		const split = search.split(".");
		search = split.shift();
		if (search.length < 1) {
			return treeNode;
		}
		for (var i = 0; i < treeNode.count; i++) {
			switch(search[0]) {
				case '#': // search by id
				if (treeNode.child(i).id == search.substr(1)) {
					return _treeFind(treeNode.child(i), split.join('.'));
				}
				break;
				case '@': // search by type
				if (treeNode.child(i).type == search.substr(1)) {
					return _treeFind(treeNode.child(i), split.join('.'));
				}
				break;
				default: // search by name
				if (treeNode.child(i).name == search) {
					return _treeFind(treeNode.child(i), split.join('.'));
				}
				break;
			}
		}
		return null;
	}

// Toolbox

	var _currentTool = null;

	function wrapTool(element) {
		return {
			name: function() {
				return element.innerText;
			},
			
			select: function() {
				element.classList.add("select");
			},
			
			deselect: function() {
				element.classList.remove("select");
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
		const name = callback(tool, _tool);
		_setToolName(name);
	}

	function _initToolbox(element) {
		const containerElement = window.document.createElement("DIV");
		containerElement.setAttribute("data-name", "Toolbox");
		element.appendChild(containerElement);
		var toolboxElement = window.document.createElement("DIV");
		toolboxElement.id = "BArK_toolbox";
		containerElement.appendChild(toolboxElement);
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
	var _viewerContainer = null;

	function _initViewer(element) {
		_viewerContainer = window.document.createElement("DIV");
		_viewerContainer.setAttribute("data-name", "Viewer");
		element.appendChild(_viewerContainer);
		_resetViewer();
	}
	
	function _resetViewer() {
		_viewerContainer.innerHTML = "";
		_viewer = window.document.createElement("DIV");
		_viewer.id = "BArK_viewer";
		_viewerContainer.appendChild(_viewer);
	}
	
// Tool

	var _tool = null;
	var _toolContainer = null;
	
	function _initTool(element) {
		_toolContainer = window.document.createElement("DIV");
		element.appendChild(_toolContainer);
		_resetTool();
		_setToolName("\u2005");
	}
	
	function _resetTool() {
		_toolContainer.innerHTML = "";
		_tool = window.document.createElement("DIV");
		_tool.id = "BArK_tool";
		_toolContainer.appendChild(_tool);
	}
	
	function _clearTool() {
		_resetTool();
		_setToolName("\u2005");
	}
	
	function _setToolName(name) {
		_tool.parentElement.setAttribute("data-name", name);
	}
	
	function _helpKey(tag) {
		const _help = window.document.createElement("A");
		_help.href = "https://github.com/david-c14/BArK/wiki/help_" + tag;
		_help.target = "_blank";
		_help.classList.add("help");
		_help.innerText = "?";
		_toolContainer.appendChild(_help);
	}

})();

