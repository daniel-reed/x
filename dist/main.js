'use strict';

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

var x = function () {
    function x() {
        classCallCheck(this, x);
    }

    createClass(x, null, [{
        key: "new",
        value: function _new(promise) {
            var request = new Request();

            return x.returnRequestOrPromise(request, promise);
        }
    }, {
        key: "text",
        value: function text(url, options, promise) {
            var request = new Request();
            var opts = { type: "POST", url: url };
            Object.assign(opts, options);
            request.open(opts);

            x.setTextHeaders(request, opts);
            x.setHeaders(request, opts);
            x.setFunctionOverrides(request, opts);

            var data = opts.hasOwnProperty('data') ? opts.data : undefined;
            request.send(data);

            return x.returnRequestOrPromise(request, promise);
        }
    }, {
        key: "json",
        value: function json(url, options, promise) {
            var request = new Request();
            var opts = { type: "POST", url: url, responseType: "json" };
            Object.assign(opts, options);
            request.open(opts);

            x.setJSONHeaders(request, opts);
            x.setHeaders(request, opts);
            x.setFunctionOverrides(request, opts);

            var data = opts.hasOwnProperty('data') ? JSON.stringify(opts.data) : undefined;
            request.send(data);

            return x.returnRequestOrPromise(request, promise);
        }
    }, {
        key: "proto",
        value: function proto(url, options, promise) {
            var request = new Request();
            var opts = { type: "POST", url: url, responseType: "arraybuffer" };
            Object.assign(opts, options);
            request.open(opts);

            x.setProtoHeaders(request, opts);
            x.setHeaders(request, opts);
            x.setProtoConvert(request, opts);
            x.setFunctionOverrides(request, opts);

            var data = void 0;
            if (opts.hasOwnProperty('data') && typeof opts.data.serializeBinary === 'function') {
                data = opts.data.serializeBinary();
            }
            request.send(data);

            return x.returnRequestOrPromise(request, promise);
        }
    }, {
        key: "setJSONHeaders",
        value: function setJSONHeaders(request, options) {
            x.setXRequestedWithHeader(request, options);
            request.setHeader("Content-Type", "application/json");
        }
    }, {
        key: "setTextHeaders",
        value: function setTextHeaders(request, options) {
            x.setXRequestedWithHeader(request, options);
            request.setHeader("Content-Type", "text/plain");
        }
    }, {
        key: "setProtoHeaders",
        value: function setProtoHeaders(request, options) {
            x.setXRequestedWithHeader(request, options);
            request.setHeader("Content-Type", "application/octet-stream");
        }
    }, {
        key: "setXRequestedWithHeader",
        value: function setXRequestedWithHeader(request, options) {
            if (!options.hasOwnProperty('requestedWith') || options.requestedWith) {
                request.setHeader("X-Requested-With", "XMLHttpRequest");
            }
        }
    }, {
        key: "setHeaders",
        value: function setHeaders(request, options) {
            if (options.hasOwnProperty('headers')) return;

            for (var key in options.headers) {
                if (!options.headers.hasOwnProperty(key)) continue;
                request.setHeader(key, options.headers[key]);
            }
        }
    }, {
        key: "setFunctionOverrides",
        value: function setFunctionOverrides(request, options) {
            if (options.hasOwnProperty('convert')) request.convert = options.convert;
            if (options.hasOwnProperty('onSuccess')) request.onSuccess = options.onSuccess;
            if (options.hasOwnProperty('onError')) request.onError = options.onError;
            if (options.hasOwnProperty('onAbort')) request.onAbort = options.onAbort;
            if (options.hasOwnProperty('onTimeout')) request.onTimeout = options.onTimeout;
        }
    }, {
        key: "setProtoConvert",
        value: function setProtoConvert(request, options) {
            if (!options.hasOwnProperty('proto')) return;
            request.convert = x.buildProtoConvert(options.proto);
        }
    }, {
        key: "isPending",
        value: function isPending(request) {
            if (request === null) return false;
            if (request === undefined) return false;
            if (!request.hasOwnProperty('isPending')) return false;
            return request.isPending();
        }
    }, {
        key: "abort",
        value: function abort(request) {
            if (request === null) return;
            if (request === undefined) return;
            if (!request.hasOwnProperty('abort')) return;
            return request.abort();
        }
    }, {
        key: "buildProtoConvert",
        value: function buildProtoConvert(proto) {
            return function (data, _this) {
                return proto.deserializeBinary(data);
            };
        }
    }, {
        key: "returnRequestOrPromise",
        value: function returnRequestOrPromise(request, promise) {
            if (promise) {
                return request.getPromise();
            }
            return request;
        }
    }]);
    return x;
}();

