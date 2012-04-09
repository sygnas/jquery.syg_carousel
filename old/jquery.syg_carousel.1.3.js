/*****************************************

jQuery.syg_carousel
version 1.3
Hiroshi Fukuda <dada@sygnas.jp>
http://sygnas.jp/

The MIT License

Copyright (c) 2011-2012 Hiroshi Fukuda, http://sygnas.jp/

/*****************************************

/*****************************************
<img src="prev.png" id="prev" />

<ul>
	<li><img src="pickup_1.gif" /></li>
	<li><img src="pickup_2.gif" /></li>
</ul>

<img src="next.png" id="next" />


<script language="JavaScript" type="text/javascript">
	$(function() {
		var caruselOpt = {
			prev: '#prev',
			next: '#next',
			item: 'li',
			scroll: 1
			auto: 3000
		};
		$('ul').sygCarousel( caruselOpt );
	});
</script>
*****************************************/


(function( jQuery ){
	
	var totalWidth = 0;
	var isAnimated = 0;
	
	/*************************
	* コンストラクタ
	* @param root	グループ全体
	*/
	function SygCarousel( root, opt ){
		
		var itemList = [];
		var self = this;
		var areaW = root.width();
		
		// スクロール対象をリストに保存
		jQuery( opt.item, root ).each( function(){
			itemList.push( new ScrollItem(this) );
		})

		// autoが設定されているなら setInterval
		if( opt.auto > 0 ){
			setInterval( nextSeek, opt.auto );
		}
		
		/******************************
		* 次ボタン
		*/
		jQuery(opt.next).click( function(){
			nextSeek();
		});
		
		function nextSeek(){
			if( isAnimated ) return;
			
			var w = 0;
			
			// 移動分の幅を取得
			for( var i=0; i<opt.scroll; i++ ){
				w -= itemList[i].width;
			}
			seekPosition( w );
		}
		
		/******************************
		* 前ボタン
		*/
		jQuery(opt.prev).click( function(){
			if( isAnimated ) return;
			
			var w = 0;
			var len = itemList.length;
			var target = len - opt.scroll;
			
			// 移動分の幅を後ろから順に取得
			for( var i=len-1 ; i>=target ; i-- ){
				w += itemList[i].width;
			}
			seekPosition( w );
		});
		
		/*************************
		* アイテムスクロール
		*/
		function seekPosition( w ){

			var len = itemList.length;
			isAnimated = len;	// アニメーション中の個数
			
			for( var i=0 ; i<len ; i++ ){
				var item = itemList[i];
				item.scroll( w , opt.speed, opt.easing, onAnimeComplete );
			}
		}
		
		/*************************
		* アニメーション終了
		*/
		function onAnimeComplete( ){
			
			// アニメーションしているアイテムがまだあれば抜ける
			if( --isAnimated > 0 ) return;
			
			
			var len = itemList.length;
			
			// 画面外に移動したものを移動させる
			for( var i=0 ; i<len ; i++ ){

				// 常に先頭をチェック
				var item = itemList[0];
				var x = item.getX();
				
				if( x < 0 ){
					item.moveLast();
					
					// 後ろに付ける
					itemList.push( itemList.shift() );

				}else if( x > 0 ){
					itemList[len-1].moveTop();
					
					// 最初に付ける
					itemList.unshift( itemList.pop() );
				}
			}
		}
	}
	
	/*************************
	 * スクロールアイテムクラス
	 * @param item	jQueryObject
	 */
	var ScrollItem = function( item ){
		this.itemObj = jQuery( item );
		
		// position:absolute にして、位置指定
		this.itemObj.css( {position:'absolute'} );
		this.width = this.itemObj.outerWidth();
		this.itemObj.css( {position:'absolute', top:0, left:totalWidth} );
		
		totalWidth += this.width;
	}
	
	/********************
	 * スクロール
	 */
	ScrollItem.prototype.scroll = function( w, speed, easing, onComplete ){
		this.itemObj.animate({ left:'+='+w }, speed, easing, onComplete );
	}
	
	/********************
	 * 最後に移動
	 */
	ScrollItem.prototype.moveLast = function(){
		var targetX = this.getX() + totalWidth;
		this.itemObj.css({ left:targetX });
		this.itemObj.hide();
		this.itemObj.fadeIn('fast');
	}
	
	/********************
	 * 先頭に移動
	 */
	ScrollItem.prototype.moveTop = function(){
		var targetX = this.getX() - totalWidth;
		this.itemObj.css({ left:targetX });
		this.itemObj.hide();
		this.itemObj.fadeIn('fast');
	}
	
	/********************
	 * 座標
	 */
	ScrollItem.prototype.getX = function(){
		return this.itemObj.position().left;
	}
	
	
	
	
	/*************************
	**************************
	* プラグイン定義
	*/
	jQuery.fn.sygCarousel = function( config ) {
		
		// すでに作成されていたらそのまま返す
		var el = this.data("sygCarousel");
		if( el ){ return el; }
		
		/*********************************/
		// 初期値
		var defaults = {
			scroll: 1,
			speed: 400,
			easing: "swing",
			item: ".item",
			circular: false,
			auto: 0,
			next: ".next",
			prev: ".prev",
			startAt: 0
		};
		var options = jQuery.extend( defaults, config );
		
		/*********************************/
		return this.each( function(){
			el = new SygCarousel( jQuery(this), options );
			jQuery(this).data( "sygCarousel", el );
		});
		
	};
})( jQuery );
