/*

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

*/


(function( jQuery ){
	
	/*************************
	* コンストラクタ
	*/
	function SygCarousel( root, opt ){
		
		var isAnimated = false;
		var index = 0;
		var itemList = [];
		var widthList = [];
		var indexList = [];
		
		var self = this;
		var areaW = root.width();
		
		jQuery( opt.item, root ).each( function(){
			itemList.push( this );
		})

		// 各アイテムの幅を調べる
		// 属性を与える
		
		var left = 0;

		for( var i=0; i<itemList.length; i++ )
		{
			var item = jQuery(itemList[i]);
			var w = item.outerWidth({margin:true});

			jQuery(item).css( {position:'absolute', top:0, left:left } );

			widthList.push( w );
			indexList.push( i );
			
			left += w;
		}
		
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
				w -= widthList[i];
			}
			seekPosition( w );
		}
		
		/******************************
		* 前ボタン
		*/
		jQuery(opt.prev).click( function(){
			if( isAnimated ) return;
			
			var w = 0;
			var len = widthList.length;
			var target = len - opt.scroll;
			
			// 移動分の幅を取得
			for( var i=len-1 ; i>=target ; i-- ){
				w += widthList[i];
			}
			seekPosition( w );
		});
		
		/*************************
		* アイテムスクロール
		*/
		function seekPosition( w ){

			isAnimated = true;	// アニメーション中
			
			var len = itemList.length;
			
			for( var i=0 ; i<len ; i++ ){
				var item = jQuery(itemList[i]);
				
				if( i==len-1 ){
					item.animate({ left:'+='+w }, opt.speed, opt.easing, onAnimeComplete );
				}else{
					item.animate({ left:'+='+w }, opt.speed, opt.easing );
				}
			}
			
		}
		
		/*************************
		* アニメーション終了
		*/
		function onAnimeComplete( ){
			var len = itemList.length;
			
			// 画面外に移動したものを移動させる
			for( var i=0 ; i<len ; i++ ){

				// 常に先頭をチェック
				var item = jQuery(itemList[0]);
				var x = item.position().left;
				
				if( x < 0 ){
					// 画面の左側に出た
					// 最後の座標
					var lastItem = jQuery(itemList[len-1]);
					var lastRight = lastItem.position().left + lastItem.outerWidth({margin:true});
					
					item.css({ left:lastRight });
					item.hide();
					item.fadeIn('fast');
					
					// 後ろに付ける
					itemList.push( itemList.shift() );
					widthList.push( widthList.shift() );
					indexList.push( indexList.shift() );

				}else if( x > 0 ){
					// 画面の右側に出た
					// 最後のやつを先頭に
					var lastItem = jQuery(itemList[len-1]);
					lastItem.css({ left:x - widthList[len-1] });
					
					lastItem.hide();
					lastItem.fadeIn('fast');
					
					// 最初に付ける
					itemList.unshift( itemList.pop() );
					widthList.unshift( widthList.pop() );
					indexList.unshift( indexList.pop() );
				}
			}
			isAnimated = false;
		}
	}
	
	
	
	/*************************
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
