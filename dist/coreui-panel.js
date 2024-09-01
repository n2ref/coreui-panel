(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.CoreUI = global.CoreUI || {}, global.CoreUI.panel = factory()));
})(this, (function () { 'use strict';

    (function (f) {
      if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f();
      } else if (typeof define === "function" && define.amd) {
        define([], f);
      } else {
        var g;
        if (typeof window !== "undefined") {
          g = window;
        } else if (typeof global !== "undefined") {
          g = global;
        } else if (typeof self !== "undefined") {
          g = self;
        } else {
          g = this;
        }
        g.ejs = f();
      }
    })(function () {
      return function () {
        function r(e, n, t) {
          function o(i, f) {
            if (!n[i]) {
              if (!e[i]) {
                var c = "function" == typeof require && require;
                if (!f && c) return c(i, !0);
                if (u) return u(i, !0);
                var a = new Error("Cannot find module '" + i + "'");
                throw a.code = "MODULE_NOT_FOUND", a;
              }
              var p = n[i] = {
                exports: {}
              };
              e[i][0].call(p.exports, function (r) {
                var n = e[i][1][r];
                return o(n || r);
              }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
          }
          for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
          return o;
        }
        return r;
      }()({
        1: [function (require, module, exports) {

          var fs = require("fs");
          var path = require("path");
          var utils = require("./utils");
          var scopeOptionWarned = false;
          var _VERSION_STRING = require("../package.json").version;
          var _DEFAULT_OPEN_DELIMITER = "<";
          var _DEFAULT_CLOSE_DELIMITER = ">";
          var _DEFAULT_DELIMITER = "%";
          var _DEFAULT_LOCALS_NAME = "locals";
          var _NAME = "ejs";
          var _REGEX_STRING = "(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";
          var _OPTS_PASSABLE_WITH_DATA = ["delimiter", "scope", "context", "debug", "compileDebug", "client", "_with", "rmWhitespace", "strict", "filename", "async"];
          var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat("cache");
          var _BOM = /^\uFEFF/;
          var _JS_IDENTIFIER = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
          exports.cache = utils.cache;
          exports.fileLoader = fs.readFileSync;
          exports.localsName = _DEFAULT_LOCALS_NAME;
          exports.promiseImpl = new Function("return this;")().Promise;
          exports.resolveInclude = function (name, filename, isDir) {
            var dirname = path.dirname;
            var extname = path.extname;
            var resolve = path.resolve;
            var includePath = resolve(isDir ? filename : dirname(filename), name);
            var ext = extname(name);
            if (!ext) {
              includePath += ".ejs";
            }
            return includePath;
          };
          function resolvePaths(name, paths) {
            var filePath;
            if (paths.some(function (v) {
              filePath = exports.resolveInclude(name, v, true);
              return fs.existsSync(filePath);
            })) {
              return filePath;
            }
          }
          function getIncludePath(path, options) {
            var includePath;
            var filePath;
            var views = options.views;
            var match = /^[A-Za-z]+:\\|^\//.exec(path);
            if (match && match.length) {
              path = path.replace(/^\/*/, "");
              if (Array.isArray(options.root)) {
                includePath = resolvePaths(path, options.root);
              } else {
                includePath = exports.resolveInclude(path, options.root || "/", true);
              }
            } else {
              if (options.filename) {
                filePath = exports.resolveInclude(path, options.filename);
                if (fs.existsSync(filePath)) {
                  includePath = filePath;
                }
              }
              if (!includePath && Array.isArray(views)) {
                includePath = resolvePaths(path, views);
              }
              if (!includePath && typeof options.includer !== "function") {
                throw new Error('Could not find the include file "' + options.escapeFunction(path) + '"');
              }
            }
            return includePath;
          }
          function handleCache(options, template) {
            var func;
            var filename = options.filename;
            var hasTemplate = arguments.length > 1;
            if (options.cache) {
              if (!filename) {
                throw new Error("cache option requires a filename");
              }
              func = exports.cache.get(filename);
              if (func) {
                return func;
              }
              if (!hasTemplate) {
                template = fileLoader(filename).toString().replace(_BOM, "");
              }
            } else if (!hasTemplate) {
              if (!filename) {
                throw new Error("Internal EJS error: no file name or template " + "provided");
              }
              template = fileLoader(filename).toString().replace(_BOM, "");
            }
            func = exports.compile(template, options);
            if (options.cache) {
              exports.cache.set(filename, func);
            }
            return func;
          }
          function tryHandleCache(options, data, cb) {
            var result;
            if (!cb) {
              if (typeof exports.promiseImpl == "function") {
                return new exports.promiseImpl(function (resolve, reject) {
                  try {
                    result = handleCache(options)(data);
                    resolve(result);
                  } catch (err) {
                    reject(err);
                  }
                });
              } else {
                throw new Error("Please provide a callback function");
              }
            } else {
              try {
                result = handleCache(options)(data);
              } catch (err) {
                return cb(err);
              }
              cb(null, result);
            }
          }
          function fileLoader(filePath) {
            return exports.fileLoader(filePath);
          }
          function includeFile(path, options) {
            var opts = utils.shallowCopy(utils.createNullProtoObjWherePossible(), options);
            opts.filename = getIncludePath(path, opts);
            if (typeof options.includer === "function") {
              var includerResult = options.includer(path, opts.filename);
              if (includerResult) {
                if (includerResult.filename) {
                  opts.filename = includerResult.filename;
                }
                if (includerResult.template) {
                  return handleCache(opts, includerResult.template);
                }
              }
            }
            return handleCache(opts);
          }
          function rethrow(err, str, flnm, lineno, esc) {
            var lines = str.split("\n");
            var start = Math.max(lineno - 3, 0);
            var end = Math.min(lines.length, lineno + 3);
            var filename = esc(flnm);
            var context = lines.slice(start, end).map(function (line, i) {
              var curr = i + start + 1;
              return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
            }).join("\n");
            err.path = filename;
            err.message = (filename || "ejs") + ":" + lineno + "\n" + context + "\n\n" + err.message;
            throw err;
          }
          function stripSemi(str) {
            return str.replace(/;(\s*$)/, "$1");
          }
          exports.compile = function compile(template, opts) {
            var templ;
            if (opts && opts.scope) {
              if (!scopeOptionWarned) {
                console.warn("`scope` option is deprecated and will be removed in EJS 3");
                scopeOptionWarned = true;
              }
              if (!opts.context) {
                opts.context = opts.scope;
              }
              delete opts.scope;
            }
            templ = new Template(template, opts);
            return templ.compile();
          };
          exports.render = function (template, d, o) {
            var data = d || utils.createNullProtoObjWherePossible();
            var opts = o || utils.createNullProtoObjWherePossible();
            if (arguments.length == 2) {
              utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
            }
            return handleCache(opts, template)(data);
          };
          exports.renderFile = function () {
            var args = Array.prototype.slice.call(arguments);
            var filename = args.shift();
            var cb;
            var opts = {
              filename: filename
            };
            var data;
            var viewOpts;
            if (typeof arguments[arguments.length - 1] == "function") {
              cb = args.pop();
            }
            if (args.length) {
              data = args.shift();
              if (args.length) {
                utils.shallowCopy(opts, args.pop());
              } else {
                if (data.settings) {
                  if (data.settings.views) {
                    opts.views = data.settings.views;
                  }
                  if (data.settings["view cache"]) {
                    opts.cache = true;
                  }
                  viewOpts = data.settings["view options"];
                  if (viewOpts) {
                    utils.shallowCopy(opts, viewOpts);
                  }
                }
                utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
              }
              opts.filename = filename;
            } else {
              data = utils.createNullProtoObjWherePossible();
            }
            return tryHandleCache(opts, data, cb);
          };
          exports.Template = Template;
          exports.clearCache = function () {
            exports.cache.reset();
          };
          function Template(text, optsParam) {
            var opts = utils.hasOwnOnlyObject(optsParam);
            var options = utils.createNullProtoObjWherePossible();
            this.templateText = text;
            this.mode = null;
            this.truncate = false;
            this.currentLine = 1;
            this.source = "";
            options.client = opts.client || false;
            options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
            options.compileDebug = opts.compileDebug !== false;
            options.debug = !!opts.debug;
            options.filename = opts.filename;
            options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
            options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
            options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
            options.strict = opts.strict || false;
            options.context = opts.context;
            options.cache = opts.cache || false;
            options.rmWhitespace = opts.rmWhitespace;
            options.root = opts.root;
            options.includer = opts.includer;
            options.outputFunctionName = opts.outputFunctionName;
            options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
            options.views = opts.views;
            options.async = opts.async;
            options.destructuredLocals = opts.destructuredLocals;
            options.legacyInclude = typeof opts.legacyInclude != "undefined" ? !!opts.legacyInclude : true;
            if (options.strict) {
              options._with = false;
            } else {
              options._with = typeof opts._with != "undefined" ? opts._with : true;
            }
            this.opts = options;
            this.regex = this.createRegex();
          }
          Template.modes = {
            EVAL: "eval",
            ESCAPED: "escaped",
            RAW: "raw",
            COMMENT: "comment",
            LITERAL: "literal"
          };
          Template.prototype = {
            createRegex: function () {
              var str = _REGEX_STRING;
              var delim = utils.escapeRegExpChars(this.opts.delimiter);
              var open = utils.escapeRegExpChars(this.opts.openDelimiter);
              var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
              str = str.replace(/%/g, delim).replace(/</g, open).replace(/>/g, close);
              return new RegExp(str);
            },
            compile: function () {
              var src;
              var fn;
              var opts = this.opts;
              var prepended = "";
              var appended = "";
              var escapeFn = opts.escapeFunction;
              var ctor;
              var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : "undefined";
              if (!this.source) {
                this.generateSource();
                prepended += '  var __output = "";\n' + "  function __append(s) { if (s !== undefined && s !== null) __output += s }\n";
                if (opts.outputFunctionName) {
                  if (!_JS_IDENTIFIER.test(opts.outputFunctionName)) {
                    throw new Error("outputFunctionName is not a valid JS identifier.");
                  }
                  prepended += "  var " + opts.outputFunctionName + " = __append;" + "\n";
                }
                if (opts.localsName && !_JS_IDENTIFIER.test(opts.localsName)) {
                  throw new Error("localsName is not a valid JS identifier.");
                }
                if (opts.destructuredLocals && opts.destructuredLocals.length) {
                  var destructuring = "  var __locals = (" + opts.localsName + " || {}),\n";
                  for (var i = 0; i < opts.destructuredLocals.length; i++) {
                    var name = opts.destructuredLocals[i];
                    if (!_JS_IDENTIFIER.test(name)) {
                      throw new Error("destructuredLocals[" + i + "] is not a valid JS identifier.");
                    }
                    if (i > 0) {
                      destructuring += ",\n  ";
                    }
                    destructuring += name + " = __locals." + name;
                  }
                  prepended += destructuring + ";\n";
                }
                if (opts._with !== false) {
                  prepended += "  with (" + opts.localsName + " || {}) {" + "\n";
                  appended += "  }" + "\n";
                }
                appended += "  return __output;" + "\n";
                this.source = prepended + this.source + appended;
              }
              if (opts.compileDebug) {
                src = "var __line = 1" + "\n" + "  , __lines = " + JSON.stringify(this.templateText) + "\n" + "  , __filename = " + sanitizedFilename + ";" + "\n" + "try {" + "\n" + this.source + "} catch (e) {" + "\n" + "  rethrow(e, __lines, __filename, __line, escapeFn);" + "\n" + "}" + "\n";
              } else {
                src = this.source;
              }
              if (opts.client) {
                src = "escapeFn = escapeFn || " + escapeFn.toString() + ";" + "\n" + src;
                if (opts.compileDebug) {
                  src = "rethrow = rethrow || " + rethrow.toString() + ";" + "\n" + src;
                }
              }
              if (opts.strict) {
                src = '"use strict";\n' + src;
              }
              if (opts.debug) {
                console.log(src);
              }
              if (opts.compileDebug && opts.filename) {
                src = src + "\n" + "//# sourceURL=" + sanitizedFilename + "\n";
              }
              try {
                if (opts.async) {
                  try {
                    ctor = new Function("return (async function(){}).constructor;")();
                  } catch (e) {
                    if (e instanceof SyntaxError) {
                      throw new Error("This environment does not support async/await");
                    } else {
                      throw e;
                    }
                  }
                } else {
                  ctor = Function;
                }
                fn = new ctor(opts.localsName + ", escapeFn, include, rethrow", src);
              } catch (e) {
                if (e instanceof SyntaxError) {
                  if (opts.filename) {
                    e.message += " in " + opts.filename;
                  }
                  e.message += " while compiling ejs\n\n";
                  e.message += "If the above error is not helpful, you may want to try EJS-Lint:\n";
                  e.message += "https://github.com/RyanZim/EJS-Lint";
                  if (!opts.async) {
                    e.message += "\n";
                    e.message += "Or, if you meant to create an async function, pass `async: true` as an option.";
                  }
                }
                throw e;
              }
              var returnedFn = opts.client ? fn : function anonymous(data) {
                var include = function (path, includeData) {
                  var d = utils.shallowCopy(utils.createNullProtoObjWherePossible(), data);
                  if (includeData) {
                    d = utils.shallowCopy(d, includeData);
                  }
                  return includeFile(path, opts)(d);
                };
                return fn.apply(opts.context, [data || utils.createNullProtoObjWherePossible(), escapeFn, include, rethrow]);
              };
              if (opts.filename && typeof Object.defineProperty === "function") {
                var filename = opts.filename;
                var basename = path.basename(filename, path.extname(filename));
                try {
                  Object.defineProperty(returnedFn, "name", {
                    value: basename,
                    writable: false,
                    enumerable: false,
                    configurable: true
                  });
                } catch (e) {}
              }
              return returnedFn;
            },
            generateSource: function () {
              var opts = this.opts;
              if (opts.rmWhitespace) {
                this.templateText = this.templateText.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
              }
              this.templateText = this.templateText.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
              var self = this;
              var matches = this.parseTemplateText();
              var d = this.opts.delimiter;
              var o = this.opts.openDelimiter;
              var c = this.opts.closeDelimiter;
              if (matches && matches.length) {
                matches.forEach(function (line, index) {
                  var closing;
                  if (line.indexOf(o + d) === 0 && line.indexOf(o + d + d) !== 0) {
                    closing = matches[index + 2];
                    if (!(closing == d + c || closing == "-" + d + c || closing == "_" + d + c)) {
                      throw new Error('Could not find matching close tag for "' + line + '".');
                    }
                  }
                  self.scanLine(line);
                });
              }
            },
            parseTemplateText: function () {
              var str = this.templateText;
              var pat = this.regex;
              var result = pat.exec(str);
              var arr = [];
              var firstPos;
              while (result) {
                firstPos = result.index;
                if (firstPos !== 0) {
                  arr.push(str.substring(0, firstPos));
                  str = str.slice(firstPos);
                }
                arr.push(result[0]);
                str = str.slice(result[0].length);
                result = pat.exec(str);
              }
              if (str) {
                arr.push(str);
              }
              return arr;
            },
            _addOutput: function (line) {
              if (this.truncate) {
                line = line.replace(/^(?:\r\n|\r|\n)/, "");
                this.truncate = false;
              }
              if (!line) {
                return line;
              }
              line = line.replace(/\\/g, "\\\\");
              line = line.replace(/\n/g, "\\n");
              line = line.replace(/\r/g, "\\r");
              line = line.replace(/"/g, '\\"');
              this.source += '    ; __append("' + line + '")' + "\n";
            },
            scanLine: function (line) {
              var self = this;
              var d = this.opts.delimiter;
              var o = this.opts.openDelimiter;
              var c = this.opts.closeDelimiter;
              var newLineCount = 0;
              newLineCount = line.split("\n").length - 1;
              switch (line) {
                case o + d:
                case o + d + "_":
                  this.mode = Template.modes.EVAL;
                  break;
                case o + d + "=":
                  this.mode = Template.modes.ESCAPED;
                  break;
                case o + d + "-":
                  this.mode = Template.modes.RAW;
                  break;
                case o + d + "#":
                  this.mode = Template.modes.COMMENT;
                  break;
                case o + d + d:
                  this.mode = Template.modes.LITERAL;
                  this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + "\n";
                  break;
                case d + d + c:
                  this.mode = Template.modes.LITERAL;
                  this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + "\n";
                  break;
                case d + c:
                case "-" + d + c:
                case "_" + d + c:
                  if (this.mode == Template.modes.LITERAL) {
                    this._addOutput(line);
                  }
                  this.mode = null;
                  this.truncate = line.indexOf("-") === 0 || line.indexOf("_") === 0;
                  break;
                default:
                  if (this.mode) {
                    switch (this.mode) {
                      case Template.modes.EVAL:
                      case Template.modes.ESCAPED:
                      case Template.modes.RAW:
                        if (line.lastIndexOf("//") > line.lastIndexOf("\n")) {
                          line += "\n";
                        }
                    }
                    switch (this.mode) {
                      case Template.modes.EVAL:
                        this.source += "    ; " + line + "\n";
                        break;
                      case Template.modes.ESCAPED:
                        this.source += "    ; __append(escapeFn(" + stripSemi(line) + "))" + "\n";
                        break;
                      case Template.modes.RAW:
                        this.source += "    ; __append(" + stripSemi(line) + ")" + "\n";
                        break;
                      case Template.modes.COMMENT:
                        break;
                      case Template.modes.LITERAL:
                        this._addOutput(line);
                        break;
                    }
                  } else {
                    this._addOutput(line);
                  }
              }
              if (self.opts.compileDebug && newLineCount) {
                this.currentLine += newLineCount;
                this.source += "    ; __line = " + this.currentLine + "\n";
              }
            }
          };
          exports.escapeXML = utils.escapeXML;
          exports.__express = exports.renderFile;
          exports.VERSION = _VERSION_STRING;
          exports.name = _NAME;
          if (typeof window != "undefined") {
            window.ejs = exports;
          }
        }, {
          "../package.json": 6,
          "./utils": 2,
          fs: 3,
          path: 4
        }],
        2: [function (require, module, exports) {

          var regExpChars = /[|\\{}()[\]^$+*?.]/g;
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var hasOwn = function (obj, key) {
            return hasOwnProperty.apply(obj, [key]);
          };
          exports.escapeRegExpChars = function (string) {
            if (!string) {
              return "";
            }
            return String(string).replace(regExpChars, "\\$&");
          };
          var _ENCODE_HTML_RULES = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&#34;",
            "'": "&#39;"
          };
          var _MATCH_HTML = /[&<>'"]/g;
          function encode_char(c) {
            return _ENCODE_HTML_RULES[c] || c;
          }
          var escapeFuncStr = "var _ENCODE_HTML_RULES = {\n" + '      "&": "&amp;"\n' + '    , "<": "&lt;"\n' + '    , ">": "&gt;"\n' + '    , \'"\': "&#34;"\n' + '    , "\'": "&#39;"\n' + "    }\n" + "  , _MATCH_HTML = /[&<>'\"]/g;\n" + "function encode_char(c) {\n" + "  return _ENCODE_HTML_RULES[c] || c;\n" + "};\n";
          exports.escapeXML = function (markup) {
            return markup == undefined ? "" : String(markup).replace(_MATCH_HTML, encode_char);
          };
          function escapeXMLToString() {
            return Function.prototype.toString.call(this) + ";\n" + escapeFuncStr;
          }
          try {
            if (typeof Object.defineProperty === "function") {
              Object.defineProperty(exports.escapeXML, "toString", {
                value: escapeXMLToString
              });
            } else {
              exports.escapeXML.toString = escapeXMLToString;
            }
          } catch (err) {
            console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)");
          }
          exports.shallowCopy = function (to, from) {
            from = from || {};
            if (to !== null && to !== undefined) {
              for (var p in from) {
                if (!hasOwn(from, p)) {
                  continue;
                }
                if (p === "__proto__" || p === "constructor") {
                  continue;
                }
                to[p] = from[p];
              }
            }
            return to;
          };
          exports.shallowCopyFromList = function (to, from, list) {
            list = list || [];
            from = from || {};
            if (to !== null && to !== undefined) {
              for (var i = 0; i < list.length; i++) {
                var p = list[i];
                if (typeof from[p] != "undefined") {
                  if (!hasOwn(from, p)) {
                    continue;
                  }
                  if (p === "__proto__" || p === "constructor") {
                    continue;
                  }
                  to[p] = from[p];
                }
              }
            }
            return to;
          };
          exports.cache = {
            _data: {},
            set: function (key, val) {
              this._data[key] = val;
            },
            get: function (key) {
              return this._data[key];
            },
            remove: function (key) {
              delete this._data[key];
            },
            reset: function () {
              this._data = {};
            }
          };
          exports.hyphenToCamel = function (str) {
            return str.replace(/-[a-z]/g, function (match) {
              return match[1].toUpperCase();
            });
          };
          exports.createNullProtoObjWherePossible = function () {
            if (typeof Object.create == "function") {
              return function () {
                return Object.create(null);
              };
            }
            if (!({
              __proto__: null
            } instanceof Object)) {
              return function () {
                return {
                  __proto__: null
                };
              };
            }
            return function () {
              return {};
            };
          }();
          exports.hasOwnOnlyObject = function (obj) {
            var o = exports.createNullProtoObjWherePossible();
            for (var p in obj) {
              if (hasOwn(obj, p)) {
                o[p] = obj[p];
              }
            }
            return o;
          };
        }, {}],
        3: [function (require, module, exports) {}, {}],
        4: [function (require, module, exports) {
          (function (process) {
            function normalizeArray(parts, allowAboveRoot) {
              var up = 0;
              for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                  parts.splice(i, 1);
                } else if (last === "..") {
                  parts.splice(i, 1);
                  up++;
                } else if (up) {
                  parts.splice(i, 1);
                  up--;
                }
              }
              if (allowAboveRoot) {
                for (; up--; up) {
                  parts.unshift("..");
                }
              }
              return parts;
            }
            exports.resolve = function () {
              var resolvedPath = "",
                resolvedAbsolute = false;
              for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path = i >= 0 ? arguments[i] : process.cwd();
                if (typeof path !== "string") {
                  throw new TypeError("Arguments to path.resolve must be strings");
                } else if (!path) {
                  continue;
                }
                resolvedPath = path + "/" + resolvedPath;
                resolvedAbsolute = path.charAt(0) === "/";
              }
              resolvedPath = normalizeArray(filter(resolvedPath.split("/"), function (p) {
                return !!p;
              }), !resolvedAbsolute).join("/");
              return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            };
            exports.normalize = function (path) {
              var isAbsolute = exports.isAbsolute(path),
                trailingSlash = substr(path, -1) === "/";
              path = normalizeArray(filter(path.split("/"), function (p) {
                return !!p;
              }), !isAbsolute).join("/");
              if (!path && !isAbsolute) {
                path = ".";
              }
              if (path && trailingSlash) {
                path += "/";
              }
              return (isAbsolute ? "/" : "") + path;
            };
            exports.isAbsolute = function (path) {
              return path.charAt(0) === "/";
            };
            exports.join = function () {
              var paths = Array.prototype.slice.call(arguments, 0);
              return exports.normalize(filter(paths, function (p, index) {
                if (typeof p !== "string") {
                  throw new TypeError("Arguments to path.join must be strings");
                }
                return p;
              }).join("/"));
            };
            exports.relative = function (from, to) {
              from = exports.resolve(from).substr(1);
              to = exports.resolve(to).substr(1);
              function trim(arr) {
                var start = 0;
                for (; start < arr.length; start++) {
                  if (arr[start] !== "") break;
                }
                var end = arr.length - 1;
                for (; end >= 0; end--) {
                  if (arr[end] !== "") break;
                }
                if (start > end) return [];
                return arr.slice(start, end - start + 1);
              }
              var fromParts = trim(from.split("/"));
              var toParts = trim(to.split("/"));
              var length = Math.min(fromParts.length, toParts.length);
              var samePartsLength = length;
              for (var i = 0; i < length; i++) {
                if (fromParts[i] !== toParts[i]) {
                  samePartsLength = i;
                  break;
                }
              }
              var outputParts = [];
              for (var i = samePartsLength; i < fromParts.length; i++) {
                outputParts.push("..");
              }
              outputParts = outputParts.concat(toParts.slice(samePartsLength));
              return outputParts.join("/");
            };
            exports.sep = "/";
            exports.delimiter = ":";
            exports.dirname = function (path) {
              if (typeof path !== "string") path = path + "";
              if (path.length === 0) return ".";
              var code = path.charCodeAt(0);
              var hasRoot = code === 47;
              var end = -1;
              var matchedSlash = true;
              for (var i = path.length - 1; i >= 1; --i) {
                code = path.charCodeAt(i);
                if (code === 47) {
                  if (!matchedSlash) {
                    end = i;
                    break;
                  }
                } else {
                  matchedSlash = false;
                }
              }
              if (end === -1) return hasRoot ? "/" : ".";
              if (hasRoot && end === 1) {
                return "/";
              }
              return path.slice(0, end);
            };
            function basename(path) {
              if (typeof path !== "string") path = path + "";
              var start = 0;
              var end = -1;
              var matchedSlash = true;
              var i;
              for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === 47) {
                  if (!matchedSlash) {
                    start = i + 1;
                    break;
                  }
                } else if (end === -1) {
                  matchedSlash = false;
                  end = i + 1;
                }
              }
              if (end === -1) return "";
              return path.slice(start, end);
            }
            exports.basename = function (path, ext) {
              var f = basename(path);
              if (ext && f.substr(-1 * ext.length) === ext) {
                f = f.substr(0, f.length - ext.length);
              }
              return f;
            };
            exports.extname = function (path) {
              if (typeof path !== "string") path = path + "";
              var startDot = -1;
              var startPart = 0;
              var end = -1;
              var matchedSlash = true;
              var preDotState = 0;
              for (var i = path.length - 1; i >= 0; --i) {
                var code = path.charCodeAt(i);
                if (code === 47) {
                  if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                  }
                  continue;
                }
                if (end === -1) {
                  matchedSlash = false;
                  end = i + 1;
                }
                if (code === 46) {
                  if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
                } else if (startDot !== -1) {
                  preDotState = -1;
                }
              }
              if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                return "";
              }
              return path.slice(startDot, end);
            };
            function filter(xs, f) {
              if (xs.filter) return xs.filter(f);
              var res = [];
              for (var i = 0; i < xs.length; i++) {
                if (f(xs[i], i, xs)) res.push(xs[i]);
              }
              return res;
            }
            var substr = "ab".substr(-1) === "b" ? function (str, start, len) {
              return str.substr(start, len);
            } : function (str, start, len) {
              if (start < 0) start = str.length + start;
              return str.substr(start, len);
            };
          }).call(this, require("_process"));
        }, {
          _process: 5
        }],
        5: [function (require, module, exports) {
          var process = module.exports = {};
          var cachedSetTimeout;
          var cachedClearTimeout;
          function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
          }
          function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
          }
          (function () {
            try {
              if (typeof setTimeout === "function") {
                cachedSetTimeout = setTimeout;
              } else {
                cachedSetTimeout = defaultSetTimout;
              }
            } catch (e) {
              cachedSetTimeout = defaultSetTimout;
            }
            try {
              if (typeof clearTimeout === "function") {
                cachedClearTimeout = clearTimeout;
              } else {
                cachedClearTimeout = defaultClearTimeout;
              }
            } catch (e) {
              cachedClearTimeout = defaultClearTimeout;
            }
          })();
          function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
              return setTimeout(fun, 0);
            }
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
              cachedSetTimeout = setTimeout;
              return setTimeout(fun, 0);
            }
            try {
              return cachedSetTimeout(fun, 0);
            } catch (e) {
              try {
                return cachedSetTimeout.call(null, fun, 0);
              } catch (e) {
                return cachedSetTimeout.call(this, fun, 0);
              }
            }
          }
          function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
              return clearTimeout(marker);
            }
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
              cachedClearTimeout = clearTimeout;
              return clearTimeout(marker);
            }
            try {
              return cachedClearTimeout(marker);
            } catch (e) {
              try {
                return cachedClearTimeout.call(null, marker);
              } catch (e) {
                return cachedClearTimeout.call(this, marker);
              }
            }
          }
          var queue = [];
          var draining = false;
          var currentQueue;
          var queueIndex = -1;
          function cleanUpNextTick() {
            if (!draining || !currentQueue) {
              return;
            }
            draining = false;
            if (currentQueue.length) {
              queue = currentQueue.concat(queue);
            } else {
              queueIndex = -1;
            }
            if (queue.length) {
              drainQueue();
            }
          }
          function drainQueue() {
            if (draining) {
              return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;
            var len = queue.length;
            while (len) {
              currentQueue = queue;
              queue = [];
              while (++queueIndex < len) {
                if (currentQueue) {
                  currentQueue[queueIndex].run();
                }
              }
              queueIndex = -1;
              len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
          }
          process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
              for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
              }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
              runTimeout(drainQueue);
            }
          };
          function Item(fun, array) {
            this.fun = fun;
            this.array = array;
          }
          Item.prototype.run = function () {
            this.fun.apply(null, this.array);
          };
          process.title = "browser";
          process.browser = true;
          process.env = {};
          process.argv = [];
          process.version = "";
          process.versions = {};
          function noop() {}
          process.on = noop;
          process.addListener = noop;
          process.once = noop;
          process.off = noop;
          process.removeListener = noop;
          process.removeAllListeners = noop;
          process.emit = noop;
          process.prependListener = noop;
          process.prependOnceListener = noop;
          process.listeners = function (name) {
            return [];
          };
          process.binding = function (name) {
            throw new Error("process.binding is not supported");
          };
          process.cwd = function () {
            return "/";
          };
          process.chdir = function (dir) {
            throw new Error("process.chdir is not supported");
          };
          process.umask = function () {
            return 0;
          };
        }, {}],
        6: [function (require, module, exports) {
          module.exports = {
            name: "ejs",
            description: "Embedded JavaScript templates",
            keywords: ["template", "engine", "ejs"],
            version: "3.1.9",
            author: "Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",
            license: "Apache-2.0",
            bin: {
              ejs: "./bin/cli.js"
            },
            main: "./lib/ejs.js",
            jsdelivr: "ejs.min.js",
            unpkg: "ejs.min.js",
            repository: {
              type: "git",
              url: "git://github.com/mde/ejs.git"
            },
            bugs: "https://github.com/mde/ejs/issues",
            homepage: "https://github.com/mde/ejs",
            dependencies: {
              jake: "^10.8.5"
            },
            devDependencies: {
              browserify: "^16.5.1",
              eslint: "^6.8.0",
              "git-directory-deploy": "^1.5.1",
              jsdoc: "^4.0.2",
              "lru-cache": "^4.0.1",
              mocha: "^10.2.0",
              "uglify-js": "^3.3.16"
            },
            engines: {
              node: ">=0.10.0"
            },
            scripts: {
              test: "npx jake test"
            }
          };
        }, {}]
      }, {}, [1])(1);
    });

    let coreuiPanelUtils = {
      /**
       * Проверка на объект
       * @param value
       */
      isObject: function (value) {
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
      },
      /**
       * @returns {string}
       * @private
       */
      hashCode: function () {
        return this.crc32((new Date().getTime() + Math.random()).toString()).toString(16);
      },
      /**
       * @param str
       * @returns {number}
       * @private
       */
      crc32: function (str) {
        for (var a, o = [], c = 0; c < 256; c++) {
          a = c;
          for (var f = 0; f < 8; f++) {
            a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
          }
          o[c] = a;
        }
        for (var n = -1, t = 0; t < str.length; t++) {
          n = n >>> 8 ^ o[255 & (n ^ str.charCodeAt(t))];
        }
        return (-1 ^ n) >>> 0;
      }
    };

    let tpl = Object.create(null);
    tpl['badge.html'] = '<span class="coreui-panel__tab-badge position-absolute top-0 translate-middle z-1 badge<%= badge.classes %>"<%- badge.attr %>> <%= badge.text %> </span>';
    tpl['container.html'] = '<div class="coreui-panel text-center mb-3<%= wrapperType %><%= fit %>" id="coreui-panel-<%= id %>"> <div class="card-body text-start"> <% if (issetControls) { %> <div class="coreui-panel-controls position-relative top-0 end-0 float-end gap-1 d-flex flex-wrap justify-content-end"></div> <% } %> <% if (title) { %> <h4 class="card-title<% if ( ! subtitle) { %> mb-4<% } %>"> <%- title %> </h4> <% } %> <% if (subtitle) { %> <p class="coreui-panel-subtitle text-body-secondary"><%- subtitle %></p> <% } %> <% if (tabs.content) { %> <% if ([\'top-left\', \'top-center\', \'top-right\'].indexOf(tabs.position) >= 0) { %> <%- tabs.content %> <div class="coreui-panel-content card-content"></div> <% } else if (tabs.position === \'left\') { %> <div class="d-flex"> <div class="me-3" style="width: <%= tabs.width %>"><%- tabs.content %></div> <div class="coreui-panel-content card-content flex-grow-1"></div> </div> <% } else if (tabs.position === \'right\') { %> <div class="d-flex"> <div class="coreui-panel-content card-content flex-grow-1 pe-3"></div> <div style="width: <%= tabs.width %>"><%- tabs.content %></div> </div> <% } %> <% } else { %> <div class="coreui-panel-content card-content"></div> <% } %> </div> </div>';
    tpl['loader.html'] = '<div class="coreui-panel-lock position-absolute w-100 top-0 bottom-0"> <div class="coreui-panel-block bg-secondary-subtle position-absolute opacity-50 w-100 top-0 bottom-0"></div> <div class="coreui-panel-message position-relative d-flex align-content-center justify-content-start gap-2 mt-3 py-1 px-2 m-auto border border-secondary-subtle rounded-3 bg-body-secondary"> <div class="spinner-border text-secondary align-self-center"></div> <span class="lh-lg"><%= loading %></span> </div> </div>';
    tpl['panel-control.html'] = '<div id="coreui-panel-control-<%= id %>" class="coreui-panel__control"></div>';
    tpl['tabs.html'] = ' <ul class="coreui-panel-tabs nav <% if (type) { %>nav-<%= type %><% } %> card-body-tabs mb-3 <% if (classes) { %><%= classes %><% } %> <% if (fill) { %>nav-<%= fill %><% } %>"> <% $.each(tabsContents, function(key, tabContent) { %> <%- tabContent %> <% }) %> </ul>';
    tpl['controls/button.html'] = '<button type="button"<%- attr %>><%- content %></button>';
    tpl['controls/button_group.html'] = ' <div class="btn-group" role="group"> <% $.each(buttons, function(key, button) { %> <% if (button.type === \'link\') { %> <a href="<%= button.link %>"<%- button.attr %>><%= button.content %></a> <% } else if (button.type === \'button\') { %> <button type="button" id="btn-<%= button.id %>"<%- button.attr %>> <%= button.content %> </button> <% } else if (button.type === \'dropdown\') { %> <div class="btn-group" role="group"> <button type="button" data-bs-toggle="dropdown"<%- button.attr %>> <%- button.content %> </button> <ul class="dropdown-menu dropdown-menu-<%= button.position %>"> <% $.each(button.items, function(key, item) { %> <% if (item.type === \'link\') { %> <li><a class="dropdown-item" href="<%= item.link %>"><%= item.content %></a></li> <% } else if (item.type === \'button\') { %> <li> <button type="button" class="dropdown-item" id="btn-dropdown-<%= item.id %>"> <%= item.content %> </button> </li> <% } else if (item.type === \'divider\') { %> <li><hr class="dropdown-divider"></li> <% } %> <% }) %> </ul> </div> <% } %> <% }) %> </div>';
    tpl['controls/dropdown.html'] = ' <div class="btn-group" role="group"> <button type="button" data-bs-toggle="dropdown"<%- attr %>> <%- content %> </button> <ul class="dropdown-menu dropdown-menu-<%= position %>"> <% $.each(items, function(key, item) { %> <% if (item.type === \'link\') { %> <li><a class="dropdown-item" href="<%= item.link %>"><%= item.content %></a></li> <% } else if (item.type === \'button\') { %> <li> <button type="button" class="dropdown-item" id="btn-dropdown-<%= item.id %>"> <%= item.content %> </button> </li> <% } else if (item.type === \'divider\') { %> <li><hr class="dropdown-divider"></li> <% } %> <% }) %> </ul> </div>';
    tpl['controls/link.html'] = '<a href="<%- href %>"<%- attr %>><%- content %></a>';
    tpl['tabs/tab-dropdown-divider.html'] = ' <li> <hr class="dropdown-divider"> </li>';
    tpl['tabs/tab-dropdown-item.html'] = ' <li class="coreui-panel__tab-item-<%= item.id %>"> <a class="dropdown-item position-relative<% if (item.active) { %> active<% } %><% if (item.disabled) { %> disabled<% } %>" href="<% if (item.url) { %><%= item.url %><% } else { %>#<% } %>" data-bs-toggle="tab" data-tab-id="<%= item.id %>"> <span class="coreui-panel__tab-item-title"><%= item.title %></span> <% if (item.count !== null) { %> <span class="coreui-panel__tab-item-count">(<%= item.count %>)</span><% } %> <%- item.badge %> </a> </li>';
    tpl['tabs/tab-dropdown.html'] = ' <li class="nav-item coreui-panel__tab-<%= tab.id %> dropdown<% if (tab.active) { %> active<% } %><% if (tab.disabled) { %> disabled<% } %>"> <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#"> <span class="coreui-panel__tab-title"><%= tab.title %></span> <% if (tab.count !== null) { %> <span class="coreui-panel__tab-count">(<%= tab.count %>)</span><% } %> <%- tab.badge %> </a> <ul class="dropdown-menu"> <% $.each(tab.itemsContents, function(key, itemContent) { %> <%- itemContent %> <% }) %> </ul> </li>';
    tpl['tabs/tab.html'] = ' <li class="nav-item coreui-panel__tab-<%= tab.id %>"> <a class="nav-link position-relative<% if (tab.active) { %> active<% } %><% if (tab.disabled) { %> disabled<% } %>" href="<% if (tab.url) { %><%= tab.url %><% } else { %>#<% } %>" data-tab-id="<%= tab.id %>" data-bs-toggle="tab"> <span class="coreui-panel__tab-title"><%= tab.title %></span> <% if (tab.count !== null) { %> <span class="coreui-panel__tab-count">(<%= tab.count %>)<% } %> <%- tab.badge %> </a> </li>';

    let coreuiPanelElements = {
      /**
       * получение контейнера панели
       * @param panelId
       * @return {*|jQuery|HTMLElement}
       */
      getPanel: function (panelId) {
        return $('#coreui-panel-' + panelId);
      },
      /**
       * Получение контейнера с табов
       * @param panelId
       * @return {*|jQuery|HTMLElement}
       */
      getTabsContainer: function (panelId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel-tabs');
      },
      /**
       * Получение контейнера таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabContainer: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId);
      },
      /**
       * Получение контейнера с количеством таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabCount: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-count');
      },
      /**
       * Получение контейнера с текстом таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabTitle: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-title');
      },
      /**
       * Получение контейнера с меткой таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabBadge: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-badge');
      },
      /**
       * Получение контейнера таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabItemContainer: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-item-' + tabId);
      },
      /**
       * Получение контейнера с текстом таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabItemTitle: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-item-title');
      },
      /**
       * Получение контейнера с количеством таба
       * @param panelId
       * @param tabId
       * @return {*|jQuery|HTMLElement}
       */
      getTabItemCount: function (panelId, tabId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel__tab-' + tabId + ' .coreui-panel__tab-item-count');
      },
      /**
       *
       * @param panelId
       * @return {*|jQuery|HTMLElement}
       */
      getContent: function (panelId) {
        return $('#coreui-panel-' + panelId + ' .coreui-panel-content');
      },
      /**
       *
       * @param panelId
       * @param controlId
       * @return {*|jQuery|HTMLElement}
       */
      getControl: function (panelId, controlId) {
        return $('#coreui-panel-' + panelId + ' #coreui-panel-control-' + controlId);
      },
      /**
       * Получение блокировки панели
       * @param {string} panelId
       * @return {jQuery}
       */
      getLock: function (panelId) {
        return $('#coreui-panel-' + panelId + ' > .coreui-panel-lock');
      }
    };

    let coreuiPanelTab = {
      _id: null,
      _panel: null,
      _options: {
        id: null,
        type: 'tab',
        title: '',
        url: null,
        urlContent: null,
        urlCount: null,
        urlBadge: null,
        urlWindow: null,
        count: null,
        badge: null,
        active: false,
        disabled: false
      },
      /**
       * Инициализация таба
       * @param {object} panel
       * @param {object} options
       * @private
       */
      _init: function (panel, options) {
        this._options = $.extend(true, {}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
      },
      /**
       * Получение идентификатора таба
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Получение опций таба
       * @return {object}
       */
      getOptions: function () {
        return $.extend(true, {}, this._options);
      },
      /**
       * Установка активного таба
       */
      setActive: function () {
        let tabTabElement = coreuiPanelElements.getTabContainer(this._panel.getId(), this.getId());
        if (tabTabElement[0]) {
          let tabTabsElement = coreuiPanelElements.getTabsContainer(this._panel.getId());
          tabTabsElement.find('.nav-link').removeClass('active');
          tabTabsElement.find('.nav-link.dropdown-toggle').removeClass('active');
          tabTabsElement.find('.nav-link.dropdown-toggle .dropdown-item').removeClass('active');
          tabTabElement.find('> a').addClass('active');
          coreuiPanelPrivate.trigger(this._panel, 'tab_click', this._panel, [this]);
        }
      },
      /**
       * Установка названия
       * @param {string} title
       */
      setTitle: function (title) {
        if (['string', 'number'].indexOf(typeof title) < 0 || title.toString().length === 0) {
          return;
        }
        let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
      },
      /**
       * Установка количества
       * @param {number|null} count
       */
      setCount: function (count) {
        let tabCountElement = coreuiPanelElements.getTabCount(this._panel.getId(), this.getId());
        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
          tabCountElement.remove();
        } else {
          if (tabCountElement[0]) {
            tabCountElement.text(' (' + count + ')');
          } else {
            let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
            tabTitleElement.after('<span class="coreui-panel__tab-count"> (' + count + ')>');
          }
        }
      },
      /**
       * Установка количества
       * @param {object} badge
       */
      setBadge: function (badge) {
        let badgeRender = coreuiPanelPrivate.renderBadge(badge);
        if (badgeRender) {
          let tabBadgeElement = coreuiPanelElements.getTabBadge(this._panel.getId(), this.getId());
          if (tabBadgeElement[0]) {
            tabBadgeElement.replaceWith(badgeRender);
          } else {
            let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
            tabTitleElement.after(badgeRender);
          }
        }
      },
      /**
       *
       */
      initEvents: function () {
        let that = this;
        let options = this.getOptions();
        this._panel.on('panel_show', function () {
          let tabsContainerElement = coreuiPanelElements.getTabContainer(that._panel.getId(), that.getId());
          $('.nav-link', tabsContainerElement).click(function (event) {
            coreuiPanelPrivate.trigger(that._panel, 'tab_click', that, [that, event]);
            if (options.url && options.url !== '#') {
              location.href = options.url;
            } else {
              return false;
            }
          });
          let count = options.hasOwnProperty('count') && ['string', 'number'].indexOf(typeof options.count) >= 0 && options.count.toString().length > 0 ? options.count : null;
          let urlCount = options.hasOwnProperty('urlCount') && typeof options.urlCount == 'string' && options.urlCount ? options.urlCount : null;
          if (count === null && urlCount) {
            that.setCount('<div class="spinner-border spinner-border-sm text-secondary"></div>');
            $.ajax({
              url: urlCount,
              method: 'get',
              success: function (result) {
                try {
                  let response = typeof result === 'string' ? JSON.parse(result) : result;
                  if (coreuiPanelUtils.isObject(response) && response.hasOwnProperty('count') && ['string', 'number'].indexOf(typeof response.count) >= 0 && response.count.toString().length > 0) {
                    that.setCount(response.count);
                  } else {
                    that.setCount(null);
                  }
                } catch (e) {
                  that.setCount(null);
                }
              },
              error: function (xhr, textStatus, errorThrown) {
                that.setCount(null);
              }
            });
          }
        });
        let badge = options.hasOwnProperty('badge') && ['string', 'number'].indexOf(typeof options.badge) >= 0 && options.badge.toString().length > 0 ? options.badge : null;
        let urlBadge = options.hasOwnProperty('urlBadge') && typeof options.urlBadge == 'string' && options.urlBadge ? options.urlBadge : null;
        if (badge === null && urlBadge) {
          $.ajax({
            url: urlBadge,
            method: 'get',
            success: function (result) {
              try {
                let response = typeof result === 'string' ? JSON.parse(result) : result;
                if (coreuiPanelUtils.isObject(response) && response.hasOwnProperty('badge') && coreuiPanelUtils.isObject(response.badge)) {
                  that.setBadge(response.badge);
                }
              } catch (e) {
                // ignore
              }
            }
          });
        }
      },
      /**
       * Рендер содержимого
       */
      render: function () {
        let options = this.getOptions();
        let title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title ? options.title : '';
        let active = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        let disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean' ? options.disabled : false;
        let url = options.hasOwnProperty('url') && typeof options.url == 'string' && options.url ? options.url : '#';
        let count = options.hasOwnProperty('count') && ['string', 'number'].indexOf(typeof options.count) >= 0 && options.count.toString().length > 0 ? options.count : null;
        let badge = options.hasOwnProperty('badge') ? coreuiPanelPrivate.renderBadge(options.badge) : null;
        return ejs.render(tpl['tabs/tab.html'], {
          tab: {
            id: this.getId(),
            title: title,
            active: active,
            disabled: disabled,
            url: url,
            count: count,
            badge: badge
          }
        });
      }
    };

    let coreuiPanelTabDropdownItem = {
      _id: null,
      _panel: null,
      _dropdown: null,
      _options: {
        id: null,
        type: 'item',
        active: false,
        disabled: false,
        url: '',
        urlContent: null,
        urlWindow: '',
        title: '',
        count: null
      },
      /**
       * Инициализация таба
       * @param {object} panel
       * @param {object} dropdown
       * @param {object} options
       * @private
       */
      _init: function (panel, dropdown, options) {
        this._options = $.extend(true, {}, this._options, options);
        this._panel = panel;
        this._dropdown = dropdown;
        this._id = this._options.hasOwnProperty('id') && ['string', 'number'].indexOf(typeof this._options.id) >= 0 && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
      },
      /**
       * Получение идентификатора таба
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Получение опций таба
       * @return {object}
       */
      getOptions: function () {
        return $.extend(true, {}, this._options);
      },
      /**
       * Установка активного таба
       */
      setActive: function () {
        let tabItemElement = coreuiPanelElements.getTabItemContainer(this._panel.getId(), this.getId());
        if (tabItemElement[0]) {
          let tabTabsElement = coreuiPanelElements.getTabsContainer(this._panel.getId());
          tabTabsElement.find('.nav-link').removeClass('active');
          tabTabsElement.find('.nav-link.dropdown-toggle').removeClass('active');
          tabTabsElement.find('.nav-link.dropdown-toggle .dropdown-item').removeClass('active');
          let tabElement = coreuiPanelElements.getTabContainer(this._panel.getId(), this._dropdown.getId());
          tabElement.find('> a').addClass('active');
          tabItemElement.find('> a').addClass('active');
          coreuiPanelPrivate.trigger(this._panel, 'tab_click', this._panel, [this]);
        }
      },
      /**
       * Установка названия
       * @param {string} title
       */
      setTitle: function (title) {
        if (['string', 'number'].indexOf(typeof title) < 0 || title.toString().length === 0) {
          return;
        }
        let tabTitleElement = coreuiPanelElements.getTabItemTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
      },
      /**
       * Установка количества
       * @param {number} count
       */
      setCount: function (count) {
        let tabCountElement = coreuiPanelElements.getTabItemCount(this._panel.getId(), this.getId());
        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
          tabCountElement.remove();
        } else {
          if (tabCountElement[0]) {
            tabCountElement.text('(' + count + ')');
          } else {
            let tabTitleElement = coreuiPanelElements.getTabItemTitle(this._panel.getId(), this.getId());
            tabTitleElement.after('(' + count + ')');
          }
        }
      },
      /**
       * Рендер содержимого
       * @return {*}
       */
      render: function () {
        let options = this.getOptions();
        options.title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title ? options.title : '';
        options.active = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        options.disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean' ? options.disabled : false;
        let url = options.hasOwnProperty('url') && typeof options.url == 'string' && options.url ? options.url : '#';
        const title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title ? options.title : '';
        const active = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        const disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean' ? options.disabled : false;
        let count = options.hasOwnProperty('count') && ['string', 'number'].indexOf(typeof options.count) >= 0 && options.count.toString().length > 0 ? options.count : null;
        return ejs.render(tpl['tabs/tab-dropdown-item.html'], {
          item: {
            id: this.getId(),
            type: 'item',
            active: active,
            disabled: disabled,
            url: url,
            title: title,
            count: count
          }
        });
      }
    };

    let coreuiPanelTabDropdownDivider = {
      _id: null,
      _panel: null,
      _dropdown: null,
      _options: {
        id: null,
        type: 'divider'
      },
      /**
       * Инициализация таба
       * @param {object} panel
       * @param {object} dropdown
       * @param {object} options
       * @private
       */
      _init: function (panel, dropdown, options) {
        this._options = $.extend(true, {}, this._options, options);
        this._panel = panel;
        this._dropdown = dropdown;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
      },
      /**
       * Получение идентификатора таба
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Рендер содержимого
       * @return {*}
       */
      render: function () {
        return tpl['tabs/tab-dropdown-divider.html'];
      }
    };

    let coreuiPanelTabDropdown = {
      _id: null,
      _panel: null,
      _items: [],
      _options: {
        id: null,
        type: 'dropdown',
        title: '',
        active: false,
        disabled: false,
        items: []
      },
      /**
       * Инициализация таба
       * @param {object} panel
       * @param {object} options
       * @private
       */
      _init: function (panel, options) {
        this._options = $.extend(true, {}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id == 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
        let that = this;
        if (this._options.hasOwnProperty('items') && Array.isArray(this._options.items) && this._options.items.length > 0) {
          $.each(this._options.items, function (key, item) {
            let tabType = item.hasOwnProperty('type') && typeof item.type === 'string' ? item.type : 'item';
            let instance = null;
            switch (tabType) {
              case 'item':
              default:
                instance = $.extend(true, {}, coreuiPanelTabDropdownItem);
                break;
              case 'divider':
                instance = $.extend(true, {}, coreuiPanelTabDropdownDivider);
                break;
            }
            if (instance) {
              instance._init(panel, that, item);
              that._items.push(instance);
            }
          });
        }
      },
      /**
       * Получение идентификатора таба
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Инициализация событий
       */
      initEvents: function () {
        let that = this;
        this._panel.on('panel_show', function () {
          let tabsContainerElement = coreuiPanelElements.getTabContainer(that._panel.getId(), that.getId());
          $('.dropdown-item', tabsContainerElement).click(function (event) {
            let tabId = $(this).data('tab-id') || '';
            let tab = that.getItem(tabId);
            if (tab) {
              coreuiPanelPrivate.trigger(that._panel, 'tab_click', tab, [tab, event]);
              let options = tab.getOptions();
              if (options.url && options.url !== '#') {
                location.href = options.url;
              } else {
                return false;
              }
            }
          });
        });
      },
      /**
       * Получение опций таба
       * @return {object}
       */
      getOptions: function () {
        return $.extend(true, {}, this._options);
      },
      /**
       * Получение опций таба
       * @property {string} itemId
       * @return {object}
       */
      getItem: function (itemId) {
        let result = null;
        $.each(this._items, function (key, item) {
          if (item.hasOwnProperty('getId') && typeof item.getId === 'function' && item.getId() == itemId) {
            result = item;
            return false;
          }
        });
        return result;
      },
      /**
       * Установка названия
       * @param {string} title
       */
      setTitle: function (title) {
        if (['string', 'number'].indexOf(typeof title) < 0 || title.toString().length === 0) {
          return;
        }
        let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
        tabTitleElement.text(title);
      },
      /**
       * Установка количества
       * @param {number} count
       */
      setCount: function (count) {
        let tabCountElement = coreuiPanelElements.getTabCount(this._panel.getId(), this.getId());
        if (['string', 'number'].indexOf(typeof count) < 0 || count.toString().length === 0) {
          tabCountElement.remove();
        } else {
          if (tabCountElement[0]) {
            tabCountElement.text('(' + count + ')');
          } else {
            let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
            tabTitleElement.after('(' + count + ')');
          }
        }
      },
      /**
       * Установка метки
       * @param {object} badge
       */
      setBadge: function (badge) {
        let badgeRender = coreuiPanelPrivate.renderBadge(badge);
        if (badgeRender) {
          let tabBadgeElement = coreuiPanelElements.getTabBadge(this._panel.getId(), this.getId());
          if (tabBadgeElement[0]) {
            tabBadgeElement.replaceWith(badgeRender);
          } else {
            let tabTitleElement = coreuiPanelElements.getTabTitle(this._panel.getId(), this.getId());
            tabTitleElement.after(badgeRender);
          }
        }
      },
      /**
       * Рендер содержимого
       * @return {string}
       */
      render: function () {
        let options = this.getOptions();
        let title = options.hasOwnProperty('title') && typeof options.title == 'string' && options.title ? options.title : '';
        let active = options.hasOwnProperty('active') && typeof options.active == 'boolean' && options.active;
        let disabled = options.hasOwnProperty('disabled') && typeof options.disabled == 'boolean' ? options.disabled : false;
        let count = options.hasOwnProperty('count') && ['string', 'number'].indexOf(typeof options.count) >= 0 && options.count.toString().length > 0 ? options.count : null;
        let badge = options.hasOwnProperty('badge') ? coreuiPanelPrivate.renderBadge(options.badge) : null;
        let itemsContents = [];
        $.each(this._items, function (key, item) {
          itemsContents.push(item.render());
        });
        return ejs.render(tpl['tabs/tab-dropdown.html'], {
          tab: {
            id: this.getId(),
            title: title,
            active: active,
            disabled: disabled,
            count: count,
            badge: badge,
            itemsContents: itemsContents
          }
        });
      }
    };

    let coreuiPanelPrivate = {
      /**
       * @param panel
       * @param name
       * @param context
       * @param params
       */
      trigger: function (panel, name, context, params) {
        params = params || [];
        if (panel._events.hasOwnProperty(name) && panel._events[name].length > 0) {
          for (var i = 0; i < panel._events[name].length; i++) {
            let callback = panel._events[name][i].callback;
            context = panel._events[name][i].context || context;
            callback.apply(context, params);
            if (panel._events[name][i].singleExec) {
              panel._events[name].splice(i, 1);
              i--;
            }
          }
        }
      },
      /**
       * Инициализация контролов и фильтров
       * @param {object} panelWrapper
       * @param {object} panel
       * @param {Array}  controls
       * @private
       */
      initControls: function (panelWrapper, panel, controls) {
        $.each(controls, function (key, control) {
          if (coreuiPanelUtils.isObject(control) && typeof control.type === 'string') {
            if (panelWrapper.controls.hasOwnProperty(control.type)) {
              let instance = $.extend(true, {}, panelWrapper.controls[control.type]);
              instance.init(panel, control);
              panel._controls.push(instance);
            }
          }
        });
      },
      /**
       * Инициализация контролов и фильтров
       * @param {Object} panel
       * @param {Array}  tabItems
       * @private
       */
      initTabs: function (panel, tabItems) {
        $.each(tabItems, function (key, tabItem) {
          if (coreuiPanelUtils.isObject(tabItem)) {
            let instance = null;
            let tabType = tabItem.hasOwnProperty('type') && typeof tabItem.type === 'string' ? tabItem.type : 'tab';
            if (tabType === 'tab') {
              instance = $.extend(true, {}, coreuiPanelTab);
            } else if (tabType === 'dropdown') {
              instance = $.extend(true, {}, coreuiPanelTabDropdown);
            }
            if (instance) {
              instance._init(panel, tabItem);
              panel._tabs.push(instance);
              panel.on('panel_show', function () {
                instance.initEvents();
              });
            }
          }
        });
      },
      /**
       * Сборка табов
       * @param {object} panel
       * @param {object} tabs
       */
      renderTabs: function (panel, tabs) {
        let classes = [];
        let tabsContents = [];
        if (tabs.hasOwnProperty('position') && typeof tabs.position === 'string') {
          switch (tabs.position) {
            case 'top-center':
              classes.push('justify-content-center');
              break;
            case 'top-right':
              classes.push('justify-content-end');
              break;
            case 'left':
              classes.push('left-tabs');
              break;
            case 'right':
              classes.push('right-tabs');
              break;
          }
        }
        if (tabs.hasOwnProperty('type') && typeof tabs.type === 'string' && ['tabs', 'pills'].indexOf(tabs.type) >= 0) {
          classes.push('gap-1');
        }
        $.each(panel._tabs, function (key, tab) {
          tabsContents.push(tab.render());
        });
        return ejs.render(tpl['tabs.html'], {
          classes: classes.join(' '),
          type: tabs.hasOwnProperty('type') && typeof tabs.type === 'string' ? tabs.type : '',
          fill: tabs.hasOwnProperty('fill') && typeof tabs.fill === 'string' ? tabs.fill : '',
          tabsContents: tabsContents
        });
      },
      /**
       * Сборка элемента управления
       * @param {object} panel
       * @param {object} control
       * @private
       * @returns {HTMLElement|jQuery}
       */
      renderControl: function (panel, control) {
        if (coreuiPanelUtils.isObject(control)) {
          let controlElement = $(ejs.render(tpl['panel-control.html'], {
            id: control.getId()
          }));
          controlElement.append(control.render());
          if (control.hasOwnProperty('initEvents') && typeof control.initEvents === 'function') {
            panel.on('panel_show', function () {
              control.initEvents();
            });
          }
          return controlElement;
        }
      },
      /**
       * Сборка содержимого
       * @param {object} panel
       * @param {*} content
       * @return {string}
       */
      renderContents: function (panel, content) {
        let result = [];
        if (typeof content === 'string') {
          result.push(content);
        } else if (content instanceof Object) {
          if (!Array.isArray(content)) {
            content = [content];
          }
          for (let i = 0; i < content.length; i++) {
            if (typeof content[i] === 'string') {
              result.push(content[i]);
            } else {
              if (!Array.isArray(content[i]) && content[i].hasOwnProperty('component') && typeof content[i].component === 'string' && content[i].component.substring(0, 6) === 'coreui') {
                let name = content[i].component.split('.')[1];
                if (CoreUI.hasOwnProperty(name) && coreuiPanelUtils.isObject(CoreUI[name])) {
                  let instance = CoreUI[name].create(content[i]);
                  result.push(instance.render());
                  panel.one('content_show', instance.initEvents, instance);
                }
              } else {
                result.push(JSON.stringify(content[i]));
              }
            }
          }
        }
        return result;
      },
      /**
       * Создание метки
       * @param {object} badge
       * @return {null}
       * @private
       */
      renderBadge: function (badge) {
        if (!coreuiPanelUtils.isObject(badge) || !badge.hasOwnProperty('text') || ['string', 'number'].indexOf(typeof badge.text) < 0) {
          return '';
        }
        let attr = [];
        let type = badge.hasOwnProperty('type') && typeof badge.type === 'string' ? badge.type : 'danger';
        let classes = badge.text.toString().length > 0 ? 'rounded-pill bg-' + type : 'rounded-circle p-2 border bg-' + type;
        if (badge.hasOwnProperty('attr') && coreuiPanelUtils.isObject(badge.attr)) {
          if (badge.attr.hasOwnProperty('class') && typeof badge.attr.class === 'string') {
            classes += ' ' + badge.attr.class;
            delete badge.attr.class;
          }
          $.each(badge.attr, function (name, value) {
            if (typeof name === 'string' && ['string', 'number'].indexOf(typeof value) >= 0) {
              attr.push(name + '="' + value + '"');
            }
          });
        }
        return ejs.render(tpl['badge.html'], {
          badge: {
            text: badge.text,
            classes: classes ? ' ' + classes : '',
            attr: attr.length > 0 ? ' ' + attr.join(' ') : ''
          }
        });
      }
    };

    let panelInstance = {
      _options: {
        id: '',
        lang: 'en',
        langList: {},
        title: null,
        subtitle: null,
        controls: [],
        contentFit: null,
        content: null,
        contentUrl: null,
        wrapperType: 'card',
        tabs: {
          type: 'tabs',
          // pills, underline
          position: 'top-left',
          // top-center, top-right, left, right
          width: 200,
          fill: '',
          // fill, justify
          items: []
        }
      },
      _id: '',
      _tabs: [],
      _controls: [],
      _events: {},
      /**
       *
       * @param {object} panelWrapper
       * @param {object} options
       */
      _init: function (panelWrapper, options) {
        this._options = $.extend(true, {}, this._options, options);
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();

        // Инициализация контролов
        if (this._options.hasOwnProperty('controls') && Array.isArray(this._options.controls) && this._options.controls.length > 0) {
          coreuiPanelPrivate.initControls(panelWrapper, this, this._options.controls);
        }

        // Инициализация табов
        if (this._options.hasOwnProperty('tabs') && coreuiPanelUtils.isObject(this._options.tabs) && this._options.tabs.hasOwnProperty('items') && Array.isArray(this._options.tabs.items) && this._options.tabs.items.length > 0) {
          coreuiPanelPrivate.initTabs(this, this._options.tabs.items);
        }
      },
      /**
       * Инициализация событий
       */
      initEvents: function () {
        let that = this;
        this.on('tab_click', function (tab, event) {
          let options = tab.getOptions();
          let urlContent = options.hasOwnProperty('urlContent') && typeof options.urlContent == 'string' && options.urlContent ? options.urlContent : '#';
          if (urlContent && urlContent !== '#') {
            that.loadContent(urlContent);
          }
          let urlWindow = options.hasOwnProperty('urlWindow') && typeof options.urlWindow == 'string' && options.urlWindow ? options.urlWindow : null;
          if (urlWindow) {
            window.history.pushState({
              path: urlWindow
            }, '', urlWindow);
          }
        });
        coreuiPanelPrivate.trigger(this, 'panel_show');
        if (this._options.content !== null) {
          coreuiPanelPrivate.trigger(this, 'content_show');
        }
      },
      /**
       * Получение идентификатора
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Получение опций
       * @returns {object}
       */
      getOptions: function () {
        return $.extend(true, {}, this._options);
      },
      /**
       * Блокировка панели
       * @param {string} text
       */
      lock: function (text) {
        let container = coreuiPanelElements.getPanel(this.getId());
        if (container[0] && !container.find('.coreui-panel-lock')[0]) {
          let html = ejs.render(tpl['loader.html'], {
            loading: typeof text === 'string' ? text : this.getLang().loading
          });
          container.prepend(html);
        }
      },
      /**
       * Разблокировка панели
       */
      unlock: function () {
        coreuiPanelElements.getLock(this.getId()).hide(50, function () {
          $(this).remove();
        });
      },
      /**
       * Загрузка данных и установка их в панель
       * @param url
       */
      loadContent: function (url) {
        let that = this;
        this.lock();
        $.ajax({
          url: url,
          method: 'get',
          beforeSend: function (xhr) {
            coreuiPanelPrivate.trigger(that, 'load_start', that, [xhr]);
          },
          success: function (result) {
            coreuiPanelPrivate.trigger(that, 'load_success', that, [result]);
            that.setContent(result);
          },
          error: function (xhr, textStatus, errorThrown) {
            coreuiPanelPrivate.trigger(that, 'load_error', that, [xhr, textStatus, errorThrown]);
            that.setContent('');
          },
          complete: function (xhr, textStatus) {
            that.unlock();
            coreuiPanelPrivate.trigger(that, 'load_end', that, [xhr, textStatus]);
          }
        });
      },
      /**
       * Получение переводов текущего языка
       * @return {object}
       */
      getLang: function () {
        return $.extend(true, {}, this._options.langList);
      },
      /**
       * Получение объекта таба по id
       * @param tabId
       */
      getTabById: function (tabId) {
        let result = null;
        $.each(this._tabs, function (key, tab) {
          if (tab.hasOwnProperty('getId') && typeof tab.getId === 'function' && tab.getId() === tabId) {
            result = tab;
            return false;
          }
        });
        return result;
      },
      /**
       * Получение объекта контрола по его id
       * @param {string} id
       * @return {object}
       */
      getControlById: function (id) {
        let result = null;
        $.each(this._controls, function (key, control) {
          if (control.hasOwnProperty('getId') && typeof control.getId === 'function' && control.getId() === id) {
            result = control;
            return false;
          }
        });
        return result;
      },
      /**
       * Размещение содержимого внутри панели
       * @param {string|object|Array} content
       */
      setContent: function (content) {
        let contents = coreuiPanelPrivate.renderContents(this, content);
        let container = coreuiPanelElements.getContent(this.getId());
        container.html('');
        $.each(contents, function (key, content) {
          container.append(content);
        });
        coreuiPanelPrivate.trigger(this, 'content_show');
      },
      /**
       *
       * @param element
       * @returns {*}
       */
      render: function (element) {
        let that = this;
        let tabsContent = null;
        let tabsPosition = 'top-left';
        let tabsWidth = '200px';
        let fitContent = '';
        let wrapperType = '';
        if (this._options.hasOwnProperty('tabs') && coreuiPanelUtils.isObject(this._options.tabs) && this._options.tabs.hasOwnProperty('items') && Array.isArray(this._options.tabs.items) && this._options.tabs.items.length > 0) {
          tabsContent = coreuiPanelPrivate.renderTabs(this, this._options.tabs);
          tabsPosition = this._options.tabs.hasOwnProperty('position') && typeof this._options.tabs.position === 'string' ? this._options.tabs.position : 'top-left';
          if (this._options.tabs.hasOwnProperty('width') && ['string', 'number'].indexOf(typeof this._options.tabs.width) && this._options.tabs.width) {
            let unit = typeof this._options.tabs.width === 'number' ? 'px' : '';
            tabsWidth = this._options.tabs.width + unit;
          }
        }
        if (this._options.hasOwnProperty('contentFit') && typeof this._options.contentFit === 'string') {
          switch (this._options.contentFit) {
            case 'fit':
              fitContent = ' coreui-panel__content-fit';
              break;
            case 'min':
              fitContent = ' coreui-panel__content-min';
              break;
            case 'max':
              fitContent = ' coreui-panel__content-max';
              break;
          }
        }
        if (this._options.hasOwnProperty('wrapperType') && typeof this._options.wrapperType === 'string') {
          if (this._options.wrapperType === 'card') {
            wrapperType = ' card shadow-sm';
          }
        }
        let panelElement = $(ejs.render(tpl['container.html'], {
          issetControls: !!this._controls.length,
          id: this.getId(),
          title: this._options.title,
          subtitle: this._options.subtitle,
          fit: fitContent,
          wrapperType: wrapperType,
          tabs: {
            content: tabsContent,
            position: tabsPosition,
            width: tabsWidth
          }
        }));
        if (this._options.contentUrl) {
          this.on('panel_show', function (event) {
            that.loadContent(this._options.contentUrl);
          });
        } else {
          let renderContents = coreuiPanelPrivate.renderContents(this, this._options.content);
          $.each(renderContents, function (key, content) {
            panelElement.find('.coreui-panel-content').append(content);
          });
          $.each(this._controls, function (key, control) {
            panelElement.find('.coreui-panel-controls').append(coreuiPanelPrivate.renderControl(that, control));
          });
        }
        if (element === undefined) {
          return panelElement;
        }

        // Dom element
        let domElement = null;
        if (typeof element === 'string') {
          domElement = document.getElementById(element);
        } else if (element instanceof HTMLElement) {
          domElement = element;
        }
        if (domElement) {
          $(domElement).html(panelElement);
          this.initEvents();
        }
      },
      /**
       * Регистрация функции на событие
       * @param eventName
       * @param callback
       * @param context
       */
      on: function (eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
          this._events[eventName] = [];
        }
        this._events[eventName].push({
          context: context || this,
          callback: callback,
          singleExec: false
        });
      },
      /**
       * Регистрация функции на событие
       * @param eventName
       * @param callback
       * @param context
       */
      one: function (eventName, callback, context) {
        if (typeof this._events[eventName] !== 'object') {
          this._events[eventName] = [];
        }
        this._events[eventName].push({
          context: context || this,
          callback: callback,
          singleExec: true
        });
      }
    };

    let coreuiPanel = {
      lang: {},
      controls: {},
      _instances: {},
      _settings: {
        lang: 'ru'
      },
      /**
       * @param {object} options
       * @returns {coreuiPanelInstance}
       */
      create: function (options) {
        let instance = $.extend(true, {}, panelInstance);
        if (!options.hasOwnProperty('lang')) {
          options.lang = this.getSetting('lang');
        }
        let langList = this.lang.hasOwnProperty(options.lang) ? this.lang[options.lang] : {};
        options.langList = options.hasOwnProperty('langList') && coreuiTabsUtils.isObject(options.langList) ? $.extend(true, {}, langList, options.langList) : langList;
        instance._init(this, options instanceof Object ? options : {});
        let panelId = instance.getId();
        this._instances[panelId] = instance;
        return instance;
      },
      /**
       * @param {string} id
       * @returns {coreuiPanelInstance|null}
       */
      get: function (id) {
        if (!this._instances.hasOwnProperty(id)) {
          return null;
        }
        if (!$('#coreui-panel-' + id)[0]) {
          delete this._instances[id];
          return null;
        }
        return this._instances[id];
      },
      /**
       * Установка настроек
       * @param {object} settings
       */
      setSettings: function (settings) {
        this._settings = $.extend(true, {}, this._settings, settings);
      },
      /**
       * Получение значения настройки
       * @param {string} name
       */
      getSetting: function (name) {
        let value = null;
        if (this._settings.hasOwnProperty(name)) {
          value = this._settings[name];
        }
        return value;
      }
    };

    coreuiPanel.controls.link = {
      _id: null,
      _panel: null,
      _options: {
        id: null,
        type: 'link',
        href: null,
        content: null,
        onClick: null,
        attr: null
      },
      /**
       * Инициализация
       * @param {object} panel
       * @param {object}                options
       */
      init: function (panel, options) {
        this._options = $.extend({}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
      },
      /**
       * Инициализация событий связанных с элементом управления
       */
      initEvents: function () {
        let that = this;
        if (typeof this._options.onClick === 'function' || typeof this._options.onClick === 'string') {
          let control = coreuiPanelElements.getControl(this._panel.getId(), this.getId());
          $('a', control).click(function (event) {
            if (typeof that._options.onClick === 'function') {
              return that._options.onClick(event, that._panel);
            } else if (typeof that._options.onClick === 'string') {
              return new Function(that._options.onClick)();
            }
          });
        }
      },
      /**
       * Получение ID элемента управления
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Формирование контента для размещения на странице
       * @returns {string}
       */
      render: function () {
        let attributes = [];
        if (typeof this._options.attr === 'object') {
          $.each(this._options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
          });
        }
        return ejs.render(tpl['controls/link.html'], {
          href: this._options.href,
          content: this._options.content,
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        });
      }
    };

    coreuiPanel.controls.button = {
      _id: null,
      _panel: null,
      _options: {
        id: null,
        type: 'button',
        content: null,
        onClick: null,
        attr: null
      },
      /**
       * Инициализация
       * @param {object} panel
       * @param {object}                options
       */
      init: function (panel, options) {
        this._options = $.extend({}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
      },
      /**
       * Инициализация событий связанных с элементом управления
       */
      initEvents: function () {
        let that = this;
        if (typeof this._options.onClick === 'function' || typeof this._options.onClick === 'string') {
          let control = coreuiPanelElements.getControl(this._panel.getId(), this.getId());
          $('button', control).click(function (event) {
            if (typeof that._options.onClick === 'function') {
              that._options.onClick(event, that._panel);
            } else if (typeof that._options.onClick === 'string') {
              new Function(that._options.onClick)();
            }
          });
        }
      },
      /**
       * Получение ID элемента управления
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Формирование контента для размещения на странице
       * @returns {string}
       */
      render: function () {
        let attributes = [];
        if (coreuiPanelUtils.isObject(this._options.attr)) {
          $.each(this._options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
          });
        }
        return ejs.render(tpl['controls/button.html'], {
          content: this._options.content,
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : ''
        });
      }
    };

    coreuiPanel.controls.dropdown = {
      _id: null,
      _panel: null,
      _options: {
        id: null,
        type: 'dropdown',
        content: null,
        items: null,
        attr: {
          class: 'btn btn-primary'
        }
      },
      /**
       * Инициализация
       * @param {object} panel
       * @param {object} options
       */
      init: function (panel, options) {
        this._options = $.extend({}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
        if (Array.isArray(this._options.items)) {
          $.each(this._options.items, function (key, item) {
            if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {
              item.id = item.hasOwnProperty('id') && typeof item.id === 'string' && item.id ? item.id : coreuiPanelUtils.hashCode();
            }
          });
        }
      },
      /**
       * Получение параметров
       * @returns {object}
       */
      getOptions: function () {
        return $.extend(true, {}, this._options);
      },
      /**
       * Инициализация событий связанных с элементом управления
       */
      initEvents: function () {
        let that = this;
        let options = this.getOptions();
        if (Array.isArray(options.items)) {
          $.each(options.items, function (key, item) {
            if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {
              if (item.type === 'button') {
                if (item.hasOwnProperty('content') && item.hasOwnProperty('onClick') && ['string', 'function'].indexOf(typeof item.onClick) >= 0 && typeof item.content === 'string') {
                  let control = coreuiPanelElements.getControl(that._panel.getId(), that.getId());
                  $('button#btn-dropdown-' + item.id, control).click(function (event) {
                    if (typeof item.onClick === 'function') {
                      item.onClick(event, that._panel);
                    } else if (typeof item.onClick === 'string') {
                      new Function(item.onClick)();
                    }
                  });
                }
              }
            }
          });
        }
      },
      /**
       * Получение ID элемента управления
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Формирование контента для размещения на странице
       * @returns {string}
       */
      render: function () {
        let options = this.getOptions();
        let items = [];
        let attributes = [];
        if (Array.isArray(options.items)) {
          $.each(options.items, function (key, item) {
            if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {
              if (item.type === 'link') {
                if (item.hasOwnProperty('link') && item.hasOwnProperty('content') && typeof item.link === 'string' && typeof item.content === 'string') {
                  items.push({
                    type: 'link',
                    link: item.link,
                    content: item.content
                  });
                }
              } else if (item.type === 'button') {
                if (item.hasOwnProperty('content') && item.hasOwnProperty('onClick') && typeof item.content === 'string' && ['string', 'function'].indexOf(typeof item.onClick) >= 0) {
                  items.push({
                    type: 'button',
                    id: item.id,
                    content: item.content
                  });
                }
              } else if (item.type === 'divider') {
                items.push({
                  type: 'divider'
                });
              }
            }
          });
        }
        if (coreuiPanelUtils.isObject(options.attr)) {
          if (options.attr.hasOwnProperty('class') && ['string', 'number'].indexOf(typeof options.attr.class) >= 0) {
            options.attr.class += ' dropdown-toggle';
          }
          if (options.attr.hasOwnProperty('type')) {
            delete options.attr.type;
          }
          if (options.attr.hasOwnProperty('id')) {
            delete options.attr.id;
          }
          if (options.attr.hasOwnProperty('data-bs-toggle')) {
            delete options.attr['data-bs-toggle'];
          }
          $.each(options.attr, function (name, value) {
            attributes.push(name + '="' + value + '"');
          });
        }
        return ejs.render(tpl['controls/dropdown.html'], {
          content: options.content,
          position: options.hasOwnProperty('position') && typeof options.position === 'string' ? options.position : 'end',
          attr: attributes.length > 0 ? ' ' + attributes.join(' ') : '',
          items: items
        });
      }
    };

    coreuiPanel.controls.button_group = {
      _id: null,
      _panel: null,
      _options: {
        id: null,
        type: 'button_group',
        content: null,
        onClick: null,
        attr: null
      },
      _link: {
        attr: {
          class: 'btn btn-secondary'
        }
      },
      _button: {
        attr: {
          class: 'btn btn-secondary'
        }
      },
      _dropdown: {
        attr: {
          class: 'btn btn-secondary'
        }
      },
      /**
       * Инициализация
       * @param {object} panel
       * @param {object}                options
       */
      init: function (panel, options) {
        this._options = $.extend({}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
        if (Array.isArray(this._options.buttons)) {
          $.each(this._options.buttons, function (key, button) {
            if (coreuiPanelUtils.isObject(button) && typeof button.type === 'string') {
              button.id = coreuiPanelUtils.hashCode();
              if (button.type === 'dropdown' && Array.isArray(button.items)) {
                $.each(button.items, function (key, item) {
                  if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {
                    item.id = item.hasOwnProperty('id') && typeof item.id === 'string' && item.id ? item.id : coreuiPanelUtils.hashCode();
                  }
                });
              }
            }
          });
        }
      },
      /**
       * Получение параметров
       * @returns {object}
       */
      getOptions: function () {
        return $.extend(true, {}, this._options);
      },
      /**
       * Инициализация событий связанных с элементом управления
       */
      initEvents: function () {
        let that = this;
        let options = this.getOptions();
        if (Array.isArray(options.buttons)) {
          let control = coreuiPanelElements.getControl(this._panel.getId(), this._id);
          $.each(options.buttons, function (key, button) {
            if (coreuiPanelUtils.isObject(button) && typeof button.type === 'string') {
              if (button.type === 'button') {
                if (button.hasOwnProperty('content') && button.hasOwnProperty('onClick') && ['string', 'function'].indexOf(typeof button.onClick) >= 0 && typeof button.content === 'string') {
                  $('button#btn-' + button.id, control).click(function (event) {
                    if (typeof button.onClick === 'function') {
                      button.onClick(event, that._panel);
                    } else if (typeof button.onClick === 'string') {
                      new Function(button.onClick)();
                    }
                  });
                }
              } else if (button.type === 'dropdown' && Array.isArray(button.items)) {
                $.each(button.items, function (key, item) {
                  if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {
                    if (item.hasOwnProperty('content') && item.hasOwnProperty('onClick') && ['string', 'function'].indexOf(typeof item.onClick) >= 0 && typeof item.content === 'string') {
                      $('button#btn-dropdown-' + item.id, control).click(function (event) {
                        if (typeof item.onClick === 'function') {
                          item.onClick(event, that._panel);
                        } else if (typeof item.onClick === 'string') {
                          new Function(item.onClick)();
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      },
      /**
       * Получение ID элемента управления
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Формирование контента для размещения на странице
       * @returns {string}
       */
      render: function () {
        let options = this.getOptions();
        let buttons = [];
        let that = this;
        if (Array.isArray(options.buttons)) {
          $.each(options.buttons, function (key, button) {
            if (coreuiPanelUtils.isObject(button) && typeof button.type === 'string') {
              if (button.type === 'link') {
                if (button.hasOwnProperty('link') && button.hasOwnProperty('content') && typeof button.link === 'string' && typeof button.content === 'string') {
                  let attributes = [];
                  if (!coreuiPanelUtils.isObject(button.attr)) {
                    button.attr = {};
                  }
                  if (button.attr.hasOwnProperty('href')) {
                    delete button.attr.href;
                  }
                  if (!button.attr.hasOwnProperty('class')) {
                    button.attr.class = that._link.attr.class;
                  }
                  $.each(button.attr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                  });
                  buttons.push({
                    type: 'link',
                    link: button.link,
                    content: button.content,
                    attr: attributes
                  });
                }
              } else if (button.type === 'button') {
                if (button.hasOwnProperty('content') && button.hasOwnProperty('onClick') && typeof button.content === 'string' && ['string', 'function'].indexOf(typeof button.onClick) >= 0) {
                  let attributes = [];
                  if (!coreuiPanelUtils.isObject(button.attr)) {
                    button.attr = {};
                  }
                  if (button.attr.hasOwnProperty('type')) {
                    delete button.attr.type;
                  }
                  if (button.attr.hasOwnProperty('id')) {
                    delete button.attr.id;
                  }
                  if (!button.attr.hasOwnProperty('class')) {
                    button.attr.class = that._button.attr.class;
                  }
                  $.each(button.attr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                  });
                  buttons.push({
                    type: 'button',
                    link: button.link,
                    id: button.id,
                    content: button.content,
                    attr: attributes
                  });
                }
              } else if (button.type === 'dropdown') {
                if (Array.isArray(button.items)) {
                  let attributes = [];
                  let items = [];
                  $.each(button.items, function (key, item) {
                    if (coreuiPanelUtils.isObject(item) && typeof item.type === 'string') {
                      if (item.type === 'link') {
                        if (item.hasOwnProperty('link') && item.hasOwnProperty('content') && typeof item.link === 'string' && typeof item.content === 'string') {
                          items.push({
                            type: 'link',
                            link: item.link,
                            content: item.content
                          });
                        }
                      } else if (item.type === 'button') {
                        if (item.hasOwnProperty('content') && item.hasOwnProperty('onClick') && typeof item.content === 'string' && ['string', 'function'].indexOf(typeof item.onClick) >= 0) {
                          items.push({
                            type: 'button',
                            id: item.id,
                            content: item.content
                          });
                        }
                      } else if (item.type === 'divider') {
                        items.push({
                          type: 'divider'
                        });
                      }
                    }
                  });
                  if (!coreuiPanelUtils.isObject(button.attr)) {
                    button.attr = {};
                  }
                  if (button.attr.hasOwnProperty('type')) {
                    delete button.attr.type;
                  }
                  if (button.attr.hasOwnProperty('id')) {
                    delete button.attr.id;
                  }
                  if (!button.attr.hasOwnProperty('class')) {
                    button.attr.class = that._dropdown.attr.class;
                  }
                  if (button.attr.hasOwnProperty('class') && ['string', 'number'].indexOf(typeof button.attr.class) >= 0) {
                    button.attr.class += ' dropdown-toggle';
                  }
                  $.each(button.attr, function (name, value) {
                    attributes.push(name + '="' + value + '"');
                  });
                  buttons.push({
                    type: 'dropdown',
                    content: button.content,
                    position: button.hasOwnProperty('position') && typeof button.position === 'string' ? button.position : 'end',
                    attr: attributes,
                    items: items
                  });
                }
              }
            }
          });
        }
        return ejs.render(tpl['controls/button_group.html'], {
          buttons: buttons
        });
      }
    };

    coreuiPanel.controls.custom = {
      _id: null,
      _panel: null,
      _options: {
        id: null,
        type: 'custom',
        content: null
      },
      /**
       * Инициализация
       * @param {object} panel
       * @param {object}                options
       */
      init: function (panel, options) {
        this._options = $.extend({}, this._options, options);
        this._panel = panel;
        this._id = this._options.hasOwnProperty('id') && typeof this._options.id === 'string' && this._options.id ? this._options.id : coreuiPanelUtils.hashCode();
      },
      /**
       * Инициализация событий связанных с элементом управления
       */
      initEvents: function () {},
      /**
       * Получение ID элемента управления
       * @returns {string}
       */
      getId: function () {
        return this._id;
      },
      /**
       * Формирование контента для размещения на странице
       * @returns {string}
       */
      render: function () {
        if (typeof this._options.content === 'string') {
          return this._options.content;
        } else if (typeof this._options.content === 'function') {
          return this._options.content();
        }
      }
    };

    coreuiPanel.lang.en = {
      "loading": "Loading..."
    };

    coreuiPanel.lang.ru = {
      "loading": "Загрузка..."
    };

    return coreuiPanel;

}));
