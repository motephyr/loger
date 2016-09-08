# loger 將事件紀錄下來，幫你的log加上色彩

## 簡介

這是一個npm package,用來做明顯的log顯示.
如果有需要，可以將格式化的log寫到mongodb.
個人專案上需要簡易的紀錄業務邏輯的訊息用。

## 安装

### NPM

npm install loger --save

## 使用

### 初始化

var loger = require('loger')({
    db: 'mongodb://localhost:27017/myproject'
});
它初次被呼叫會以你傳入的參數建立一個唯一的instance.
後來再被呼叫到就只是傳回已建立的那個instance.
所以要確定程式內第一個呼叫到的地方的參數是正確的
它會把值印給你看：
![property image](https://www.dropbox.com/s/szvf5qvuhe8x00l/Screenshot%202016-09-09%2001.19.21.png?dl=0)

### 彩色的log訊息

![log image](https://www.dropbox.com/s/wh3vkyn6k7ro8cp/Screenshot%202016-09-09%2001.01.53.png?dl=0)

另外，所有的log方式都可以用串接的形式寫：
loger.log('a','b',{},[],null,undefined,NaN,'','e')
// 🚦 'a','b',{},[],null,undefined,NaN,'','e'

### 和mongodb一起使用
如果你有設定mongodb的資料庫位置
你可以用
loger.stat('action_name',json_object)
loger.statWithlog('action_name',json_object)
這種形式來把資料寫進mongodb.

它會在mongodb做一個collection, 名稱是你的action_name,
內容是你寫的json_object,並寫入時間。

我個人是用來做統計各種動作的發生狀態。


## 貢獻

```bash
git clone https://github.com/motephyr/loger.git
```

在你的專案裡面引用：
var loger = require('loger')({
    db: 'mongodb://localhost:27017/myproject'
});

試用看看：
loger.log("Loger")
loger.info("Loger")
loger.warn("Loger")
loger.debug("Loger")
loger.error("Loger")

![loger image](https://www.dropbox.com/s/43i3utddiv0ougu/Screenshot%202016-09-09%2001.13.05.png?dl=0 )

有任何改進空間歡迎討論.

https://www.facebook.com/yijuwu