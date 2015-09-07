var React = require('react');
var _ = require('underscore');
var mui = require('material-ui');
var DropDownMenu = mui.DropDownMenu;

var MuiFilterableValueSelect = module.exports = React.createClass({
    displayName: 'MuiFilterableValueSelect',
    propTypes: {
        options: React.PropTypes.array,
        filter:function(props, propName, componentName) {
	        try {
	        	_makeFilterFunc(props);
                _makeFilterMapFunc(props);
	        }
	        catch (e)
	        {
	        	return e;
	        }
		},
		matchPos: React.PropTypes.oneOf(['any','start']),
		matchProp: React.PropTypes.string,
		onChange: React.PropTypes.func
    },
    getDefaultProps:function() {
    	return {
    		options: [],
    		filter: undefined,
    		matchPos: "any",
    		onChange: undefined
    	};
    },
    _stringFilter: _stringFilter,
    _regexFilter: _regexFilter,
    _makeFilterFunc: _makeFilterFunc,
    _makeFilterMapFunc: _makeFilterMapFunc,
    _updateFilter:function(props) {
    	this._filterFunc = this._makeFilterFunc(props);
    	if (this._filterFunc)
    		this._filterFunc=this._filterFunc.bind(this);
    	this._filterMapFunc = this._makeFilterMapFunc(props);
    	if (this._filterMapFunc)
    		this._filterMapFunc=this._filterMapFunc.bind(this);
    },
    componentWillReceiveProps:function(nextProps) {
        this._updateFilter(nextProps);
    },
    componentWillMount:function() {
        this._updateFilter(this.props);
        this._performFilter(this.props);
    	this.setState({value: this.props.defaultValue});
    },
    _propOrState:function(key) {
    	return this.props[key] || this.state[key];
    },
    _initiateValueChange:function(opt) {
    	if (opt && (typeof opt !== 'string'))
    		opt = opt.value;
    	var emitChange = function()  {
    		if (typeof this.props.onChange === 'function')
    			this.props.onChange(opt);
    	}.bind(this);
    	var isControlled = (this.props.value !== undefined);
    	if (!isControlled)
    		this.setState({value: opt}, emitChange);
    	else
    		emitChange();
    },
    _handleChange:function(e, selectedIndex, menuItem) {
    	this._initiateValueChange(menuItem.payload);
    },
    _performFilter:function(nextProps) {
		var options = [];
    	if (nextProps.options && nextProps.options.length)
    		options = nextProps.options;
    	if (this._filterFunc)
    	{
    		if (this._filterMapFunc)
    			options = options.filter(function(option)  {return this._filterFunc(this._filterMapFunc(option));}.bind(this));
            else
                options = options.filter(this._filterFunc);
		}
		this._filteredOptions = options;
    },
    componentWillUpdate:function(nextProps, nextState) {
    	this._performFilter(nextProps);
	    var nextValue = nextProps.value || nextState.value;
	    if (this._filteredOptions.length && !_.contains(this._filteredOptions.map(function(opt)  {return (typeof opt === 'string')?opt:opt.value;}),nextValue))
	    	this._initiateValueChange(this._filteredOptions.length ? this._filteredOptions[0] : undefined);
    },
    componentDidMount: function () {
        this._performFilter(this.props);
        var nextValue = this.props.value || this.state.value;
        if (this._filteredOptions.length && !_.contains(this._filteredOptions.map(function(opt)  {return (typeof opt === 'string')?opt:opt.value;}),nextValue))
            this._initiateValueChange(this._filteredOptions.length ? this._filteredOptions[0] : undefined);  
    },
    render:function() {
        var selectedIndex = this._filteredOptions
                .map(function(opt)  {return typeof opt === 'string' ? opt : opt.value;})
                .indexOf(this._propOrState('value'));
        if (selectedIndex < 0)
            selectedIndex = 0;
        return (
			React.createElement(DropDownMenu, React.__spread({},  this.props, {onChange: this._handleChange, 
            selectedIndex: selectedIndex, 
            menuItems: 
                this._filteredOptions
                    .map(function(opt)  {
                        var value, label;
                        if (typeof opt === 'string')
                            value=label=opt;
                        else
                        {
                            value=opt.value;
                            label=opt.label;
                        }
                        return {payload: value || '', text: label || ''};
                    }), 
            
            autoWidth: true})
            )
        );
    }
});

function _makeFilterFunc(props) {
    var filter = props.filter;
    if (!filter)
        return null;
    if (typeof filter === 'function')
        return filter;
    if (typeof filter === 'string')
        return _stringFilter(filter, props.matchPos);
    if (Object.prototype.toString.call(filter) === '[object RegExp]')
        return _regexFilter(filter);
    throw new TypeError('Invalid filter type');
}

function _regexFilter(filterRgx) {
    return function(value)  {return filterRgx.test(value);};
}

function _stringFilter(filterStr, matchPos) {
    return (matchPos === 'start')  ?
        function(value)  {return value.indexOf(filterStr) === 0;}
        : function(value)  {return value.contains(filterStr);};
}

function _makeFilterMapFunc(props) {
    if (typeof props.filter !== 'string')
        return null;
    switch (props.matchProp) {
        case 'any':
            return function(option)  {return typeof option === 'string' ? option : [option.value, option.label];};
        default:
            return function(option)  {return typeof option === 'string' ? option:option[props.matchProp];};
    }
}
