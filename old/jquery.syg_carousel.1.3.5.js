/*****************************************

jQuery.syg_carousel
version 1.4
Hiroshi Fukuda <dada@sygnas.jp>
http://sygnas.jp/

The MIT License

Copyright (c) 2011-2012 Hiroshi Fukuda, http://sygnas.jp/

/*****************************************

/*****************************************
<img src="prev.png" id="prev" />

<div id="carousel">
	<div class="scroll">
		<div class="item"><img src="pickup_1.gif" /></div>
		<div class="item"><img src="pickup_2.gif" /></div>
	</div>
</div>

<img src="next.png" id="next" />


<script language="JavaScript" type="text/javascript">
	var caruselOpt = {
		prev: '#prev',
		next: '#next',
		item: '.item',
		auto: 3000
	};
	new $.sygCarousel( '#carousel', caruselOpt );
</script>
*****************************************/


(function( jQuery ){
	
	/*************************
	* constructor
	*/
	jQuery.SygCarousel = function( target, config ){
		// default parameters
		var defaults = {
			scrollWidth:	"auto",		// {auto} or number. auto is 1st item width()
			speed:			400,
			easing:			"swing",
			startAt:		0,
			auto:			0,			// auto scrool timing. {0} is no auto.
			scrollItem:		".item",
			scrollClass:	".scroll",
			nextButton:		"#next",
			prevButton:		"#prev",
			navi:			"#navi",
			naviItem:		".item",
			onScroll:		"",			// event
			onBeforeScroll:	""
		};
		//////
		
		this.opt = jQuery.extend( defaults, config );
		
		var self = this;
		var opt = self.opt;
		self.target = target;
		self.totalWidth = 0;
		self.scrollWidth = 0;
		self.lastScrollWidth = 0;
		self.itemWidth = 0;
		self.isAnimated = false;
		self.itemList = [];
		self.$scrollBox = jQuery(opt.scrollClass, target);
		self.navi;

		// private method
		self.scroll = scroll;
		
		/////////////////
		
		// 親BOXのpositionを設定
		setParentBox( target );
		
		// スクロール対象をリストに保存
		jQuery( opt.scrollItem, target ).each( function(i){
			setItem( this, i );
		})
		
		// スクロール幅
		self.itemWidth = self.itemList[0].width();
		self.scrollWidth = opt.scrollWidth == 'auto' ? self.itemWidth : opt.scrollWidth;
		
		// ナビゲーション
		if( jQuery( opt.navi ) ){
			self.navi = new jQuery.SygCarouselNavi( this, opt.navi, opt );
		}
		
		// 初期位置設定
		if( opt.startAt > 0 ){
			self.scrollTo( opt.startAt );
			if( self.navi ) self.navi.setActive( opt.startAt );
		}

		// autoが設定されているなら setInterval
		if( opt.auto > 100 ){
			setInterval( jQuery.proxy( self.nextScroll, self ), opt.auto );
		}
		
		/******************************
		* 親BOXの position
		*/
		function setParentBox( target ){
			var $parentBox = jQuery(target);
			var parentPos = $parentBox.css('position');

			if( parentPos != 'relative' && parentPos != 'absolute' ){
				$parentbox.css({ position:'relative' });
			}
			
			var scrollPos = self.$scrollBox.css('position');
			
			if( scrollPos != 'relative' && scrollPos != 'absolute' ){
				self.$scrollBox.css({ position:'relative' });
			}
		}
		
		/******************************
		* アイテムの設定
		*/
		function setItem( item, id ){
			var $item = jQuery(item);
			
			$item.css({ position:'absolute', left:self.totalWidth });
			$item.carouselID = id;
			
			self.totalWidth += $item.width();
			self.itemList.push( $item );
		}
		
		/*************************
		* アイテムスクロール
		*/
		function scroll( w ){
			var opt = self.opt;
			var list = self.itemList;
			var len = list.length;
			var i;
			
			if( self.isAnimated ) return;
			if( w == 0 ) return;
			
			self.isAnimated = true;
			self.lastScrollWidth = w;
			
			// event
			if( opt.onBeforeScroll ) opt.onBeforeScroll();
			
			// 移動させるアイテム数
			var scrollCount = Math.floor( Math.abs(self.lastScrollWidth) / self.itemWidth );
			
			
			// scroll left(next) or right(prev)
			if( w < 0 ){
				// left( next )
				// navication set active
				self.navi.setActive( (list[0].carouselID + scrollCount) % len );
				
				self.$scrollBox.animate({ left:w }, opt.speed, opt.easing, onNextComplete );

			}else{
				// right( prev )
				// navication set active
				var nextActive = self.navi.nowActive - scrollCount;
				self.navi.setActive( nextActive >= 0 ? nextActive : len + nextActive );

				// 後ろのやつを前に移動
				for( i=len-1; i>=len-scrollCount; i-- ){
					var $item = list.pop();
					var left = $item.position().left - self.totalWidth;
					$item.css({ left:left });
					
					list.unshift( $item );
				}
				
				self.$scrollBox.animate({ left:w }, opt.speed, opt.easing, onPrevComplete );
			}
			
		}
		
		/*************************
		* 進む終了
		*/
		function onNextComplete( ){
			// 移動させるアイテム数
			var scrollCount = Math.floor( Math.abs(self.lastScrollWidth) / self.itemWidth );
			var i;
			
			for( i=0; i<scrollCount; i++ ){
				var $item = self.itemList.shift();
				self.itemList.push( $item );
			}
			
			// 再配置と位置初期化
			resetPosition();
		}
		
		/*************************
		* 戻る終了
		*/
		function onPrevComplete( ){
			// 再配置と位置初期化
			resetPosition();
		}
		
		/*************************
		* 位置初期化
		*/
		function resetPosition(){
			var i;
			
			for( i=0; i<self.itemList.length; i++ ){
				self.itemList[i].css({ left:i*self.itemWidth });
			}
			
			self.$scrollBox.css({ left:0 });
			self.isAnimated = false;
			
			// イベント
			if( self.opt.onScroll ){
				self.opt.onScroll( self, self.itemList[0].carouselID );
			}
		}
		
		/******************************
		* 次ボタン
		*/
		jQuery(self.opt.nextButton).click( jQuery.proxy( self.nextScroll, self ) );
		
		/******************************
		* 前ボタン
		*/
		jQuery(self.opt.prevButton).click( jQuery.proxy( self.prevScroll, self ) );
		
	}
	
	/*****************************
	* 次に進む
	*/
	jQuery.SygCarousel.prototype.nextScroll = function(){
		this.scroll( -this.scrollWidth );
	}
	
	/*****************************
	* 前に戻る
	*/
	jQuery.SygCarousel.prototype.prevScroll = function(){
		this.scroll( this.scrollWidth );
	}
	
	/*****************************
	* n番目にスクロール
	*/
	jQuery.SygCarousel.prototype.scrollTo = function( id ){
		var left = this.itemList[id].position().left;
		this.scroll( -left );
	}

	/*****************************
	* IDのn番目にスクロール
	*/
	jQuery.SygCarousel.prototype.scrollToID = function( id ){
		var i;
		var list = this.itemList;
		
		// 範囲オーバーしていたら無視
		if( id >= list.length ) return;
		
		for( i=0; i<list.length; i++ ){
			if( list[i].carouselID == id ) break;
		}
		
		var left = this.itemList[i].position().left;
		this.scroll( -left );
	}
	
	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	// Navigation Class
	///////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	
	jQuery.SygCarouselNavi = function( carousel, target, opt ){

		this.carousel = carousel;
		this.naviItems = [];
		this.nowActive = -1;

		var self = this;

		jQuery( opt.naviItem, target ).each( function( id ){ 
			
			var $item = jQuery(this);
			self.naviItems.push( $item );
			
			this.carouselNaviID = id;
			
			/********/
			$item.click( function( e ){
				var id = e.currentTarget.carouselNaviID;
				self.carousel.scrollToID( id );
			});
			
		});
		
	}
	/*********************************
	* set active
	*/
	jQuery.SygCarouselNavi.prototype.setActive = function( id ){
		
		if( this.nowActive == id ) return;
		
		var i;
		
		for( i=0; i<this.naviItems.length; i++ ){
			if( this.naviItems[i].is('.active') ){
				this.naviItems[i].removeClass('active');
			}
		}
		this.naviItems[id].addClass('active');
		this.nowActive = id;
	}
	
	
})( jQuery );
