"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = function Request() {
    var _this2 = this;

    _classCallCheck(this, Request);

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
            case "json":
                _this2.success(_this2.convert(_this2.xhr.response), _this2);
                break;
            default:
                _this2.success(_this2.convert(_this2.xhr.responseText), _this2);
                break;
        }
    };

    this.__handleError = function () {
        _this2.error(_this2.xhr.response, _this2, _this2.xhr.status);
    };

    this.__handleAborted = function () {
        _this2.aborted(_this2);
    };

    this.__handleTimeout = function () {
        _this2.timeout(_this2);
    };

    this.convert = function (data, _this) {
        return data;
    };

    this.success = function (response, _this) {};

    this.error = function (response, _this, status) {};

    this.aborted = function (_this) {};

    this.timeout = function (_this) {};

    this.xhr = new XMLHttpRequest();
};

exports.default = Request;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Request = require('./Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var x = function () {
    function x() {
        _classCallCheck(this, x);
    }

    _createClass(x, null, [{
        key: 'text',
        value: function text(url, options) {
            var request = new _Request2.default();
            var opts = { type: "POST", url: url };
            Object.assign(opts, options);
            request.open(opts);

            x.setTextHeaders(request);
            x.setHeaders(request, opts);
            x.setFunctionOverrides(request, opts);

            var data = opts.hasOwnProperty('data') ? opts.data : undefined;
            request.send(data);
        }
    }, {
        key: 'json',
        value: function json(url, options) {
            var request = new _Request2.default();
            var opts = { type: "POST", url: url, responseType: "json" };
            Object.assign(opts, options);
            request.open(opts);

            x.setJSONHeaders(request);
            x.setHeaders(request, opts);
            x.setFunctionOverrides(request, opts);

            var data = opts.hasOwnProperty('data') ? JSON.stringify(opts.data) : undefined;
            request.send(data);
        }
    }, {
        key: 'setJSONHeaders',
        value: function setJSONHeaders(request) {
            request.setHeader("X-Requested-With", "XMLHttpRequest");
            request.setHeader("Content-Type", "application/json");
        }
    }, {
        key: 'setTextHeaders',
        value: function setTextHeaders(request) {
            request.setHeader("X-Requested-With", "XMLHttpRequest");
            request.setHeader("Content-Type", "text/plain");
        }
    }, {
        key: 'setHeaders',
        value: function setHeaders(request, options) {
            if (options.hasOwnProperty('headers')) return;

            for (var key in options.headers) {
                if (!options.headers.hasOwnProperty(key)) continue;
                request.setHeader(key, options.headers[key]);
            }
        }
    }, {
        key: 'setFunctionOverrides',
        value: function setFunctionOverrides(request, options) {
            if (options.hasOwnProperty('convert')) request.convert = options.convert;
            if (options.hasOwnProperty('success')) request.success = options.success;
            if (options.hasOwnProperty('error')) request.error = options.error;
            if (options.hasOwnProperty('aborted')) request.aborted = options.aborted;
            if (options.hasOwnProperty('timeout')) request.timeout = options.timeout;
        }
    }, {
        key: 'isPending',
        value: function isPending(request) {
            if (request === null) return false;
            if (request === undefined) return false;
            if (!request.hasOwnProperty('isPending')) return false;
            return request.isPending();
        }
    }, {
        key: 'abort',
        value: function abort(request) {
            if (request === null) return;
            if (request === undefined) return;
            if (!request.hasOwnProperty('abort')) return;
            return request.abort();
        }
    }]);

    return x;
}();

exports.default = x;
