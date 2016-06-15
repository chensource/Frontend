	//用以解析查询字符串，然后返回包含所有参数的一个对象：
	function getQueryStringArgs() {
	    //取得查询字符串并去掉开头的问号
	    var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
	        //保存的数据对象
	        args = {},
	        //取得每一项 用 & 切割字符
	        items = qs.length ? qs.split("&") : [],
	        item = null,
	        name = null,
	        value = null,
	        //循环中使用
	        i = 0,
	        len = items.length;

	    for (i = 0; i < len; i++) {
	        item = items[i].split("=");
	        name = decodeURIComponent(item[0]);
	        value = decodeURIComponent(item[1]);
	        //
	        if (name.length) {
	            args[name] = value;
	        }
	    }
	    return args;
	}

	var client = function() {
	    var engine = {
	        //呈现引擎
	        ie: 0,
	        gecko: 0,
	        webkit: 0,
	        khtml: 0,
	        opera: 0,
	        //具体的版本号
	        ver: null
	    };

	    var browser = {
	        //浏览器
	        ie: 0,
	        firefox: 0,
	        safari: 0,
	        konq: 0,
	        opera: 0,
	        chrome: 0,
	        uc: 0,
	        //具体的版本号
	        ver: null
	    };

	    var system = {
	        //平台
	        win: false,
	        mac: false,
	        x11: false,
	        //移动设备
	        iphone: false,
	        ipod: false,
	        ipad: false,
	        ios: false,
	        android: false,
	        nokiaN: false,
	        winMobile: false,
	        //游戏版本
	        wii: false,
	        ps: false
	    };

	    //在此检测呈现引擎,浏览器,平台和设备
	    /**
	     * 先检测 Opera 浏览器.如果是Opera 浏览器.window.opera的值为true;
	     * 第二个检测的应该是　WebKit 代码首先将用户代理字符串保存在变量ua 中。然后通过正则表达式来测试其中是否包含字符串"AppleWebKit"，并使用捕获组来取得版本号
	     * 接下来要测试的呈现引擎是KHTML,由于KHTML 的版本号与后继的标记之间有一个空格，因此仍然要使用特殊的非空格字符来取得与版本有关的所有字符
	     * Gecko 的版本号位于字符串"rv:"与一个闭括号之间，因此为了提取出这个版本号
	     * IE 的版本号位于字符串"MSIE"的后面、一个分号的前面
	     */
	    var ua = navigator.userAgent;
	    if (window.opera) {
	        engine.ver = browser.ver = window.opera.version();
	        engine.opera = browser.opera = parseFloat(engine.ver);
	    } else if (/AppleWebKit\/(\S+)/.test(ua)) {
	        engine.ver = RegExp["$1"];
	        engine.webkit = parseFloat(engine.ver);

	        //确定是Chrome 还是 Safari
	        if (/Chrome\/(\S+)/.test(ua)) {
	            browser.ver = RegExp["$1"];
	            browser.chrome = parseFloat(browser.ver);
	        } else if (/UCBrowser\/(\S+)/.test(ua)) {
	            browser.ver = RegExp["$1"];
	            browser.uc = parseFloat(browser.ver);
	        } else if (/Version\/(\S+)/.test(ua)) {
	            browser.ver = RegExp["$1"];
	            browser.safari = parseFloat(browser.ver);
	        } else {
	            var safariVesion = 1;
	            if (engine.webkit < 100) {
	                safariVesion = 1;
	            } else if (engine.webkit < 312) {
	                safariVesion = 1.2;
	            } else if (engine.webkit < 412) {
	                safariVesion = 1.3;
	            } else {
	                safariVesion = 2;
	            }

	            browser.safari = browser.ver = safariVesion;
	        }
	    } else if (/KHTML\/(S+)/.test(ua)) {
	        engine.ver = browser.ver = RegExp["$1"];
	        engine.khtml = browser.konq = parseFloat(engine.ver);
	    } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
	        engine.ver = RegExp["$1"];
	        engine.gecko = parseFloat(engine.ver);

	        //确定是不是Firefox浏览器
	        if (/Firefox\/(\S+)/.test(ua)) {
	            browser.ver = RegExp["$1"];
	            browser.firefox = parseFloat(browser.ver);
	        }
	    } else if (/MSIE ([^;]+)/.test(ua)) {
	        engine.ver = browser.ver = RegExp["$1"];
	        engine.ie = browser.ie = parseFloat(engine.ver);
	    }

	    var platform = navigator.platform;
	    system.win = platform.indexOf("Win") == 0;
	    system.mac = platform.indexOf("Mac") == 0;
	    system.x11 = (platform.indexOf("X11") == 0 || platform.indexOf("Linux") == 0);
	    system.iphone = ua.indexOf("iPhone") > -1;
	    system.ipad = ua.indexOf("iPad") > -1;
	    system.ipod = ua.indexOf("iPod") > -1;
	    system.nokiaN = ua.indexOf("NokiaN") > -1;


	    if (system.win) {
	        if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
	            if (RegExp["$1"] == "NT") {
	                switch (RegExp["$2"]) {
	                    case "5.0":
	                        system.win = "2000";
	                        break;
	                    case "5.1":
	                        system.win = "XP";
	                        break;
	                    case "6.0":
	                        system.win = "Vista";
	                        break;
	                    case "6.1":
	                        system.win = "7";
	                        break;
	                    default:
	                        system.win = "NT";
	                        break;
	                }
	            } else if (RegExp["$1"] == "9x") {
	                system.win = "ME";
	            } else {
	                system.win = RegExp["$1"];
	            }
	        }
	    }

	    if (system.mac && ua.indexOf("Mobile") > -1) {
	        if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
	            system.ios = parseFloat(RegExp.$1.replace("_", "."));
	        } else {
	            system.ios = 2;
	        }
	    }

	    if (/Android (\d+\.\d+)/.test(ua)) {
	        system.android = parseFloat(RegExp["$1"]);
	    }

	    if (system.win == "CE") {
	        system.winMobile = system.win;
	    } else if (system.win == "Ph") {
	        if (/Windows Phone?OS (\d+\.\d+)/.test(ua)) {
	            system.win = "Phone";
	            system.winMobile = parseFloat(RegExp["$1"]);
	        }
	    }

	    system.wii = ua.indexOf("wii") > -1;
	    system.ps = /playstation/i.test(ua);

	    return {
	        engine: engine,
	        browser: browser,
	        system: system
	    };
	}();


	function outputAttribute(element) {
	    var pairs = new Array(),
	        attrName,
	        attrValue,
	        i,
	        len;

	    for (i = 0, len = element.attributes.length; i < len; i++) {
	        attrName = element.attributes[i].nodeName;
	        attrValue = element.attributes[i].nodeValue;
	        if (element.attributes[i].specified) {
	            pairs.push(attrName + "=\"" + attrValue + "\"");
	        }
	    }

	    return pairs.join(",");
	}

	/**
	 * 动态加载 css 文件
	 * url : css 文件路径
	 */
	function loadStyles(url) {
	    var link = document.createElement("link");
	    link.rel = "stylesheet";
	    link.type = "text/css";
	    link.href = url;
	    var head = document.getElementsByTagName("head")[0];
	    head.appendChild(link);
	}

	var EventUtil = {
	    addHandler: function(element, type, handler) {
	        if (element.addEventListener) {
	            element.addEventListener(type, handler, false);
	        } else if (element.attachEvent) {
	            element.attachEvent("on" + 　type, handler);
	        } else {
	            element["on" + type] = handler;
	        }
	    },
	    removeHandler: function(element, type, handler) {
	        if (element.removeEventListener) {
	            element.removeEventListener(type, handler, false);
	        } else if (element.detachEvent) {
	            element.datachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = null;
	        }
	    },
	    getEvent: function(event) {
	        return event ? event : window.event;
	    },
	    getTarget: function(event) {
	        return event.getTarget || event.srcElement;
	    },
	    preventDefault: function(event) {
	        if (event.preventDefault) {
	            event.preventDefault();
	        } else {
	            event.returnValue = false;
	        }
	    },
	    stopPropagation: function(event) {
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        } else {
	            event.cancelBubble = true;
	        }
	    },
	    getWheelDelta: function(event) {
	        if (event.wheelDelta) {
	            return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
	        } else {
	            return -event.detail * 40;
	        }
	    },
	    getButton: function(event) {
	        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
	            return event.button;
	        } else {
	            switch (event.button) {
	                case 0:
	                case 1:
	                case 3:
	                case 5:
	                case 7:
	                    return 0;
	                case 2:
	                case 6:
	                    return 2;
	                case 4:
	                    return 1;
	            }
	        }
	    },
	    getCharCode: function(event) {
	        if (typeof event.charCode == "number") {
	            return event.charCode;
	        } else {
	            return event.keyCode;
	        }
	    },
	    getClipboardText: function(event) {
	        var clipboardData = (event.clipboardData || window.clipboardData);
	        return clipboardData.getData("text");
	    },
	    setClipboardText: function(event, value) {
	        if (event.clipboardData) {
	            return event.clipboardData.setData("text/plain", value);
	        } else if (window.clipboardData) {
	            return window.clipboardData.setData("text/plain", value);
	        }
	    }
	};

    //表单序列化
    function serialize(form) {
        var parts = [],
            field = null,
            i,
            len,
            j,
            optLen,
            option,
            optValue;
        for (i = 0, len = form.elements.length; i < len; i++) {
            field = form.elements[i];
            switch (field.type) {
                case "select-one":
                case "select-multiple":
                    if (field.name.length) {
                        for (j = 0, optLen = field.options.length; j < optLen; j++) {
                            option = field.options[j];
                            if (option.selected) {
                                optValue = "";
                                if (option.hasAttribute) {
                                    optValue = (option.hasAttribute("value") ? option.value : option.text);
                                } else {
                                    optValue = (option.attributes["value"].specified ? option.value : option.text);
                                }
                                parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
                            }
                        }
                    }
                    break;
                case undefined: //自段集
                case "file": //文件输入
                case "submit": //提交按钮
                case "reset": //重置按钮
                case "button": //自定义按钮
                    break;
                case "radio":
                case "checkbox":
                    if (!field.checked) {
                        break;
                    }
                default:
                    if (field.name.length) {
                        parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                    }
            }
        }
        return parts.join("&");
    }
