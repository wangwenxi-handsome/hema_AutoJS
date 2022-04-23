const zhifubao_password = "000000"; // 这里换成自己的支付宝密码
const pinmu_password = "000000"; //这里换成自己的手机解锁密码
const try_count = 273; // 尝试次数，每次尝试约2.2秒，273次尝试约尝试10min

// 支付函数
const pay = () =>{
  var a=text("提交订单").findOne().bounds();
  var b=a.centerX();
  var c=a.centerY();
  click(b,c)
  sleep(100)

  // 确认配送时间，默认是可配送的第一个时间，暂不支持修改时间
  if (textStartsWith('确认').exists()){
    var d=text("确认").findOne().bounds();
    var e=d.centerX();
    var f=d.centerY();
    click(e,f)
    sleep(1000)

    // 确认配送时间后，需要再次点击"提交订单"
    var a=text("提交订单").findOne().bounds();
    var b=a.centerX();
    var c=a.centerY();
    click(b,c)
    sleep(1000)
  }

  var d=text("确认付款").findOne().bounds();
  var e=d.centerX();
  var f=d.centerY();
  click(e,f)
  sleep(200)

  for (var i=0;i<zhifubao_password.length;i++)
  { 
    var o=text(zhifubao_password[i]).findOne().bounds();
    var p=o.centerX();
    var q=o.centerY();
    click(p,q)
    sleep(50)
  }
}

// 订单提交函数
const selectTime = (countT,status) =>{
  if(textStartsWith("提交订单").exists()){
    sleep(500)
    status=true
    pay()
  }else{
    countT=countT+1;
    if(countT>try_count){
      exit;
    }
    sleep(100)
    selectTime(countT,false)
  }
}

// 结算函数
const submit_order = (count) => {
    toast('抢菜第'+count+'次尝试')
    id('button_cart_charge').findOne().click() //结算按钮点击

    sleep(2000)
    if(textStartsWith('非常抱歉，当前商品运力不足(063)').exists()){
      back()
      sleep(200)
      count=count+1;
      if(count>try_count){
        toast('抢菜失败')
        exit;
      }
      submit_order(count)
    }else if (textStartsWith('很抱歉，下单失败').exists()) {
      back()
      sleep(200)
      count=count+1;
      if(count>try_count){
        toast('抢菜失败')
        exit;
      }
      submit_order(count)
    }else if (textStartsWith('确认').exists() && !textStartsWith('确认订单').exists()) {
      back()
      sleep(200)
      count=count+1;
      if(count>try_count){
        toast('抢菜失败')
        exit;
      }
      submit_order(count)
    }else if(textStartsWith('全选').exists()){
      sleep(200)
      count=count+1;
      if(count>try_count){
        toast('抢菜失败')
        exit;
      }
      submit_order(count)
    }else{
      if(textStartsWith('放弃机会').exists()){
        toast('跳过加购')
        textStartsWith('放弃机会').findOne().parent().click()
      }
      selectTime(0,false)
    }
}

// 手机解锁函数
function unLock() {
  if (!device.isScreenOn()) {
    toast('try to unlock')
    device.wakeUp();
    sleep(500);
    swipe(500, 2000, 500, 1000, 200);
    sleep(500);
    for (let i = 0; i < pinmu_password.length; i++) {
      let position = text(pinmu_password[i]).findOne().bounds();
      click(position.centerX(), position.centerY());
      sleep(100);
    }
  }
  toast('open')
  sleep(1000);
}

// 主函数
const start = () => {
  auto()
  // 屏幕解锁
  unLock()
  // 打开软件
  const appName = "盒马";
  launchApp(appName);
  sleep(20);  
  auto.waitFor()
  // 进入购物车
  var a=text("购物车").findOne().bounds();
  var b=a.centerX();
  var c=a.centerY();
  click(b,c)
  sleep(100)
  // 循环下单
  submit_order(0)
}
start()