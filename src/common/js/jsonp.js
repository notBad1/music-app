/**
 * Created by Administrator on 2017/12/20.
 */
import otginJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  // url拼接
  url += (url.indexOf("?") < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    // resolve 成功, reject失败
    otginJSONP(url, option, (err, data) => {
      // err == none 表示成功
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// url拼接
function param(data) {
  let url = ''
  for (let i in data) {
    let val = data[i] !== undefined ? data[i] : ''
    url += `&${i} = ${encodeURIComponent(val)}`
  }
  return url ? url.substring(1) : ''
}
