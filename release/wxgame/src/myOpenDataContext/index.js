let sharedCanvas = wx.getSharedCanvas()

function drawRankList(data) {
  let sharedCanvas = wx.getSharedCanvas()
  let context = sharedCanvas.getContext('2d')
  var image = wx.createImage()
  image.onload = function () {
    context.drawImage(image, 0, 0)
    context.fillText('连续不迟到大神榜', 80, 60, 200);
    data = data.sort(compare('KVDataList'))
    data =data.slice(0,20)
    data.forEach((item, index) => {
      
      // ...
      let str = (index+1) + ' '+item.nickname + ':' + item.KVDataList[1].value+'天'
      context.fillText(str, 75, 60+((index+1)*20), 200);
      var userheadimg =   wx.createImage()
      userheadimg.src = item.avatarUrl
      userheadimg.onload = function(){
        context.drawImage(userheadimg, 40, 65 + ((index) * 20), 20,20)
       }
     })
  }
  image.src = 'img/rank.png'
  
  
 
}
function compare(property) {
  return function (a, b) {
    var value1 = a[property][1]['value']
    var value2 = b[property][1]['value']

    return value2 - value1;
  }
}




wx.onMessage(function (message) {
  wx.getFriendCloudStorage({
    keyList: ["score",'ts'],
    success: res => {
      let data = res.data
      drawRankList(data)
    }
  })
});  