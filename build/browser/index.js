var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var XOptions = function XOptions(url) {
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "GET";
    var rt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "text";
    var timeout = arguments[3];
    classCallCheck(this, XOptions);

    this.url = url;
    this.method = method;
    this.responseType = rt;
    this.timeout = timeout;
    this.headers = {};
    this.requestedWith = true;
};
var XRequest = function () {
    function XRequest() {
        var _this = this;

        classCallCheck(this, XRequest);

        this.xhr = new XMLHttpRequest();
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
        this.convert = function (d) {
            return d;
        };
    }

    createClass(XRequest, [{
        key: "open",
        value: function open(opts) {
            if (!opts.hasOwnProperty('url')) throw "Missing 'url' Parameter";
            var method = opts.method;
            this.xhr.open(method, opts.url);
            this.xhr.responseType = opts.responseType;
            this.xhr.onreadystatechange = this.__handleReadyStateChange.bind(this);
            if (typeof opts.timeout === "number") {
                this.xhr.timeout = opts.timeout;
                this.xhr.ontimeout = this.__handleTimeout();
            }
        }
    }, {
        key: "isPending",
        value: function isPending() {
            switch (this.xhr.readyState) {
                case 0:
                case 4:
                    return false;
                default:
                    return true;
            }
        }
    }, {
        key: "setHeader",
        value: function setHeader(k, v) {
            this.xhr.setRequestHeader(k, v);
        }
    }, {
        key: "getPromise",
        value: function getPromise() {
            return this.promise;
        }
    }, {
        key: "getResponse",
        value: function getResponse() {
            return this.response;
        }
    }, {
        key: "getError",
        value: function getError() {
            return this.error;
        }
    }, {
        key: "getStatus",
        value: function getStatus() {
            return this.status;
        }
    }, {
        key: "hasError",
        value: function hasError() {
            return this.error !== undefined;
        }
    }, {
        key: "send",
        value: function send(data) {
            if (data === undefined) return this.xhr.send();
            return this.xhr.send(data);
        }
    }, {
        key: "abort",
        value: function abort() {
            if (this.xhr.readyState === 4 || this.xhr.readyState === 0) return;
            return this.xhr.abort();
        }
    }, {
        key: "__handleReadyStateChange",
        value: function __handleReadyStateChange() {
            switch (this.xhr.readyState) {
                case XMLHttpRequest.DONE:
                    return this.__handleDone();
            }
        }
    }, {
        key: "__handleDone",
        value: function __handleDone() {
            if (this.xhr.status === 200) return this.__handleSuccess();
            if (this.xhr.status === 0) return this.__handleAborted();
            return this.__handleError();
        }
    }, {
        key: "__handleSuccess",
        value: function __handleSuccess() {
            switch (this.xhr.responseType) {
                case "arraybuffer":
                    var buffer = this.xhr.response;
                    if (buffer) {
                        this.response = this.convert(new Uint8Array(buffer), this);
                        this.status = this.xhr.status;
                    } else {
                        this.response = this.convert(new Uint8Array(0), this);
                        this.status = this.xhr.status;
                    }
                    this.onSuccess();
                    break;
                case "json":
                    this.response = this.convert(this.xhr.response, this);
                    this.status = this.xhr.status;
                    this.onSuccess();
                    break;
                default:
                    this.response = this.convert(this.xhr.responseText, this);
                    this.status = this.xhr.status;
                    this.onSuccess();
                    break;
            }
        }
    }, {
        key: "__handleError",
        value: function __handleError() {
            this.error = this.xhr.response;
            this.status = this.xhr.status;
            this.onError();
        }
    }, {
        key: "__handleAborted",
        value: function __handleAborted() {
            this.error = "aborted";
            this.status = 0;
            this.onAbort();
        }
    }, {
        key: "__handleTimeout",
        value: function __handleTimeout() {
            this.error = "timeout";
            this.status = this.xhr.status;
            this.onTimeout();
        }
    }, {
        key: "onSuccess",
        value: function onSuccess() {
            this.resolve(this);
        }
    }, {
        key: "onError",
        value: function onError() {
            this.reject(this);
        }
    }, {
        key: "onAbort",
        value: function onAbort() {
            this.reject(this);
        }
    }, {
        key: "onTimeout",
        value: function onTimeout() {
            this.reject(this);
        }
    }]);
    return XRequest;
}();

