---
layout: post
title: angularjs指令详解
keywords: angularjs，指令
category : angularjs
tags : 指令
---
```javascript
angular.module('myApp', [])
	.directive('myDirective', function() {
		return {
             restrict: String,
             priority: Number,
             terminal: Boolean,
             template: String or Template Function:
                 function(tElement, tAttrs) (...},
             templateUrl: String,
             replace: Boolean or String,
             scope: Boolean or Object,
			transclude: Boolean,
			controller: String or function(scope, element, attrs, transclude, otherInjectables) { ... }, 
             controllerAs: String,
			require: String,
			link: function(scope, iElement, iAttrs) { ... },
			compile: 
				// 返回一个对象或连接函数，如下所示:
				function(tElement, tAttrs, transclude) {
					return {
						pre: function(scope, iElement, iAttrs, controller) { ... },
						post: function(scope, iElement, iAttrs, controller) { ... }
					}
					// 或者
					return function postLink(...) { ... }
				}
		};
	});
```



#### 一、指令属性详解

---
1. restrict
   这个设置告 诉AngularJS在编译HTML时用哪种声明格式来匹配指令定义。可设置值：元素(E)、属性(A)、类(C)或注释(M)
   相对应的引用格式为

   ```html
   <my-directive></my-directive>
   <div my-directive></div>
   <div class="my-directive"></div>
   <!--directive:my-directive-->
   ```
   > 无论有多少种方式可以声明指令，我们坚持使用属性方式，因为它有比较好的跨浏览器兼容性，即使用restrict: 'A'这种方式

2. replace
   这个属性表示决定指令模板在HTML中是嵌套在声明元素内，还是替换声明元素。可选择值：true，false

3. template
   可以在这个属性中填写HTML代码，到时候将会在指令中渲染这段代码。

4. priority
   如果一个元素上具有两个优先级相同的指令，声明在前面的那个会被优先调用。如果其中一 个的优先级更高，则不管声明的顺序如何都会被优先调用:具有更高优先级的指令总是优先运行。

5. terminal
   这个参数用来告诉AngularJS停止运行当前元素上比本指令优先级低的指令。但同当前指令 优先级相同的指令还是会被执行。

6. templateUrl
   传入一个html文件的地址，将会渲染此文件的内容到指令引用位置

7. scope
   scope参数是可选的，可以被设置为true或一个对象。默认值是false。
   当scope设置为true时，会从父作用域继承并创建一个新的作用域对象。
   创建具有隔离作用域的指令需要将scope属性设置为一个空对象{}。如果这样做了，指令的 模板就无法访问外部作用域了

   - 本地作用域属性:使用@符号将本地作用域同DOM属性的值进行绑定。指令内部作用域可以使用外部作用域的变量:
     @ (or @attr)
   - 双向绑定:通过=可以将本地作用域上的属性同父级作用域上的属性进行双向的数据绑定。 就像普通的数据绑定一样，本地属性会反映出父数据模型中所发生的改变。
     = (or =attr)
   - 父级作用域绑定 通过&符号可以对父级作用域进行绑定，以便在其中运行函数。意味着对这个值进行设置时会生成一个指向父级作用域的包装函数。
     & (or &attr)

8. transclude
   我们可以将整个模板，包括其中的指令通过嵌入全部传入一个指令中。这样做可以将任意内 容和作用域传递给指令。transclude参数就是用来实现这个目的的，指令的内部可以访问外部 指令的作用域，并且模板也可以访问外部的作用域对象。

9. controller
   controller参数可以是一个字符串或一个函数。当设置为字符串时，会以字符串的值为名字， 来查找注册在应用中的控制器的构造函数，还可以在指令内部通过匿名构造函数的方式来定义一个内联的控制器

   ```javascript
    angular.module('myApp',[])
        .directive('myDirective', function() {
            restrict: 'A',
            controller:
            function($scope, $element, $attrs, $transclude) {
   			// 控制器逻辑放在这里 
            }
   });
   ```

   - $scope：与指令元素相关联的当前作用域。
   -  $element：当前指令对应的元素。
   - $attrs：由当前元素的属性组成的对象。
   - $transclude：嵌入链接函数会与对应的嵌入作用域进行预绑定。transclude链接函数是实际被执行用来克隆元素和操作DOM的函数。

   > 指令的controller和link函数可以进行互换。link函数可以将指令互相隔离开来，而controller则定义可复用的行为。

10. controllerAs
   controllerAs参数用来设置控制器的别名，可以以此为名来发布控制器，并且作用域可以访 问controllerAs。这样就可以在视图中引用控制器，甚至无需注入$scope。

11. require
   require参数可以被设置为字符串或数组，字符串代表另外一个指令的名字。require会将控制器注入到其值所指定的指令中，并作为当前指令的link函数的第四个参数。
   require参数的值可以用下面的前缀进行修饰，这会改变查找控制器时的行为:

   - ?：如果在当前指令中没有找到所需要的控制器，会将null作为传给link函数的第四个参数。
   - ^：如果添加了^前缀，指令会在上游的指令链中查找require参数所指定的控制器。
   - ?^：将前面两个选项的行为组合起来，我们可选择地加载需要的指令并在父指令链中进行查找。
   - 没有前缀：如果没有前缀，指令将会在自身所提供的控制器中进行查找，如果没有找到任何控制器(或 具有指定名字的指令)就抛出一个错误。

12. compile
   通常情况下，如果设置了compile函数，说明我们希望在指令和实时数据被放到DOM中之前 进行DOM操作，在这个函数中进行诸如添加和删除节点等DOM操作是安全的。

   > compile和link选项是互斥的。如果同时设置了这两个选项，那么会把compile 所返回的函数当作链接函数，而link选项本身则会被忽略。

