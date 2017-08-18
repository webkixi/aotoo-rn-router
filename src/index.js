// const routerData = [
//   {title: 'xxx', path: 'xxx', content: 'bbb', id: 'root' style:{}},
//   {title: 'xxx', path: 'xxx', content: 'bbb', parent: 'root'},
//   {title: 'xxx', path: 'xxx', content: 'bbb', parent: 'root'},

//   {title: 'xxx', path: 'xxx', content: 'bbb', parent: 'root'},
// ]

// router({
//   data: routerData,
//   style: {}
// })

import { Animated, Button, Platform, BackHandler, StyleSheet, Text, View, Dimensions } from 'react-native'
import * as Animatable from 'react-native-animatable'
const {width, height} = Dimensions.get('window');

const styles = {
  routerContainer: {
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
  routerPage: {
    position: 'absolute',
  },
  empty: {
    position: 'absolute',
    left: width
  },
}

const animateStyles = {
  enter: {
    width: width,
    height: height,
    position: 'absolute',
  },

  leave: {
    width: width,
    height: height,
    position: 'absolute',
  }
}


function enterContent(cnt){
  return (
    <Animatable.View
      style={animateStyles.enter}
      useNativeDriver={true}
      duration={400}
      animation={{
        from: {
          translateX: 500
        },
        to: {
          translateX: 0
        }
      }}
    >
      {cnt}
    </Animatable.View>
  )
}

function leaveContent(cnt){
  return (
    <Animatable.View
      style={animateStyles.leave}
      useNativeDriver={true}
      duration={400}
      animation={{
        from: {
          translateX: 0
        },
        to: {
          translateX: 500
        }
      }}
    >
      {cnt}
    </Animatable.View>
  )
}

function normalContent(cnt, style, focus){
  const myAnimation = focus ? 'fadeIn' : {
    from: {
      translateX: 1000
    },
    to: {
      translateX: 1000
    }
  }
  return (
    <Animatable.View
      useNativeDriver={true}
      style={style}
      duration={300}
      animation={'fadeIn'}
    >
      {cnt}
    </Animatable.View>
  )
}

class RouterPageView extends React.PureComponent {
  render(){
    const focus = this.props.focus()
    const {isBack, isMultiple, history, saxer, select, selectData, index, path, ctx, children} = this.props
    let focusStyle = focus ? styles.routerPage : styles.empty
    if (isMultiple) {
      if (isBack) {
        // 关闭open的页面
        const lastOpen = ctx.saxer.get().LastOpen
        if (index == lastOpen.select || path == lastOpen.select){
          return leaveContent(children)
        }
      }
      else {
        // open 一个页面
        const lastHistoryItem = history[history.length-1]
        if (index == lastHistoryItem.select||path == lastHistoryItem.select){
          return enterContent(children)
        }
      }
    }
    
    return normalContent(children, focusStyle, focus)
  }
}

class RouterClass extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[],
      select: this.props.select||this.props.start||0,
      selectData: this.props.selectData || {},
      multiple: false,
      isBack: false
    }

    const initHistory = {
      select: this.state.select,
      selectData: this.state.selectData,
      multiple: false,
    }
    this.keyPrefix = Aotoo.uniqueId('router_')
    this.state.history = [initHistory]
    this.prepaireData = this.prepaireData.bind(this)
    this.getContent = this.getContent.bind(this)
    this.getMyRealContent = this.getMyRealContent.bind(this)
    this.getRealContent = this.getRealContent.bind(this)
    this.getPageX = this.getPageX.bind(this)
  }

  componentWillMount() {
    const that = this
    let timmer
    this.prepaireData(this.state)
    if (Platform.OS  == 'android') {
      BackHandler.addEventListener('hardwareBackPress', function(){
        const history = that.saxer.get().History
        if (timmer) {
          const curTime = new Date().getTime()
          if (curTime - timmer < 2000) {
            return false
          } else {
            timmer = curTime
            that.props.router.close()
            return true
          }
        } else {
          timmer = new Date().getTime()
        }
        return true
      })
    }
  }

  componentWillUpdate(nextProps, nextState){
    this.prepaireData(nextState)
  }

  prepaireData(){
    const that = this
    const props = this.props
    const state = this.state
    var   propsItemStyle = props.style ? props.style : {}

    const contentData = state.data.map( (item, ii) => {
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
      }
    })

    this.saxer.append({
      ContentData: contentData
    })
  }

  getContent(id){
    const select = this.state.select
    const contents = this.saxer.get().ContentData
    let selectContent

    contents.forEach( item => {
      if ( (id||id==0)) {
        if (item.path == id || item.index == id) {
          selectContent = item.content
        }
      } else {
        if (item.index == select || item.path == select) {
          selectContent = item.content
        }
      }
    })
    return selectContent
  }

  getMyRealContent(id, data){
    try {
      let   content = this.getContent(id)
      const router = this.props.router||{}
      const ctx = {
        router: router
      }

      if (typeof content == 'function') {
        const result = content.call(ctx, data||this.state.selectData)
        if (React.isValidElement(result)) return result
        content = result
      }

      if (typeof content == 'object') {
        if (content.enter) {
          if (typeof content.enter == 'function') return content.enter.call(ctx, data||this.state.selectData)
        } else {
          if (content.main) {
            return content.main.call(ctx, data||this.state.selectData)
          }
        }
      }
      if ( React.isValidElement(content)) return content
      else {
        throw '没有返回jsx对象'
      }
    } catch (error) {
      alert('路由页必须返回JSX')
    }
  }

  getRealContent(id, data){
    if (!id) id = this.state.select
    let historyContent = this.saxer.data['RealContent']
    if (!historyContent) {
      historyContent = {}
      this.saxer.data['RealContent'] = {}
    }
    if (historyContent[id]) {
      return historyContent[id]
    } else {
      const content = this.getMyRealContent(id, data)
      this.saxer.data['RealContent'][id] = content
      return content
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

  getPageX(){
    const isBack = this.state.isBack
    const isMultiple = this.state.multiple
    const history = this.state.history
    const saxer = this.saxer
    const select = this.state.select
    const selectData = this.state.selectData
    var animContent = ''
    var baseContentAry = []
    var baseContent = []

    const keyPrefix = this.keyPrefix
    const contents = this.saxer.get().ContentData
    const _props = {
      isBack, isMultiple, history, saxer, select, selectData
    }

    // 同步history到saxer中
    this.saxer.append({
      History: this.state.history
    })

    return contents.map( (item, ii) => 
      <RouterPageView 
        key={keyPrefix+'_'+ii} 
        ctx={this}
        focus={ ()=>item.index==select||item.path==select }
        index={item.index}
        path={item.path}
        {..._props}
      >
        {this.getRealContent(item.path)}
      </RouterPageView>
    )
  }

  render(){
    const curPage = this.getPageX()
    const sty = this.props.style || styles.routerContainer
    return (
      <View style={sty}>
        {curPage}
      </View>
    )
  }
}

function getPrev(state, history){
  if (history.length) {
    var prev = history[history.length-1]
    if (state.select == prev.select) {
      history.pop()
      return getPrev(state, history)
    } else {
      return prev
    }
  }
}

const Actions = {
  GOTO: function(ostate, opts={}){
    var state = this.curState
    state.isBack = false
    state.multiple = false
    state.select = opts.select
    state.selectData = opts.selectData
    state.history.push({
      select: opts.select,
      selectData: opts.selectData,
      multiple: false
    })
    return state
  },

  BACK: function(ostate, opts={}){
    let state = this.curState
    state.isBack = true
    state.multiple = false
    const prev = getPrev(state, state.history)
    if (prev) {
      state.select = prev.select
      state.selectData = opts.selectData || prev.selectData
    } else {
      state.select = ostate.select
      state.selectData = ostate.selectData
    }
    return state
  },

  OPEN: function(ostate, opts={}){
    var state = this.curState
    state.isBack = false
    state.multiple = true
    var prev = state.history[state.history.length-1]
    if (state.select != opts.select) {
      state.select = prev.select
      state.selectData = prev.selectData
      state.history.push({
        select: opts.select,
        selectData: opts.selectData,
        multiple: true
      })
    }
    return state
  },

  CLOSE: function(ostate, opts={}, ctx){
    var state = this.curState
    state.isBack = true
    state.multiple = true
    var prev = state.history.pop()
    if (prev) {
      if (prev.multiple) {
        ctx.saxer.append({
          LastOpen: prev
        })
        const prev2 = state.history[state.history.length-1]
        state.select = prev2.select
        state.selectData = opts.selectData || prev2.selectData
      } else {
        state.multiple = false
        state.history.push(prev)
        prev = getPrev(state, state.history)
        if (prev) {
          state.select = prev.select
          state.selectData = opts.selectData || prev.selectData
        } else {
          state.select = ostate.select
          state.selectData = ostate.selectData
        }
      }
    }
    return state
  }
}

// function convTimestamp(time){
//   var arr = time.split(/[- :]/),
//       _date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]),
//       timeStr = Date.parse(_date);
//   return timeStr
// }

module.exports = function router(opts={}, sty){
  if (!opts.props) opts.props = {}
  const Router = Aotoo(RouterClass, Actions)
  const extendAction = {
    "$goto": function(rot, data){
      this.dispatch('GOTO', {
        select: rot,
        selectData: data
      })
    }.bind(Router),

    goto: function(rot, data){
      this.$goto(rot, data)
    }.bind(Router),

    goback: function(data){
      this.dispatch('BACK', {
        selectData: data
      })
    }.bind(Router),

    open: function(rot, data){
      this.dispatch('OPEN', {
        select: rot,
        selectData: data
      })
    }.bind(Router),

    close: function(data){
      this.dispatch('CLOSE', {
        selectData: data
      })
    }.bind(Router),
  }
  Router.extend(extendAction)
  opts.props.router = extendAction
  Router.setConfig(opts)
  return Router
}