function isBinarySerializer(object) {
    return 'serializeBinary' in object && typeof object.serializeBinary === "function";
}

function XText(url, options) {
    var request = new XRequest();
    var opts = Object.create(options);
    opts.url = url;
    var data = opts.data ? opts.data : undefined;
    if (opts.data !== null && opts.data !== undefined) {
        opts.method = "POST";
    }
    request.open(opts);
    setTextHeaders(request, opts);
    setHeaders(request, opts);
    setFunctionOverrides(request, opts);
    request.send(data);
    return request;
}
function XJson(url, options) {
    var request = new XRequest();
    var opts = Object.create(options);
    opts.url = url;
    opts.responseType = "json";
    var data = opts.data ? opts.data : undefined;
    if (opts.data !== null && opts.data !== undefined) {
        opts.method = "POST";
    }
    request.open(opts);
    setJSONHeaders(request, opts);
    setHeaders(request, opts);
    setFunctionOverrides(request, opts);
    request.send(data);
    return request;
}
function XProto(url, options) {
    var request = new XRequest();
    var opts = Object.create(options);
    opts.url = url;
    opts.responseType = "arraybuffer";
    var data = opts.data ? opts.data : undefined;
    if (opts.data !== null && opts.data !== undefined) {
        opts.method = "POST";
    }
    request.open(opts);
    setProtoHeaders(request, opts);
    setHeaders(request, opts);
    setProtoConvert(request, opts);
    setFunctionOverrides(request, opts);
    if (isBinarySerializer(data)) {
        request.send(data.serializeBinary());
    } else {
        request.send(data);
    }
    return request;
}
function setHeaders(request, options) {
    if (options.hasOwnProperty('headers')) return;
    for (var key in options.headers) {
        request.setHeader(key, options.headers[key]);
    }
}
function setXRequestedWithHeader(request, options) {
    if (!options.hasOwnProperty('requestedWith') || options.requestedWith) {
        request.setHeader("X-Requested-With", "XMLHttpRequest");
    }
}
function setTextHeaders(request, options) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Type", "text/plain");
}
function setJSONHeaders(request, options) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Type", "application/json");
}
function setProtoHeaders(request, options) {
    setXRequestedWithHeader(request, options);
    request.setHeader("Content-Types", "application/octet-stream");
}
function setFunctionOverrides(request, options) {
    if (options.hasOwnProperty('convert')) request.convert = options.convert;
}
function setProtoConvert(request, options) {
    if (!options.hasOwnProperty('proto')) request.convert = buildProtoConvert(options.proto);
}
function buildProtoConvert(proto) {
    return function (data) {
        return proto.deserializeBinary(data);
    };
}

var X = function () {
    function X() {
        classCallCheck(this, X);
    }

    createClass(X, null, [{
        key: "text",
        value: function text(url, options) {
            return XText(url, options);
        }
    }, {
        key: "json",
        value: function json(url, options) {
            return XJson(url, options);
        }
    }, {
        key: "proto",
        value: function proto(url, options) {
            return XProto(url, options);
        }
    }, {
        key: "abort",
        value: function abort(request) {
            if (request instanceof XRequest) {
                request.abort();
            }
        }
    }, {
        key: "isPending",
        value: function isPending(request) {
            if (request instanceof XRequest) {
                return request.isPending();
            }
            return false;
        }
    }, {
        key: "new",
        value: function _new() {
            return new XRequest();
        }
    }]);
    return X;
}();

export { XRequest, XOptions };
export default X;
//# sourceMappingURL=index.js.map
