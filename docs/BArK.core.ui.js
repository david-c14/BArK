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
		
		core.ui.containerElement = window.document.getElementById("BArK_container");
		
		const leftColumn = window.document.createElement("DIV");
		core.ui.containerElement.appendChild(leftColumn);
		const rightColumn = window.document.createElement("DIV");
		core.ui.containerElement.appendChild(rightColumn);
		
		// setup Tree
		
		core.ui.tree = _initTree();
		core.ui.tree.attach(leftColumn);
		const barkItem = core.ui.tree.addChild("BArK", "BArK");
		const modulesList = barkItem.addChild("Modules", "ModuleList");
		
		for (const [key, value] of Object.entries(core)) {
			if (typeof value == "object") {
				const module = modulesList.addChild(value.name + " v" + value.majorVersion + "." + value.minorVersion, "Module");
				module.setData("id", value.name);
			}
		}
		for (const [key, value] of Object.entries(BArK.modules)) {
			if (typeof value == "object") {
				const module = modulesList.addChild(value.name + " v" + value.majorVersion + "." + value.minorVersion, "Module");
				module.setData("id", value.name);
			}
		}
		
		core.ui.tree.addChild("Games", "GameList");
		
		// setup Toolbox
		
		core.ui.toolbox = _initToolbox(leftColumn);
		
		// setup Viewer
		
		_initViewer(rightColumn);
		
		// setup Tool
		
		_initTool(rightColumn);
		
	};
	
	core.ui.start = function(){
		core.ui.hooks.tree.attach(function(context) {
			if (context.getData("type") == "Module") {
				if (context.getData("id") == core.ui.name) {
					return _viewer_ui;
				}
			};
		});
	};
	
	function _viewer_ui(node) {
		node.innerText = "Core UI functionality";
	};
	
// Hooks

    function _initHooks() {
		_hooks = [];
		return {
			attach: function(hook) {
				_hooks.push(hook);
			},
			run: function(context) {
				core.ui.toolbox.clear();
				_viewer.innerHTML = "";
				var viewerFunction = null;
				_hooks.forEach(function(current) {
					viewerFunction = current(context) || viewerFunction;
				});
				if (viewerFunction) {
					viewerFunction(_viewer);
				}
			}
		};
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
	
	function _wrapTreeNode(node) {
		return {
			addChild: function(name, type) {
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
				const wrapper = _wrapTreeNode(item);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectNode(wrapper);
				});
				item.setAttribute("data-type", type);
				const caret = window.document.createElement("SPAN");
				item.appendChild(caret);
				const textNode = window.document.createTextNode(name);
				item.appendChild(textNode);
				list.appendChild(item);
				return wrapper;
			},
			
			getData: function(key) {
				return node.getAttribute("data-" + key);
			},
			
			setData: function(key, value) {
				node.setAttribute("data-" + key, value);
			},
			
			select: function() {
				node.classList.add("select");
			},
			
			deselect: function() {
				node.classList.remove("select");
			},
		};
	}
	
	function _initTree() {
		var treeElement = window.document.createElement("UL");
		treeElement.id = "BArK_tree";
		
		var _tree = {
			attach: function(node) {
				node.appendChild(treeElement);
			},
			
			addChild: function(name, type) {
				const item = window.document.createElement("LI");
				const wrapper = _wrapTreeNode(item);
				item.addEventListener("click", function(event) {
					event.stopPropagation();
					_selectNode(wrapper);
				});
				item.setAttribute("data-type", type);
				const caret = window.document.createElement("SPAN");
				item.appendChild(caret);
				const textNode = window.document.createTextNode(name);
				item.appendChild(textNode);
				treeElement.appendChild(item);
				return wrapper;
			},
			
		};
		
		return _tree;
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

