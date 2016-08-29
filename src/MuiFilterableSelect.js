import React, { Component } from 'react';
import _ from 'underscore';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class MuiFilterableValueSelect extends Component {
    static displayName = 'MuiFilterableValueSelect';
    static propTypes = {
        options: React.PropTypes.array,
        filter(props, propName, componentName) {
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
    };
    static defaultProps = {
        options: [],
        filter: undefined,
        matchPos: "any",
        onChange: undefined
    };
    state = {};
    _updateFilter(props) {
        this._filterFunc = _makeFilterFunc(props);
        if (this._filterFunc)
            this._filterFunc=this._filterFunc.bind(this);
        this._filterMapFunc = _makeFilterMapFunc(props);
        if (this._filterMapFunc)
            this._filterMapFunc=this._filterMapFunc.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this._updateFilter(nextProps);
    }
    componentWillMount() {
        this._updateFilter(this.props);
        this._performFilter(this.props);
        this.setState({value: this.props.defaultValue});
    }
    _propOrState(key) {
        return this.props[key] || this.state[key];
    }
    _initiateValueChange(opt) {
        if (opt && (typeof opt !== 'string'))
            opt = opt.value;
        var emitChange = () => {
            if (typeof this.props.onChange === 'function')
                this.props.onChange(opt);
        };
        var isControlled = (this.props.value !== undefined);
        if (!isControlled)
            this.setState({value: opt}, emitChange);
        else
            emitChange();
    }
    _handleChange = (e, selectedIndex, value) => {
        this._initiateValueChange(value);
    }
    _performFilter(nextProps) {
        var options = [];
        if (nextProps.options && nextProps.options.length)
            options = nextProps.options;
        if (this._filterFunc)
        {
            if (this._filterMapFunc)
                options = options.filter((option) => this._filterFunc(this._filterMapFunc(option)));
            else
                options = options.filter(this._filterFunc);
        }
        this._filteredOptions = options;
    }
    componentWillUpdate(nextProps, nextState) {
        this._performFilter(nextProps);
        var nextValue = nextProps.value || nextState.value;
        if (this._filteredOptions.length && !_.contains(this._filteredOptions.map(opt => (typeof opt === 'string')?opt:opt.value),nextValue))
            this._initiateValueChange(this._filteredOptions.length ? this._filteredOptions[0] : undefined);
    }
    componentDidMount() {
        this._performFilter(this.props);
        var nextValue = this.props.value || this.state.value;
        if (this._filteredOptions.length && !_.contains(this._filteredOptions.map(opt => (typeof opt === 'string')?opt:opt.value),nextValue))
            this._initiateValueChange(this._filteredOptions.length ? this._filteredOptions[0] : undefined);
    }
    render() {
        const value = this._propOrState('value');
        const {options, filter, matchPos, matchProp, onChange, ...props} = this.props;
        return (
            <DropDownMenu
            {...props}
                onChange={this._handleChange}
                value={value}
                autoWidth={true}
            >
            {
                this._filteredOptions
                    .map((opt, index) => {
                        var value, label;
                        if (typeof opt === 'string')
                            value=label=opt;
                        else
                        {
                            value=opt.value;
                            label=opt.label;
                        }
                        return <MenuItem key={value || index} value={value} primaryText={label} />;
                    })
            }
            </DropDownMenu>
        );
    }
};

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
    return value => filterRgx.test(value);
}

function _stringFilter(filterStr, matchPos) {
    return (matchPos === 'start')  ?
        value => value.indexOf(filterStr) === 0
        : value => value.contains(filterStr);
}

function _makeFilterMapFunc(props) {
    if (typeof props.filter !== 'string')
        return null;
    switch (props.matchProp) {
        case 'any':
            return option => typeof option === 'string' ? option : [option.value, option.label];
        default:
            return option => typeof option === 'string' ? option:option[props.matchProp];
    }
}
