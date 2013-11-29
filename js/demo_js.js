
$(function(){

	//大家喜欢 滚动效果
	var $firstNode = $('.peopleLikeFirst'),
		$lastNode = $('.peopleLikeLast'),
		leftStand = $firstNode.offset().left -26,//“-26”是因为要以第一个节点头像的右边界与.peopleLikeList可视区域第一个节点的右边界为比较对象，即“+28-54”
		rightStand = $lastNode.offset().left,
		list = $('.peopleLikeList'),
		listImg = $('.peopleLikeImg img'),//每次异步加载都要重新赋值
		length,
		leftId = 0,
		rightId = -1,
		leftSign = false,
		rightSign = false,
		timer = null,
		clickHave = false,
		listDis,
		preClickSign = true,
		nextClickSign = true,
		scrollClickSign = true
		scrollSign = false;

		length = listImg.length;
		//计算leftId和rightId之间节点的offset值，设置两边节点的src，顺序从左到右
		var setId = function(){
			
			for(var i=leftId; i<length; i++){
				//得到当前节点头像的offset值
				var leftDis = listImg.eq(i).offset().left;

				//直到找到节点头像offset值大于leftStand（即左边第一个节点）的节点，则替换src为前一个节点的src，然后标记已找到，则下次不再找
				if(leftSign === false && leftDis > leftStand){
					leftSign = true;
					leftId = i;
					setLeftSrc();
				}

				//直到找到节点头像offset值大于rightStand（即右边第一个节点）的节点，则替换src为当前节点的src，然后标记已找到，则下次不再找
				if(rightSign === false && leftDis >= rightStand){
					rightSign = true;
					rightId = i;
					setRightSrc();
				}
				
				//当左右节点都找到时结束循环
				if(leftSign === true && rightSign === true){
					break;
				}
				
				//找不到rightId
				if(i===length-1){
					rightId = -1;
					$('.peopleLikeNext').hide();
				}
			}
		}

		//计算leftId和rightId之间节点的offset值，设置两边节点的src，顺序从右到左
		var setNegId = function(){
			
			for(var i=rightId-1; i>=0; i--){
				//得到当前节点头像的offset值
				var leftDis = listImg.eq(i).offset().left;
				
				//直到找到节点头像offset值大于leftStand（即左边第一个节点）的节点，则替换src为前一个节点的src，然后标记已找到，则下次不再找
				if(leftSign === false && leftDis <= leftStand){
					leftSign = true;
					leftId = i+1;
					setLeftSrc();
				}
				//当左右节点都找到时结束循环
				if(leftSign === true){
					break;
				}

				//找不到leftId
				if(i===0){
					leftId = -1;
					$('.peopleLikePre').hide();
				}
			}
		}

		var setLeftSrc = function(){
			//给第一个节点添加img节点
			if($firstNode.find('img').length == 0 && leftId>0){
				$firstNode.find('span').removeClass('peopleLikeNoImg').append('<img src="" width="22px" height="22px" />');
			}
			var leftSrc = listImg.eq(leftId-1).attr('src');
			$firstNode.find('img').attr('src', leftSrc);
		}
		
		var setRightSrc = function(){
			//给最后一个节点添加img节点
			if($lastNode.find('img').length == 0 && rightId<=length-1){
				$lastNode.find('span').removeClass('peopleLikeNoImg').append('<img src="" width="22px" height="22px" />');
			}

			var rightSrc = listImg.eq(rightId).attr('src');
			$lastNode.find('img').attr('src', rightSrc);
		}

		

		//按间隔滚动
		var scroll = function(){
			list = $('.peopleLikeList');
			listImg = $('.peopleLikeImg img');
			length = listImg.length;
			
			if(rightId !== -1){
				$('.peopleLikePre').show();

				//取得下一个要滚动的节点的宽度
				var distance = list.children('li').eq(rightId).width() + 70;//下一个节点的距离加上边距70
				list.animate({'margin-left': "-=" + distance + 'px'},500,function(){
					leftSign = false;
					rightSign = false;
					setId();
					if(rightId === -1){
						$lastNode.find('span').addClass('peopleLikeNoImg').children().remove();
						$('.linkToLike').animate({'width':'140px'},500).css('visibility','visible');
					}
				});
				var nextNode = list.children('li').eq(rightId).find('.peopleLikeImg img');
				nextNode.width(0).height(0);
				nextNode.animate({'width':'54px','height':'54px'},600);
				
				timer = setTimeout(scroll,4000);
				
			}
			
		}
		
		
		setId();//初始化
		$('.peopleLikePre').hide();
		if(rightId !== -1){
			$('.peopleLikeNext').show();
		}
		setTimeout(scroll, 2000);

		// $(window).scroll(function(){
		// 	if(scrollSign === false){
		// 		if(($(window).scrollTop() >= $('.peopleLike-section').offset().top - 153) && ($(window).scrollTop() <= $('.peopleLike-section').offset().top)){
		// 			scroll();
		// 			scrollSign = true;
		// 		}
		// 	}
		// 	if($(window).scrollTop() >= $('.peopleLike-section').offset().top + 532){
		// 			clearTimeout(timer);
		// 			scrollSign = false;
		// 		}
		// })
		

		$('.peopleLikePre, .peopleLikeFirst').click(function(){
			clickHave = true;//clickHave为true时鼠标移开图片不再触发滚动
			if(preClickSign === true){
				preClickSign = false;
				list = $('.peopleLikeList');
				listImg = $('.peopleLikeImg img');
				length = listImg.length;
				clearTimeout(timer);
				$('.linkToLike').animate({'width':'0'},500).css('visibility','hidden');
				if(leftSign === true && list.css('margin-left') !== "0px"){
					$('.peopleLikeNext').show();
					if(parseInt(list.css('margin-left')) <= -980){
						listDis = "980px";
					}else{
						listDis = Math.abs(parseInt(list.css('margin-left')));
						//listDis = "100px";
					}
					list.animate({'margin-left': "+=" + listDis},500,function(){
						leftSign = false;
						rightSign = true;
						rightId = leftId;
						setRightSrc();
						setNegId();
						if(leftId === -1){
							$firstNode.find('span').addClass('peopleLikeNoImg').children().remove();
						}
					});
				}
				setTimeout(function(){preClickSign = true;},500);
			}
			
		})

		$('.peopleLikeNext, .peopleLikeLast').click(function(){
			clickHave = true;//clickHave为true时鼠标移开图片不再触发滚动
			if(nextClickSign === true){
				nextClickSign = false;
				list = $('.peopleLikeList');
				listImg = $('.peopleLikeImg img');
				length = listImg.length;
				clearTimeout(timer);
				if(rightSign === true){
					
					if(list.width() - Math.abs(parseInt(list.css('margin-left'))) >= 980){
						listDis = "980px";
					}else{
						listDis = list.width() - Math.abs(parseInt(list.css('margin-left')));
					}
					$('.peopleLikePre').show();
					list.animate({'margin-left': "-=" + listDis},500,function(){
						leftSign = false;
						rightSign = false;
						leftId = rightId;
						setLeftSrc();
						setId();
						if(rightId === -1){
							$lastNode.find('span').addClass('peopleLikeNoImg').children().remove();
							$('.linkToLike').animate({'width':'140px'},500).css('visibility','visible');
						}
					});
				}
				setTimeout(function(){nextClickSign = true;},500);
			}
		})

		/*$('.peopleLikeItem .peopleLikeImg img').live({
			"mouseenter": function(){
				clearTimeout(timer);
			},"mouseleave": function(){
				if(clickHave === false){
					mouseScroll = setTimeout(scroll, 2000);
				}
			}
		})*/

		$('.linkToLike').hover(function(){
			$(this).find('ins').animate({'margin-left':'67px'});
		},function(){
			$(this).find('ins').animate({'margin-left':'43px'});
		})

		

		
})