var Request = function Request() {
    var _this2 = this;

    classCallCheck(this, Request);

    this.open = function (opts) {
        if (!opts.hasOwnProperty('url')) throw "Missing 'url' Parameter";

        var type = opts.hasOwnProperty("type") ? opts.type : "GET";

        _this2.xhr.open(type, opts.url);

        if (opts.hasOwnProperty("responseType")) _this2.xhr.responseType = opts.responseType;
        _this2.xhr.onreadystatechange = _this2.__handleReadyStateChange;
        if (opts.hasOwnProperty("timeout")) {
            _this2.xhr.timeout = opts.timeout;
            _this2.xhr.ontimeout = _this2.__handleTimeout();
        }
    };

    this.isPending = function () {
        switch (_this2.xhr.readyState) {
            case 0:case 4:
                return false;
            default:
                return true;
        }
    };

    this.setHeader = function (k, v) {
        _this2.xhr.setRequestHeader(k, v);
    };

    this.getPromise = function () {
        return _this2.promise;
    };

    this.getResponse = function () {
        return _this2.response;
    };

    this.getError = function () {
        return _this2.error;
    };

    this.getStatus = function () {
        return _this2.status;
    };

    this.hasError = function () {
        return _this2.error !== undefined;
    };

    this.send = function (data) {
        if (data === undefined) return _this2.xhr.send();
        return _this2.xhr.send(data);
    };

    this.abort = function () {
        if (_this2.xhr.readyState === 4 || _this2.xhr.readyState === 0) return;
        return _this2.xhr.abort();
    };

    this.__handleReadyStateChange = function () {
        switch (_this2.xhr.readyState) {
            case XMLHttpRequest.DONE:
                return _this2.__handleDone();
        }
    };

    this.__handleDone = function () {
        if (_this2.xhr.status === 200) return _this2.__handleSuccess();
        if (_this2.xhr.status === 0) return _this2.__handleAborted();
        return _this2.__handleError();
    };

    this.__handleSuccess = function () {
        switch (_this2.xhr.responseType) {
            case "arraybuffer":
                var buffer = _this2.xhr.response;
                if (buffer) {
                    _this2.response = _this2.convert(new Uint8Array(buffer));
                    _this2.status = _this2.xhr.status;
                } else {
                    _this2.response = _this2.convert(new Uint8Array(0));
                    _this2.status = _this2.xhr.status;
                }
                _this2.onSuccess(_this2.response, _this2);
                break;
            case "json":
                _this2.response = _this2.convert(_this2.xhr.response);
                _this2.status = _this2.xhr.status;
                _this2.onSuccess(_this2.response, _this2);
                break;
            default:
                _this2.response = _this2.convert(_this2.xhr.responseText);
                _this2.status = _this2.xhr.status;
                _this2.onSuccess(_this2.response, _this2);
                break;
        }
    };

    this.__handleError = function () {
        _this2.error = _this2.xhr.response;
        _this2.status = _this2.xhr.status;
        _this2.onError(_this2.xhr.response, _this2, _this2.xhr.status);
    };

    this.__handleAborted = function () {
        _this2.error = "aborted";
        _this2.status = 0;
        _this2.onAbort(_this2);
    };

    this.__handleTimeout = function () {
        _this2.error = _this2.xhr.response;
        _this2.status = _this2.xhr.status;
        _this2.onTimeout(_this2);
    };

    this.convert = function (data, _this) {
        return data;
    };

    this.onSuccess = function (response, _this) {
        _this.resolve(_this);
    };

    this.onError = function (response, _this, status) {
        _this.reject(_this);
    };

    this.onAbort = function (_this) {
        _this.reject(_this);
    };

    this.onTimeout = function (_this) {
        _this.reject(_this);
    };

    this.xhr = new XMLHttpRequest();
    this.promise = new Promise(function (resolve, reject) {
        _this2.resolve = resolve;
        _this2.reject = reject;
    });
};

module.exports = x;
//# sourceMappingURL=main.js.map
