'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _DropDownMenu = require('material-ui/DropDownMenu');

var _DropDownMenu2 = _interopRequireDefault(_DropDownMenu);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MuiFilterableValueSelect = function (_Component) {
    _inherits(MuiFilterableValueSelect, _Component);

    function MuiFilterableValueSelect() {
        var _Object$getPrototypeO;

        var _temp, _this, _ret;

        _classCallCheck(this, MuiFilterableValueSelect);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MuiFilterableValueSelect)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {}, _this._handleChange = function (e, selectedIndex, value) {
            _this._initiateValueChange(value);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(MuiFilterableValueSelect, [{
        key: '_updateFilter',
        value: function _updateFilter(props) {
            this._filterFunc = _makeFilterFunc(props);
            if (this._filterFunc) this._filterFunc = this._filterFunc.bind(this);
            this._filterMapFunc = _makeFilterMapFunc(props);
            if (this._filterMapFunc) this._filterMapFunc = this._filterMapFunc.bind(this);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this._updateFilter(nextProps);
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this._updateFilter(this.props);
            this._performFilter(this.props);
            this.setState({ value: this.props.defaultValue });
        }
    }, {
        key: '_propOrState',
        value: function _propOrState(key) {
            return this.props[key] || this.state[key];
        }
    }, {
        key: '_initiateValueChange',
        value: function _initiateValueChange(opt) {
            var _this2 = this;

            if (opt && typeof opt !== 'string') opt = opt.value;
            var emitChange = function emitChange() {
                if (typeof _this2.props.onChange === 'function') _this2.props.onChange(opt);
            };
            var isControlled = this.props.value !== undefined;
            if (!isControlled) this.setState({ value: opt }, emitChange);else emitChange();
        }
    }, {
        key: '_performFilter',
        value: function _performFilter(nextProps) {
            var _this3 = this;

            var options = [];
            if (nextProps.options && nextProps.options.length) options = nextProps.options;
            if (this._filterFunc) {
                if (this._filterMapFunc) options = options.filter(function (option) {
                    return _this3._filterFunc(_this3._filterMapFunc(option));
                });else options = options.filter(this._filterFunc);
            }
            this._filteredOptions = options;
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            this._performFilter(nextProps);
            var nextValue = nextProps.value || nextState.value;
            if (this._filteredOptions.length && !_underscore2.default.contains(this._filteredOptions.map(function (opt) {
                return typeof opt === 'string' ? opt : opt.value;
            }), nextValue)) this._initiateValueChange(this._filteredOptions.length ? this._filteredOptions[0] : undefined);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._performFilter(this.props);
            var nextValue = this.props.value || this.state.value;
            if (this._filteredOptions.length && !_underscore2.default.contains(this._filteredOptions.map(function (opt) {
                return typeof opt === 'string' ? opt : opt.value;
            }), nextValue)) this._initiateValueChange(this._filteredOptions.length ? this._filteredOptions[0] : undefined);
        }
    }, {
        key: 'render',
        value: function render() {
            var value = this._propOrState('value');
            var _props = this.props;
            var options = _props.options;
            var filter = _props.filter;
            var matchPos = _props.matchPos;
            var matchProp = _props.matchProp;
            var onChange = _props.onChange;

            var props = _objectWithoutProperties(_props, ['options', 'filter', 'matchPos', 'matchProp', 'onChange']);

            return _react2.default.createElement(
                _DropDownMenu2.default,
                _extends({}, props, {
                    onChange: this._handleChange,
                    value: value,
                    autoWidth: true
                }),
                this._filteredOptions.map(function (opt, index) {
                    var value, label;
                    if (typeof opt === 'string') value = label = opt;else {
                        value = opt.value;
                        label = opt.label;
                    }
                    return _react2.default.createElement(_MenuItem2.default, { key: value || index, value: value, primaryText: label });
                })
            );
        }
    }]);

    return MuiFilterableValueSelect;
}(_react.Component);

MuiFilterableValueSelect.displayName = 'MuiFilterableValueSelect';
MuiFilterableValueSelect.propTypes = {
    options: _react2.default.PropTypes.array,
    filter: function filter(props, propName, componentName) {
        try {
            _makeFilterFunc(props);
            _makeFilterMapFunc(props);
        } catch (e) {
            return e;
        }
    },

    matchPos: _react2.default.PropTypes.oneOf(['any', 'start']),
    matchProp: _react2.default.PropTypes.string,
    onChange: _react2.default.PropTypes.func
};
MuiFilterableValueSelect.defaultProps = {
    options: [],
    filter: undefined,
    matchPos: "any",
    onChange: undefined
};
exports.default = MuiFilterableValueSelect;
;

function _makeFilterFunc(props) {
    var filter = props.filter;
    if (!filter) return null;
    if (typeof filter === 'function') return filter;
    if (typeof filter === 'string') return _stringFilter(filter, props.matchPos);
    if (Object.prototype.toString.call(filter) === '[object RegExp]') return _regexFilter(filter);
    throw new TypeError('Invalid filter type');
}

function _regexFilter(filterRgx) {
    return function (value) {
        return filterRgx.test(value);
    };
}

function _stringFilter(filterStr, matchPos) {
    return matchPos === 'start' ? function (value) {
        return value.indexOf(filterStr) === 0;
    } : function (value) {
        return value.contains(filterStr);
    };
}

function _makeFilterMapFunc(props) {
    if (typeof props.filter !== 'string') return null;
    switch (props.matchProp) {
        case 'any':
            return function (option) {
                return typeof option === 'string' ? option : [option.value, option.label];
            };
        default:
            return function (option) {
                return typeof option === 'string' ? option : option[props.matchProp];
            };
    }
}