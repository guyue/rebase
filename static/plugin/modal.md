# Modal.js思路整理


## 草稿
![modal.js思路整理](media/modal.jpeg)


## 整理
Modal是常规化模态窗口组件，触发开关只是通常情况下一起使用的一个组件。Modal层应该是一个功能单一的弹层窗口组件。


### 构造函数
`Modal(element, options)`;

构造函数调用完成之后，直接open。

`element`：传入要显示的modal元素，只接收`HTMLElement`类型，方便事件的传播。
建议modal结构置于`template`元素中，用clone的方法生成。

`options`: 配置参数，暂时不用。


### 方法接口
1. `open`方法：打开Modal。
2. `close`方法：关闭Modal，尚存在于内存中，可以直接open。
3. `destroy`方法：销毁Modal对象，解绑事件，释放内存。


### 事件，借住文档事件模型中的CustomEvent事件对象。
1. `open`事件：打开Modal前触发，可以通过preventDefault阻止；
2. `opened`事件：打开Modal后触发。
3. `close`事件：关闭Modal前触发，可以通过preventDefault阻止；
4. `closed`事件：关闭Modal后触发。