/*
    1.trim              去除前后空格
    2.LTrim             去除左边空格
    3.RTrim             去除右边空格
    4.isEmail           判断是否是email
    5.isPhoneCall       检测010-12345678或0418-1234567或13,14,15,17,18开头的手机号
    6.isUrl             检查是否是url
    7.isZipCode         检查是否邮编
    8.isIDCard          检查身份证
    9.GlobalCookie      设置cookie
    10.layerloading     加载弹窗
    11.layerOpen        底部提示弹窗
    12.layerBtn         弹窗后带关闭按钮
    13.checkTypeAppSystem   判断浏览器是否是安卓还是ios访问
    14.href               跳转链接
    15.loginJudge           判断是否登录
    16.back           返回上一级
    17.goTop             返回顶部
    18.sendSMS              短信验证码(倒计时时间，倒计时按钮类名)
    19.ShareTip             分享微信，分享微博
    20.fnTimeCountDownb     计时器
 */
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

function setCookie(sName, sValue, day) {
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + day);
  document.cookie = escape(sName) + '=' + escape(sValue) + 'path=/;expires=' + expireDate.toGMTString();
};

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
};

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

function layerOpen(msginfo) {
  layer.open({
    content: msginfo,
    skin: 'msg',
    time: 1
  });
};

function layerLoading(msginfo) {
  layer.open({
    type: 2,
    content: msginfo
  });
};

function layerBtn(typewin, datamsg, thumb) {
  if (typewin == '1') {
    layer.open({
      className: 'thumbs-up',
      content: thumb,
      shade: false,
      time: 2
    });
  } else if (typewin == '2') {
    layer.open({
      className: 'thumbswin',
      content: '<span class="thumbswin-success">' + datamsg + '</span><span class="thumbswin-card">查看我的卡券</span>',
      shade: false,
      time: 2
    });
  } else if (typewin == '3') {
    layer.open({
      // className: 'thumbs-ups',
      content: thumb,
      shade: false,
      // time: 2
    });
  } else if (typewin == '4') {
    layer.open({
      className: 'thumbs-up4',
      content: thumb,
      shade: false,
      time: 2
    });
  } else if (typewin == '5') {
    layer.open({
      className: 'thumbswin',
      content: '<span class="thumbswin-success">' + datamsg + '</span><span class="thumbswin-phone thumbswin-card">去绑定手机号</span>',
      shade: false,
      time: 2
    });
  }
};

function checkTypeAppSystem() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  // alert('是否是Android：' + isAndroid);
  // alert('是否是iOS：' + isiOS);
  return isAndroid;
};

function href(href) {
  window.location.href = href;
};

function iframeHref(href) {
  window.top.location = href
};

function loginJudge(callback) {
  if (getSession) {
    if (getSession()) {
      callback && callback(getSession());
    } else {
      appEvent('isLogin');
    }
  } else if (O2OHome && O2OHome.getSession) {
    if (O2OHome.getSession()) {
      callback && callback(O2OHome.getSession());
    } else {
      appEvent('isLogin');
    }
  }
};

function is_weixn() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
};

function back(num, time) {
  if (time) {
    setTimeout(function() {
      window.history.go((num || -1));
    }, time);
  } else {
    window.history.go((num || -1));
  }
};

function goTop(acceleration, time) {
  acceleration = acceleration || 0.1;
  time = time || 16;
  var x1 = 0;
  var y1 = 0;
  var x2 = 0;
  var y2 = 0;
  var x3 = 0;
  var y3 = 0;
  if (document.documentElement) {
    x1 = document.documentElement.scrollLeft || 0;
    y1 = document.documentElement.scrollTop || 0;
  }
  if (document.body) {
    x2 = document.body.scrollLeft || 0;
    y2 = document.body.scrollTop || 0;
  }
  var x3 = window.scrollX || 0;
  var y3 = window.scrollY || 0;
  // 滚动条到页面顶部的水平距离
  var x = Math.max(x1, Math.max(x2, x3));
  // 滚动条到页面顶部的垂直距离
  var y = Math.max(y1, Math.max(y2, y3));
  // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
  var speed = 1 + acceleration;
  window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
  // 如果距离不为零, 继续调用迭代本函数
  if (x > 0 || y > 0) {
    var invokeFunction = "goTop(" + acceleration + ", " + time + ")";
    window.setTimeout(invokeFunction, time);
  }
};

