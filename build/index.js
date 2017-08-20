'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reactNative = require('react-native');

var _reactNativeAnimatable = require('react-native-animatable');

var Animatable = _interopRequireWildcard(_reactNativeAnimatable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Dimensions$get = _reactNative.Dimensions.get('window'),
    width = _Dimensions$get.width,
    height = _Dimensions$get.height;

var Toast = void 0;
if (global.Toast) {
  Toast = global.Toast;
} else {
  Toast = {
    message: function message(info) {
      console.log(info);
    }
  };
}

var styles = {
  routerContainer: {
    width: width,
    height: height,
    backgroundColor: '#fff'
  },
  routerPage: {
    position: 'absolute'
  },
  empty: {
    position: 'absolute',
    left: width
  }
};

var animateStyles = {
  enter: {
    width: width,
    height: height,
    position: 'absolute'
  },

  leave: {
    width: width,
    height: height,
    position: 'absolute'
  }
};

function enterContent(cnt) {
  return React.createElement(
    Animatable.View,
    {
      style: animateStyles.enter,
      useNativeDriver: true,
      duration: 400,
      animation: {
        from: {
          translateX: 500
        },
        to: {
          translateX: 0
        }
      }
    },
    cnt
  );
}

function leaveContent(cnt) {
  return React.createElement(
    Animatable.View,
    {
      style: animateStyles.leave,
      useNativeDriver: true,
      duration: 400,
      animation: {
        from: {
          translateX: 0
        },
        to: {
          translateX: 500
        }
      }
    },
    cnt
  );
}

function normalContent(cnt, style, focus) {
  var myAnimation = focus ? 'fadeIn' : {
    from: {
      translateX: 1000
    },
    to: {
      translateX: 1000
    }
  };
  return React.createElement(
    Animatable.View,
    {
      useNativeDriver: true,
      style: style,
      duration: 300,
      animation: 'fadeIn'
    },
    cnt
  );
}

var RouterPageView = function (_React$PureComponent) {
  _inherits(RouterPageView, _React$PureComponent);

  function RouterPageView() {
    _classCallCheck(this, RouterPageView);

    return _possibleConstructorReturn(this, (RouterPageView.__proto__ || Object.getPrototypeOf(RouterPageView)).apply(this, arguments));
  }

  _createClass(RouterPageView, [{
    key: 'render',
    value: function render() {
      var focus = this.props.focus();
      var _props2 = this.props,
          isBack = _props2.isBack,
          isMultiple = _props2.isMultiple,
          history = _props2.history,
          saxer = _props2.saxer,
          select = _props2.select,
          selectData = _props2.selectData,
          index = _props2.index,
          path = _props2.path,
          ctx = _props2.ctx,
          children = _props2.children;

      var focusStyle = focus ? styles.routerPage : styles.empty;
      if (isMultiple) {
        if (isBack) {
          // 关闭open的页面
          var lastOpen = ctx.saxer.get().LastOpen;
          if (lastOpen && (index == lastOpen.select || path == lastOpen.select)) {
            return leaveContent(children);
          }
        } else {
          // open 一个页面
          var lastHistoryItem = history[history.length - 1];
          if (index == lastHistoryItem.select || path == lastHistoryItem.select) {
            return enterContent(children);
          }
        }
      }

      return normalContent(children, focusStyle, focus);
    }
  }]);

  return RouterPageView;
}(React.PureComponent);

var RouterClass = function (_React$Component) {
  _inherits(RouterClass, _React$Component);

  function RouterClass(props) {
    _classCallCheck(this, RouterClass);

    var _this2 = _possibleConstructorReturn(this, (RouterClass.__proto__ || Object.getPrototypeOf(RouterClass)).call(this, props));

    _this2.state = {
      data: _this2.props.data || [],
      select: _this2.props.select || _this2.props.start || 0,
      selectData: _this2.props.selectData || {},
      multiple: false,
      isBack: false
    };

    var initHistory = {
      select: _this2.state.select,
      selectData: _this2.state.selectData,
      multiple: false
    };
    _this2.keyPrefix = Aotoo.uniqueId('router_');
    _this2.state.history = [initHistory];
    _this2.prepaireData = _this2.prepaireData.bind(_this2);
    _this2.getContent = _this2.getContent.bind(_this2);
    _this2.getMyRealContent = _this2.getMyRealContent.bind(_this2);
    _this2.getRealContent = _this2.getRealContent.bind(_this2);
    _this2.getPageX = _this2.getPageX.bind(_this2);
    return _this2;
  }

  _createClass(RouterClass, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var that = this;
      var router = this.saxer.get().MyRouter || {};
      var timmer = new Date().getTime();
      this.prepaireData(this.state);
      if (_reactNative.Platform.OS == 'android') {
        _reactNative.BackHandler.addEventListener('hardwareBackPress', function () {
          var history = that.saxer.get().History;
          if (history.length < 2) {
            Toast.message('再按一次退出');
            var curTime = new Date().getTime();
            if (curTime - timmer < (that.props.duration || 1500)) {
              return false;
            } else {
              timmer = curTime;
              return true;
            }
          } else {
            router.close();
            return true;
          }
        });
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      this.prepaireData(nextState);
    }
  }, {
    key: 'prepaireData',
    value: function prepaireData() {
      var that = this;
      var props = this.props;
      var state = this.state;
      var propsItemStyle = props.style ? props.style : {};

      var contentData = state.data.map(function (item, ii) {
        // 准备内容数据
        return {
          index: ii,
          path: item.path,
          title: item.title,
          idf: item.idf,
          parent: item.parent,
          attr: item.attr,
          content: item.content,
          style: item.style
        };
      });

      this.saxer.append({
        ContentData: contentData
      });
    }
  }, {
    key: 'getContent',
    value: function getContent(id) {
      var select = this.state.select;
      var contents = this.saxer.get().ContentData;
      var selectContent = void 0;

      contents.forEach(function (item) {
        if (id || id == 0) {
          if (item.path == id || item.index == id) {
            selectContent = item.content;
          }
        } else {
          if (item.index == select || item.path == select) {
            selectContent = item.content;
          }
        }
      });
      return selectContent;
    }
  }, {
    key: 'getMyRealContent',
    value: function getMyRealContent(id, data) {
      try {
        var content = this.getContent(id);
        // const router = this.props.router||{}
        var router = this.saxer.get().MyRouter || {};
        var ctx = {
          router: router
        };

        if (typeof content == 'function') {
          var result = content.call(ctx, data || this.state.selectData);
          if (React.isValidElement(result)) return result;
          content = result;
        }

        if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) == 'object') {
          if (content.enter) {
            if (typeof content.enter == 'function') return content.enter.call(ctx, data || this.state.selectData);
          } else {
            if (content.main) {
              return content.main.call(ctx, data || this.state.selectData);
            }
          }
        }
        if (React.isValidElement(content)) return content;else {
          throw '没有返回jsx对象';
        }
      } catch (error) {
        alert('路由页必须返回JSX');
      }
    }
  }, {
    key: 'getRealContent',
    value: function getRealContent(id, data) {
      if (!id) id = this.state.select;
      var historyContent = this.saxer.data['RealContent'];
      if (!historyContent) {
        historyContent = {};
        this.saxer.data['RealContent'] = {};
      }
      if (historyContent[id]) {
        return historyContent[id];
      } else {
        var content = this.getMyRealContent(id, data);
        this.saxer.data['RealContent'][id] = content;
        return content;
      }
    }

    // getPage(){
    //   const isBack = this.state.isBack
    //   const isMultiple = this.state.multiple
    //   const history = this.state.history
    //   const saxer = this.saxer
    //   const select = this.state.select
    //   const selectData = this.state.selectData
    //   var animContent = ''
    //   var baseContentAry = []
    //   var baseContent = []
    //   var contents = []
    //   const keyPrefix = this.keyPrefix

    //   if (isMultiple) {
    //     // const reverseHistory = Aotoo.cloneDeep(history).reverse()
    //     const tmpHistory = JSON.parse(JSON.stringify(history))
    //     const reverseHistory = tmpHistory.reverse()
    //     var count = 0
    //     reverseHistory.forEach( (item, ii) => {
    //       if (count == 0) {
    //         if (ii==0) {
    //           if (isBack) {
    //             if (item.multiple) baseContentAry.unshift(item)
    //             else {
    //               baseContentAry.unshift(item)
    //               count = 1
    //             }
    //           }
    //         } else {
    //           if (item.multiple) {
    //             baseContentAry.unshift(item)
    //           } else {
    //             baseContentAry.unshift(item)
    //             count = 1
    //           }
    //         }
    //       }
    //     })

    //     if (!isBack) {
    //       animContent = this.enterContent()
    //     } else {
    //       animContent = this.leaveContent()
    //     }

    //     baseContent = baseContentAry.map( (item, ii) => {
    //       const _key = keyPrefix+'_'+ii
    //       const originJsx = this.getRealContent(item.select, item.selectData)
    //       return React.cloneElement(originJsx, {key: _key})
    //     })

    //     baseContent.push(React.cloneElement(animContent, {key: keyPrefix+'_'+'animate'}))
    //     return baseContent
    //   }
    //   else {
    //     return this.getRealContent()
    //   }
    // }

  }, {
    key: 'getPageX',
    value: function getPageX() {
      var _this3 = this;

      var isBack = this.state.isBack;
      var isMultiple = this.state.multiple;
      var history = this.state.history;
      var saxer = this.saxer;
      var select = this.state.select;
      var selectData = this.state.selectData;
      var animContent = '';
      var baseContentAry = [];
      var baseContent = [];

      var keyPrefix = this.keyPrefix;
      var contents = this.saxer.get().ContentData;
      var _props = {
        isBack: isBack, isMultiple: isMultiple, history: history, saxer: saxer, select: select, selectData: selectData

        // 同步history到saxer中
      };this.saxer.append({
        History: this.state.history
      });

      return contents.map(function (item, ii) {
        return React.createElement(
          RouterPageView,
          _extends({
            key: keyPrefix + '_' + ii,
            ctx: _this3,
            focus: function focus() {
              return item.index == select || item.path == select;
            },
            index: item.index,
            path: item.path
          }, _props),
          _this3.getRealContent(item.path)
        );
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var curPage = this.getPageX();
      var sty = this.props.style || styles.routerContainer;
      return React.createElement(
        _reactNative.View,
        { style: sty },
        curPage,
        this.props.children
      );
    }
  }]);

  return RouterClass;
}(React.Component);

