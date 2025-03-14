import store from '@/store'
/** 扁平化数据转树结构数据 */
export function treeData(menuList, id, parentId, children) {
  const list = JSON.parse(JSON.stringify(menuList))
  return list.filter((father) => {
    // eslint-disable-next-line eqeqeq
    const childList = list.filter((child) => father[id] == child[parentId])
    // eslint-disable-next-line
    childList.length > 0 ? (father[children] = childList) : ''
    //  最上级父元素id为0  根据顶级父元素id设置
    return Number(father[parentId]) === 0 || null || ''
  })
}
/**  树结构数据转扁平化数据 */
const getNodeMap = (node, parentNode) => {
  node.parentNode = parentNode
  const nodeMap = [node]
  if (node.children && node.children.length) {
    node.children.forEach((item) => nodeMap.push(...getNodeMap(item, node)))
  }
  return nodeMap
}

export const getTreeMap = (tree) => {
  if (!(tree instanceof Array)) return
  const treeMap = []
  tree.forEach((node) => {
    treeMap.push(...getNodeMap(node, tree))
  })
  return treeMap
}

/* 时间戳对比 */
export function computationTime(time1, time2) {
  console.log(time1, time2)
  if (time1 && time2) {
    var date1 = new Date(time1)
    var date2 = new Date(time2)
    var s1 = date1.getTime()
    var s2 = date2.getTime()
    var total = (s2 - s1) / 1000
    return total / 60
  } else {
    return 1
  }
}

/**  时间转换 */
export function myFunction(time) {
  var dateee = new Date(time).toJSON()
  var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
  return date
}
/**  获取指定日期为那一年第几周 */
export function getYearWeek(time) {
  time = new Date(time)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  const date = time.getDate()
  const dateNow = new Date(year, parseInt(month) - 1, date)
  const dateFirst = new Date(year, 0, 1)
  const dataNumber = Math.round(
    (dateNow.valueOf() - dateFirst.valueOf()) / 86400000
  )
  return [year, Math.ceil((dataNumber + (dateFirst.getDay() + 1 - 1)) / 7)]
}

export function getHalfCheckeds(arr, list, id, newArr) {
  list.map((item) => {
    if (item.id === id && item.children) {
      newArr.push(id)
      getHalfCheckeds(arr, item.children, id, newArr)
    } else if (item.id !== id && item.children) {
      getHalfCheckeds(arr, item.children, id, newArr)
    }
  })
}

/**
 * 两个数组对象 取差值
 *  @a 数组
 *  @b 数组
 */
export function takeDifferenceSet(a, b) {
  return [...b].filter((x) =>
    [...a].every((y) => (y.id ? y.id !== x.id : y !== x))
  )
}
/**  秒转成 xx天xx小时xx分钟 */
export function formatSeconds(value) {
  var theTime = parseInt(value) // 需要转换的时间秒
  var theTime1 = 0 // 分
  var theTime2 = 0 // 小时
  var theTime3 = 0 // 天
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
      if (theTime2 > 24) {
        // 大于24小时
        theTime3 = parseInt(theTime2 / 24)
        theTime2 = parseInt(theTime2 % 24)
      }
    }
  }
  var result = ''
  if (theTime > 0) {
    result = '' + parseInt(theTime) + '秒'
  }
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result
  }
  if (theTime3 > 0) {
    result = '' + parseInt(theTime3) + '天' + result
  }
  return result
}

/* 数字大写转小写 */
export function smallToBig(money) {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 最大处理的数字
  const maxNum = 9999999999999999.99
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money

    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        // alert(cnNums[parseInt(n)])
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}

/** 浏览器尺寸变化监听 */
export function windowOnresize() {
  var docWidth = document.body.clientWidth
  if (docWidth <= 1300) {
    store.dispatch('app/closeSideBar', {
      withoutAnimation: false
    })
    store.dispatch('settings/changeSetting', {
      key: 'sidebarLogo',
      value: false
    })
  } else {
    store.dispatch('app/openSideBar', {
      withoutAnimation: false
    })
    store.dispatch('settings/changeSetting', {
      key: 'sidebarLogo',
      value: true
    })
  }
}

/** 树结构转扁平 */
export function treeToList(treeList) {
  var queen = []
  var out = []
  queen = queen.concat(treeList)
  while (queen.length) {
    var first = queen.shift()
    if (first.children) {
      queen = queen.concat(first.children)
      delete first['children']
    }
    out.push(first)
  }
  return out
}

/**
 * @description:  树结构数据递归关键字模糊查询，
 * @param value  查询关键字
 * @param arr   数组源
 * @param keyWordArr 查询关键字键名数组
 * @return newarr 过滤后的数组
 */
export function mapTree(value = '', arr = [], keyWordArr = []) {
  if (value === '') return arr
  const newarr = []
  arr.forEach((element) => {
    if (
      keyWordArr.some(
        (item) =>
          element[item].toLocaleUpperCase().indexOf(value.toLocaleUpperCase()) >
          -1
      )
    ) {
      // 删掉children
      const obj = Object.assign({}, element)
      delete obj.children
      newarr.push(obj)
    } else {
      if (element.children && element.children.length > 0) {
        const redata = mapTree(value, element.children, keyWordArr)
        if (redata && redata.length > 0) {
          const obj = {
            ...element,
            children: redata
          }
          newarr.push(obj)
        }
      }
    }
  })
  return newarr
}

/**
 * @description: 获取当前日期是周几
 * @param {*} date
 * @return {*}
 */
export function getweekday(date) {
  // date例如:'2022-03-05'
  var weekArray = new Array(
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  )
  var week = weekArray[new Date(date).getDay()]
  return week
}
export function getCurrentDate() {
  var myDate = new Date()
  var year = myDate.getFullYear() // 年
  var month = myDate.getMonth() + 1 // 月
  var day = myDate.getDate() // 日
  const hh = new Date().getHours()
  const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  var days = myDate.getDay()
  switch (days) {
    case 1:
      days = '星期一'
      break
    case 2:
      days = '星期二'
      break
    case 3:
      days = '星期三'
      break
    case 4:
      days = '星期四'
      break
    case 5:
      days = '星期五'
      break
    case 6:
      days = '星期六'
      break
    case 0:
      days = '星期日'
      break
  }
  var str = `${hh}:${mf}:${ss}`
  var str2 = `${year}年${month}月${day.toString().length > 1 ? day : '0' + day}日 \xa0${days}`
  return [str, str2]
}
export async function getWeather(cityName) {
  const res = await axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${cityName}`)
  if (res.status === 200) {
    let str = ''
    const weather = res.data.data
    if (weather && weather.forecast.length) {
      const { type, high, low } = weather.forecast[0]
      str = `\xa0${type}\xa0${low.replace(/低温/, '').replace(/℃/, '')} -${high.replace(/高温/, '')}`
    }
    return str
  }
}