13. link
   用link函数创建可以操作DOM的指令。
   如果我们的指令很简单，并且不需要额外的设置，可以从工厂函数(回 调函数)返回一个函数来代替对象。如果这样做了，这个函数就是链接函数。
   链接函数的签名如下:

   ```javascript
   link: function(scope, element, attrs) { 
   	// 在这里操作DOM
   }
   ```

   如果指令定义中有require选项，函数签名中会有第四个参数，代表控制器或者所依赖的指令的控制器。如果require选项提供了一个指令数组，第四个参数会是一个由每个指令所对应的控制器组 成的数组。

   ```javascript
   // require 'SomeController',
   link: function(scope, element, attrs, SomeController) {
   	// 在这里操作DOM，可以访问required指定的控制器 
   }
   ```

   - scope：指令用来在其内部注册监听器的作用域。
   - iElement：iElement参数代表实例元素，指使用此指令的元素。在postLink函数中我们应该只操作此 元素的子元素，因为子元素已经被链接过了。
   - iAttrs：iAttrs参数代表实例属性，是一个由定义在元素上的属性组成的标准化列表，可以在所有指 令的链接函数间共享。会以JavaScript对象的形式进行传递。
   - controller：controller参数指向require选项定义的控制器。如果没有设置require选项，那么 controller参数的值为undefined。


#### 二、向指令中传递数据

---

指令中可以硬编码字符串如下

```html
template:'<a href="http://google.com"> Click me to go to Google</a>'
```

但是这样做并不友好，也不是我们提倡的编程方式，所以最好使用变量来代替硬编码中的相对变量，如下

```html
template: '<a href="{{ myUrl }}">{{ myLinkText }}</a>'
```

在HTML文档中，可以直接传入这两个属性供内部使用

```html
<div my-directive
	my-url="http://google.com"
	my-link-text="Click me to go to Google">
</div>
```

还有一种最简单的方法就是创建新的子作用域或者隔离作用域来设置属性值。如下代码将指令的作用域设置成一个包含它自己的属性的干净对象：

```javascript
scope: {
	myUrl: '@', //绑定策略
	myLinkText: '@' //绑定策略
}
```



#### 三、基础ng属性指令

---

* ng-href：AngularJS会等到插值生效后再执行点击链接的行为

* ng-src：AngularJS会告诉浏览器在ng-src对应的表达式生效之前不要加载图像

* ng-disabled

* ng-checked

* ng-readonly

* ng-selected

* ng-class

* ng-style

* ng-include

* ng-switch

* ng-repeat

  - $index:遍历的进度(0...length-1)。
  - $first:当元素是遍历的第一个时值为true。
  - $middle:当元素处于第一个和最后元素之间时值为true。
  - $last:当元素是遍历的最后一个时值为true。
  - $even:当$index值是偶数时值为true。
  - $odd:当$index值是奇数时值为true。

* ng-view

* ng-controller

* ng-if

* ng-bind

* ng-cloak：避免未渲染的元素闪烁如：

  ```html
  <body ng-init="greeting='HelloWorld'">
  	<p ng-cloak>{{ greeting }}</p>
  </body>
  ```

* ng-bind-template：用来在视图中绑定多个表达式。

  ```html
  <div ng-bind-template="{{message}}{{name}}"></div>
  ```

* ng-model

* ng-show/ng-hide

* ng-change

* ng-form：用来在一个表单内部嵌套另一个表单

* ng-click

* ng-select

* ng-submit：ng-submit用来将表达式同onsubmit事件进行绑定。

* ng-class

* ng-attr-(suffix)：


#### 四、指令定义

---

```javascript
angular.module('myApp', [])
.directive('myDirective', function ($timeout, UserDefinedService) {
	// 指令定义放在这里 
});
```

directive() 方法可以接受两个参数:

1. name(字符串)
   指令的名字，用来在视图中引用特定的指令。

2. factory_function (函数)

   这个函数返回一个对象，其中定义了指令的全部行为。$compile服务利用这个方法返回的对 象，在DOM调用指令时来构造指令的行为。

   ```javascript
   angular.application('myApp', [])
   	.directive('myDirective', function() {
   	// 一个指令定义对象 
   	return {
   		// 通过设置项来定义指令，在这里进行覆写 
       };
   });
   ```


#### 五、AngularJS 的生命周期

---

在AngularJS应用起动前，它们以HTML文本的形式保存在文本编辑器中。应用启动后会进行 编译和链接，作用域会同HTML进行绑定，应用可以对用户在HTML中进行的操作进行实时响应。

在这个过程中总共有两个主要阶段。

1. 编译阶段
   在编译阶段，AngularJS会遍历整个HTML文档并根据JavaScript中的指令定义来处理页面上声明的指令。

2. compile(对象或函数)
   通常情况下，如果设置了compile函数，说明我们希望在指令和实时数据被放到DOM中之前 进行DOM操作，在这个函数中进行诸如添加和删除节点等DOM操作是安全的。
   如果模板被克隆过，那么模板实例和链接实例可能是不同的对象。因此在编译函数内部，我们只能转换那些可以被安全操作的克隆DOM节点。不要进行DOM事件监听器的注册:这个操作应该在链接函数中完成。

   > 编译函数负责对模板DOM进行转换。
   >
   > 链接函数负责将作用域和DOM进行链接。

3. link
   用link函数创建可以操作DOM的指令。
   link函数对绑定了实时数据的DOM具有控制能力，因此需要考虑性能问题。