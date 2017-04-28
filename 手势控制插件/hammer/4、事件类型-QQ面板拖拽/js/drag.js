function getByClass(clsName,parent){
  //传入class名和它的父元素
  var oParent=parent?document.getElementById(parent):document,
      //如果传入的参数class名有父元素，获取父元素的id或用document
      eles=[],
      elements=oParent.getElementsByTagName('*');
      //获取父元素里所有标签元素，*代表所有

  for(var i=0,l=elements.length;i<l;i++){
  //遍历父元素里所有标签元素
    if(elements[i].className==clsName){
    //判断当前元素的className是否等于传入的参数class名
      eles.push(elements[i]);
      //得到匹配class的元素，放入数组
    }
  }
  return eles;
}

window.onload=drag;

function drag(){
   var oTitle=getByClass('login_logo_webqq','loginPanel')[0];
   /*
   用上面的自定义方法getByClass，获取要拖拽的class名，
   因为获取的是数组，里面只有一个值，所以用[0]
   */
   // 拖曳
   oTitle.onmousedown=fnDown;
   //当鼠标按下时触发 fnDown 自定义函数
   // 关闭
   var oClose=document.getElementById('ui_boxyClose');
   //获取鼠标关闭按钮
   oClose.onclick=function(){
   	  document.getElementById('loginPanel').style.display='none';
   }
   // 切换状态QQ在线状态
   var loginState=document.getElementById('loginState'),
       //切换状态按钮
       stateList=document.getElementById('loginStatePanel'),
       //状态列表
       lis=stateList.getElementsByTagName('li'),
       //状态列表里的li
       stateTxt=document.getElementById('login2qq_state_txt'),
       //状态名
       loginStateShow=document.getElementById('loginStateShow');
       //状态图标

   loginState.onclick=function(e){
   	 e = e || window.event;
     if(e.stopPropagation){
      //阻止冒泡，因为会冒泡到document上，document点击会隐藏列表
          e.stopPropagation();
     }else{
          e.cancelBubble=true;
     }
   	 stateList.style.display='block';
     //列表显示
   };

   // 鼠标滑过、离开和点击状态列表时
   for(var i=0,l=lis.length;i<l;i++){
    //lis列表中的li标签
      lis[i].onmouseover=function(){
      	this.style.background='#567';
      };
      lis[i].onmouseout=function(){
      	this.style.background='#FFF';
      };
      lis[i].onclick=function(e){
      	e = e || window.event;
        //获取参数，解决兼容性
      	if(e.stopPropagation){
        //阻止冒泡，因为会冒泡到 ul上，再冒泡到div上，会执行，显示列表，所以要阻止冒泡
          e.stopPropagation();
      	}else{
          e.cancelBubble=true;
      	}
      	var id=this.id;
        //获取点击的 id
      	stateList.style.display='none';
        //ul列表隐藏
        stateTxt.innerHTML=getByClass('stateSelect_text',id)[0].innerHTML;
        /*
        获取id里的class名为stateSelect_text的元素的文字，
        将选取的li的文字放入状态文字里，
        */
        loginStateShow.className='';
        loginStateShow.className='login-state-show '+id;
        //列表前的图标，样式切换
      };
   }
   document.onclick=function(){
    //在页面空白地方点击，隐藏状态列表
   	  stateList.style.display='none';
   }
}

function fnDown(event){
  event = event || window.event;
  //获取参数解决兼容性
  var oDrag=document.getElementById('loginPanel'),
  //得到整个QQ面板oDrag
      // 光标按下时光标和面板之间的距离
      disX=event.clientX-oDrag.offsetLeft,
      /*
        event.clientX，event.clientY获取鼠标的位置
        event.clientX-oDrag.offsetLeft得到鼠标位置减去整个QQ面板相对于整个页面的位置
      */
      disY=event.clientY-oDrag.offsetTop;
  // 移动
  document.onmousemove=function(event){
  //鼠标在document整个页面移动时触发
  	event = event || window.event;
    //获取参数，兼容性写法
  	fnMove(event,disX,disY);
    /*
    传入鼠标按下的位置event
    和鼠标距离QQ面板左边框和上边框的距离disX,disY
    */
  };
  // 释放鼠标
  document.onmouseup=function(){
  //释放鼠标
  	document.onmousemove=null;
    //鼠标移动的时候，不用执行了
  	document.onmouseup=null;
  };
}

function fnMove(e,posX,posY){
  var oDrag=document.getElementById('loginPanel'),
  //获取QQ面板
      l=e.clientX-posX,
      //得到鼠标移动到的位置减去鼠标距离QQ面板的左边框的位置
      t=e.clientY-posY,
      winW=document.documentElement.clientWidth || document.body.clientWidth,
      //浏览器可视宽度
      winH=document.documentElement.clientHeight || document.body.clientHeight,
      maxW=winW-oDrag.offsetWidth-10,
      //浏览器可视宽度减去面板宽度，等于拖动的最大距离
      //上面的-10是css设置的样式 right=10的距离
      maxH=winH-oDrag.offsetHeight;
  if(l<0){
    l=0;
    //得到鼠标移动到的位置减去鼠标距离QQ面板的左边框的位置
  }else if(l>maxW){
    l=maxW;
    //得到鼠标移动到的位置减去鼠标距离QQ面板的左边框的位置
  }
  if(t<0){
    t=10;
    //这里的10是css设置的样式 top=10的距离
  }else if(t>maxH){
    t=maxH;
  }
  oDrag.style.left=l+'px';
  //改变QQ面板的left位置
  oDrag.style.top=t+'px';
}
