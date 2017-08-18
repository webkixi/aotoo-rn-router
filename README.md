# aotoo-rn-router 端内置插件库  

## USAGE
```js
/*
 * config: 路由配置文件, 
 * config.props: 路由react class的props
 * styles: 路由样式表
*/
router(config, styles)
```

## CODE

```js
import aotoo from 'aotoo'
require('aotoo-rn-widgets')
const router = require('aotoo-rn-router')

const contents = {
  first: require('./some/first'),
  page2: require('./some/page2'),
  page3: require('./some/page3'),
  detail: require('./some/detail')
}

const routerData = [
  {title: 'first', path: 'first', content: contents.first},
  {title: 'page2', path: 'page2', content: contents.page2},
  {title: 'page3', path: 'page3', content: contents.page3},
  {title: 'detail', path: 'detail', content: contents.detail},
]

const routerIns = router({ 
  props: { 
    data: routerData, 
    start: 0 
  }
})

routerIns.rendered = function(){
  setTimeout(function(){
    routerIns.goto('/path', {param})
  }, 3000)
}

return routerIns.render()

```