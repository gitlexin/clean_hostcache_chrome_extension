// 获取按钮元素
var button = document.getElementById("clear");

// 给按钮添加点击事件监听器
button.addEventListener("click", function() {
  // 发送消息给后台服务工作线程
  chrome.runtime.sendMessage({action: "clear"});
});
