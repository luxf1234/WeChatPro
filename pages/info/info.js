// pages/info/info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parms:[],
    xqArray: [],
    index: 0,
    identical:0,
    empty:0,
    txt_identical:"一致",
    txt_empty:"有人",
    outcoming:0,
    txt_outcoming:'非流动人口',
    imageurl:'/images/Camera.png',
    _imageurl:'',
    hidden:true,
    forminfo:'',

    // 键盘
    provinceArr: ["粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "贵", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "警", "学", "港", "澳"],
    strArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"],
    hiddenPro: true,// 省份键盘
    hiddenStr: true,// 数字字母键盘
    carnum: '',
    focus:false
  },

  switch_identical: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    var flag=0;
    var txt='';
    if(e.detail.value)
    {
      flag=1;
      txt="不一致"
    }
    else{
      flag=0;
      txt="一致"
    }
    this.setData({
      identical:flag,
      txt_identical:txt
    })
  },
  switch_empty: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    var flag = 0;
    var txt = '';
    if (e.detail.value) {
      flag = 1;
      txt = "无人"
    }
    else {
      flag = 0;
      txt = "有人"
    }
    this.setData({
      empty: flag,
      txt_empty: txt
    })
  },
  switch_outcoming: function (e) {
    console.log('switch3 发生 change 事件，携带值为', e.detail.value)
    var flag =0;
    var txt = '';
    if (e.detail.value) {
      flag = 1;
      txt = "流动人口"
    }
    else {
      flag = 0;
      txt = "非流动人口"
    }
    this.setData({
      outcoming: flag,
      txt_outcoming: txt
    })
  },

  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        // 这里无论用户是从相册选择还是直接用相机拍摄，拍摄完成后的图片临时路径都会传递进来
        //app.startOperating("保存中")
        var filePath = res.tempFilePaths[0];
        var session_key = wx.getStorageSync('session_key');
        wx.uploadFile({
          url: app.globalData.adminurl+'UploadImage.ashx', //仅为示例，非真实的接口地址
          filePath: filePath,
          header: { "Content-Type": "multipart/form-data" },
          name: 'file',
          formData: {
            'user':wx.getStorageSync('user').openid
          },
          success: function (res) {
            var data = JSON.parse(res.data)
            if(data.Code=='200'){
              that.setData({
                _imageurl: data.Msg,
                imageurl: filePath
              })
            }
            else{
            }
            
            //do something
          }
        })
        // 这里顺道展示一下如何将上传上来的文件返回给后端，就是调用wx.uploadFile函数
        /*wx.uploadFile({
          url: app.globalData.url + '/home/upload/uploadFile/session_key/' + session_key,
          filePath: filePath,
          name: 'file',
          success: function (res) {
            app.stopOperating();
            // 下面的处理其实是跟我自己的业务逻辑有关
            var data = JSON.parse(res.data);
            if (parseInt(data.status) === 1) {
              app.showSuccess('文件保存成功');
            } else {
              app.showError("文件保存失败");
            }
          }
        })*/
      },
      fail: function (error) {
        console.error("调用本地相册文件时出错")
        console.warn(error)
      },
      complete: function () {

      }
    })
  },
  reset:function(){
      this.setData({
        hidden:false
      })
  },

  cancel: function () {
    this.setData({
      hidden: true
    })
  },

  confirm: function () {
    this.setData({
      index: 0,
      identical: 0,
      empty: 0,
      txt_identical: "一致",
      txt_empty: "有人",
      outcoming: 0,
      txt_outcoming: '非流动人口',
      imageurl: '/images/Camera.png',
      _imageurl: '',
      hidden: true,
      forminfo:'',
      carnum:''
    })
  },

  formSubmit:function(e){
    var that=this;
    console.log(e.detail.value)
    //判断图片信息是否为空
    if(this.data._imageurl==''){
      wx.showModal({
        title: '提示',
        content: '请拍摄用户照片！',
        success:function(){
          that.chooseImage()
        }
      })
    }
    //判断姓名是否为空
    else if(e.detail.value.name.length==0){
      wx.showModal({
        title: '提示',
        content: '姓名为空！',
      })
    }
    //判断联系方式格式是否错误
    else if(e.detail.value.tel.length!=11&&e.detail.value.tel.length!=0){
      wx.showModal({
        title: '提示',
        content: '联系方式格式错误，应为11位数字或为空！',
      })
    }
    //判断身份证号格式
    else if(e.detail.value.idcard.length!=18){
      wx.showModal({
        title: '提示',
        content: '身份证号格式错误，应为18位身份证号！',
      })
    }
    else{
      //提交表单
      wx.showToast({

        title: '提交中',//这里打印出登录成功

        icon: 'loading',

        duration: 2000,

        mask:true

      })
    wx.request({
      url: app.globalData.adminurl+'/UpdateInfo.ashx',
      data:{
        xq:that.data.xqArray[that.data.index].Id,
        username: e.detail.value.name,
        tel: e.detail.value.tel,
        idcard: e.detail.value.idcard,
        carnum: e.detail.value.carnum,
        addr: e.detail.value.addr,
        identical: that.data.identical,
        isempty: that.data.empty,
        isoutcoming: that.data.outcoming,
        relationship: e.detail.value.relationship,
        imageurl: that.data._imageurl
      },
      success:function(res){
        console.log(res.data)
        if(res.data.Code=='200'){
          wx.showToast({

            title: '提交成功',//这里打印出登录成功

            icon: 'success',

            duration: 2000

          })
        }
        else{
          wx.showModal({
            title: '提交失败',
            content: '信息提交失败，请联系管理员',
          })
        }
      }
    })
    }
  },

  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: app.globalData.adminurl+'GetXQ.ashx',
      data: {
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.Code == '200') {
          that.setData({
            xqArray:res.data.Data
          })
        }
        console.log(that.data.xqArray)
      }
    })
    wx.request({
      url: app.globalData.adminurl + 'GetParms.ashx',
      data: {
      },
      success: function (res) {
        console.log(res.data)
          that.setData({
            parms:res.data
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log(res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getXQInfo:function(){
    wx.request({
      url: app.globalData.adminurl+'GetXQ.ashx',
      data: {
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.Code == '200') {
        }
      }
    })
  },
  proTap(e) {//点击省份
    let province = e.currentTarget.dataset.province;
    let carnum = this.data.carnum;
    this.setData({
      carnum: carnum + province,
      hiddenPro: true,
      hiddenStr: false
    })
  },
  strTap(e) {//点击字母数字
    let province = e.currentTarget.dataset.str;
    let carnum = this.data.carnum;
    if (carnum.length > 7) return;// 车牌长度最多为8个（新能源车牌8个）
    carnum += province;
    this.setData({
      carnum: carnum
    })
  },
  backSpace() {//退格
    let carnum = this.data.carnum;
    var arr = carnum.split('');
    arr.splice(-1, 1)
    console.log(arr)
    var str = arr.join('')
    if (str == '') {
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    }
    this.setData({
      carnum: str
    })
  },
  backKeyboard() {//返回省份键盘
    this.setData({
      hiddenPro: false,
      hiddenStr: true
    })
  },
  car_input:function(){
    console.log(1)
    var keyprovince;
    var keynum;
    if(this.data.carnum.length>0){
      keyprovince=true
      keynum=false
    }
    else{
      keynum=true
      keyprovince=false
    }
    this.setData({
      hiddenPro:keyprovince,
      hiddenStr:keynum
    })
  },
  backhide:function(){
    console.log(4)
    this.setData({
      hiddenPro: true,
      hiddenStr: true
    })
  },
  blur_out:function(){
    console.log(2)
    this.setData({
      hiddenPro: true,
      hiddenStr: true
    })
  }
 
})