function sendSMS(time, codeBtn) {
  var c;
  if (time == 0) {
    c = 1;
    $(codeBtn).html("发送验证码");
    $(codeBtn).removeClass('disabled')
    time = 60;
    return;
  }

  if (time != 0) {
    if ($(codeBtn).attr("class").indexOf("disabled") < 0) {
      $(codeBtn).addClass('disabled');
    }
    c = 0;
    $(codeBtn).html("重新获取(" + time + ")");

    time--;
  }
  setTimeout(sendSMS, 1000);
};
var fnTimeCountDown = function(d, o) {
  var f = {
    zero: function(n) {
      var n = parseInt(n, 10);
      if (n > 0) {
        if (n <= 9) {
          n = "0" + n;
        }
        return String(n);
      } else {
        return "00";
      }
    },
    dv: function() {
      d = d || Date.UTC(2050, 0, 1); //如果未定义时间，则我们设定倒计时日期是2050年1月1日
      var future = new Date(d),
        now = new Date();
      //现在将来秒差值
      var dur = Math.round((future.getTime() - now.getTime()) / 1000) + future.getTimezoneOffset() * 60,
        pms = {
          sec: "00",
          mini: "00",
          hour: "00",
          day: "00",
          month: "00",
          year: "0"
        };
      if (dur > 0) {
        pms.sec = f.zero(dur % 60);
        pms.mini = Math.floor((dur / 60)) > 0 ? f.zero(Math.floor((dur / 60)) % 60) : "00";
        pms.hour = Math.floor((dur / 3600)) > 0 ? f.zero(Math.floor((dur / 3600)) % 24) : "00";
        pms.day = Math.floor((dur / 86400)) > 0 ? f.zero(Math.floor((dur / 86400)) % 30) : "00";
        //月份，以实际平均每月秒数计算
        pms.month = Math.floor((dur / 2629744)) > 0 ? f.zero(Math.floor((dur / 2629744)) % 12) : "00";
        //年份，按按回归年365天5时48分46秒算
        pms.year = Math.floor((dur / 31556926)) > 0 ? Math.floor((dur / 31556926)) : "0";
      }
      return pms;
    },
    ui: function() {
      if (o.sec) {
        o.sec.innerHTML = f.dv().sec;
      }
      if (o.mini) {
        o.mini.innerHTML = f.dv().mini;
      }
      if (o.hour) {
        o.hour.innerHTML = f.dv().hour;
      }
      if (o.day) {
        o.day.innerHTML = f.dv().day;
      }
      if (o.month) {
        o.month.innerHTML = f.dv().month;
      }
      if (o.year) {
        o.year.innerHTML = f.dv().year;
      }
      setTimeout(f.ui, 1000);
    }
  };
  f.ui();
};
var ShareTip = function() {
  ShareTip.prototype.sharetosina = function(title, url, picurl) {
    var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
    window.open(sharesinastring);
  }
  ShareTip.prototype.sharetoqqzone = function(title, url, picurl) {
    var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' + title + '&url=' + url + '&pics=' + picurl;
    window.open(shareqqzonestring, 'newwindow', 'height=800,width=800,top=100,left=100');
  }
};

export const commongxw = {
  GetQueryString: GetQueryString,
  setCookie: setCookie,
  getCookie: getCookie,
  delCookie: delCookie,
  layerOpen: layerOpen,
  layerLoading: layerLoading,
  layerBtn: layerBtn,
  checkTypeAppSystem: checkTypeAppSystem,
  href: href,
  iframeHref: iframeHref,
  loginJudge: loginJudge,
  is_weixn: is_weixn,
  back: back,
  fnTimeCountDownb: fnTimeCountDown,
  goTop: goTop,
  sendSMS: sendSMS,
  ShareTip: ShareTip
};