function getPrev(state, history) {
  if (history.length) {
    var prev = history[history.length - 1];
    if (state.select == prev.select) {
      history.pop();
      return getPrev(state, history);
    } else {
      return prev;
    }
  }
}

var Actions = {
  GOTO: function GOTO(ostate) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var state = this.curState;
    state.isBack = false;
    state.multiple = false;
    state.select = opts.select;
    state.selectData = opts.selectData;
    state.history.push({
      select: opts.select,
      selectData: opts.selectData,
      multiple: false
    });
    return state;
  },

  BACK: function BACK(ostate) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var state = this.curState;
    state.isBack = true;
    state.multiple = false;
    var prev = getPrev(state, state.history);
    if (prev) {
      state.select = prev.select;
      state.selectData = opts.selectData || prev.selectData;
    } else {
      state.select = ostate.select;
      state.selectData = ostate.selectData;
    }
    return state;
  },

  OPEN: function OPEN(ostate) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var state = this.curState;
    state.isBack = false;
    state.multiple = true;
    var prev = state.history[state.history.length - 1];
    if (state.select != opts.select) {
      state.select = prev.select;
      state.selectData = prev.selectData;
      state.history.push({
        select: opts.select,
        selectData: opts.selectData,
        multiple: true
      });
    }
    return state;
  },

  CLOSE: function CLOSE(ostate) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var ctx = arguments[2];

    var state = this.curState;
    state.isBack = true;
    state.multiple = true;
    var prev = state.history.pop();
    if (prev) {
      if (prev.multiple) {
        ctx.saxer.append({
          LastOpen: prev
        });
        var prev2 = state.history[state.history.length - 1];
        state.select = prev2.select;
        state.selectData = opts.selectData || prev2.selectData;
      } else {
        state.multiple = false;
        state.history.push(prev);
        prev = getPrev(state, state.history);
        if (prev) {
          state.select = prev.select;
          state.selectData = opts.selectData || prev.selectData;
        } else {
          state.select = ostate.select;
          state.selectData = ostate.selectData;
        }
      }
    }
    return state;
  }
};

var defaultConfig = {
  props: {
    data: [],
    select: 0,
    selectData: {},
    router: {},
    duration: 1200
  }
};
module.exports = function router() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var sty = arguments[1];

  opts = Aotoo.merge({}, defaultConfig, opts);
  // if (!opts.props) opts.props = {}
  var Router = Aotoo(RouterClass, Actions);
  var extendAction = {
    "$goto": function (rot, data) {
      this.dispatch('GOTO', {
        select: rot,
        selectData: data
      });
    }.bind(Router),

    goto: function (rot, data) {
      this.$goto(rot, data);
    }.bind(Router),

    goback: function (data) {
      this.dispatch('BACK', {
        selectData: data
      });
    }.bind(Router),

    open: function (rot, data) {
      this.dispatch('OPEN', {
        select: rot,
        selectData: data
      });
    }.bind(Router),

    close: function (data) {
      this.dispatch('CLOSE', {
        selectData: data
      });
    }.bind(Router)
  };
  Router.extend(extendAction);
  Router.saxer.append({
    'MyRouter': extendAction
  });
  // opts.props.router = extendAction
  Router.setConfig(opts);
  return Router;
};
//# sourceMappingURL=maps/index.js.map
