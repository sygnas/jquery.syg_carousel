#jQuery.syg_carousel - simple and size adjustable carousel

##NAME
jQuery.syg_carousel

##VERSION
version 1.1

jQuery VERSION
version 1.2.6

##SYNOPSIS

###HTML
``` html
<!-- Previous button -->
<img src="prev.png" id="prev" />

<!-- Carousel list -->
<ul>
	<li><img src="pickup_1.gif" /></li>
	<li><img src="pickup_2.gif" /></li>
</ul>

<!-- Next button -->
<img src="next.png" id="next" />
```

### jQuery.syg_carousel setup
``` js
$(function() {

	# Options / [] is default
	var caruselOpt = {
		prev: '#prev',		# Previous button ID 	[.prev]
		next: '#next',		# Next button ID 		[.next]
		item: 'li',			# Scroll Target Object	[.item]
		scroll: 1,			# Scroll item block		[1]
		auto: 3000,			# Auto scroll timer		[0]
		speed:400,			# Scroll speed			[400]
		easing:"swing"		# Scroll easing			["swing"]
	};
	
	# Initialize
	$('ul').sygCarousel( caruselOpt );
});
```

##DESCRIPTION
シンプルなカルーセルがなかったので作りました。
スクロール対象となるオブジェクト（画像など）の幅は可変なのが特徴です。
自分用に作ったものなので不具合や未実装な部分があるかもしれません。

##METHOD

##AUTHOR
Hiroshi Fukuda <dada@sygnas.jp>
http://sygnas.jp/

##LICENSE
jQuery.syg_carousel

The MIT License

Copyright (c) 2011-2012 Hiroshi Fukuda, http://sygnas.jp/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
