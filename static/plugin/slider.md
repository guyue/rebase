# Slider.js思路整理

## 整理
Slider是常用的图片或内容展示组件。


### 构造函数
`Slider(element, options)`;

`element`：传入要轮播的slider元素，只接收`HTMLElement`类型，方便事件的传播。
`options`: 配置参数，暂时不用。


### 方法接口
1. `destroy`方法：销毁Slider对象，解绑事件，释放内存。


### 事件，借住文档事件模型中的CustomEvent事件对象。
1. `slidestart`事件：手指之前触发，可以通过preventDefault阻止；
2. `slidestarted`事件：手指开始之后触发；
3. `slidemoved`事件：手指移动之后触发；
4. `slideended`事件：一帧动画结束之后触发；
