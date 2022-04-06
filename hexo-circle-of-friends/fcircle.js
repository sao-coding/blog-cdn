
// ======================================================

// 打印友鏈基本信息
function loadStatistical(sdata){
    // 友鏈頁面的掛載容器
    var container = document.getElementById('fcircleContainer');
    // 基本信息的html結構
    
    var messageBoard =`
    <div id="fMessageBoard">
      <div class="fUpdatedTime">
        <span class="fLabel">最近更新時間：</span><span class="fMessage">${sdata.last_updated_time}</span>
      </div>
      <div class="fMessageItem">
        <div class="fActiveFriend fItem">
          <span class="fLabel">活躍友鏈數</span>
          <span class="fMeasureBar"><span class="fMeasure" style="width:${(sdata.active_num/sdata.friends_num * 100).toFixed(2)}%; background: rgba(89, 230, 54,0.6);">${(sdata.active_num/sdata.friends_num * 100).toFixed(2)}%</span></span>
          <span class="fMessage">${sdata.active_num}/${sdata.friends_num}</span>
        </div>
        <div class="fErrorSite fItem">
          <span class="fLabel">失聯友鏈數</span>
          <span class="fMeasureBar"><span class="fMeasure" style="width:${(sdata.error_num/sdata.friends_num * 100).toFixed(2)}%; background: rgba(227, 23, 72, 0.6);">${(sdata.error_num/sdata.friends_num * 100).toFixed(2)}%</span></span>
          <span class="fMessage">${sdata.error_num}/${sdata.friends_num}</span>
        </div>
        <div class="fArticleNum fItem">
          <span class="fLabel">當前庫存</span>
          <span class="fMeasureBar"><span class="fMeasure" style="width:${(sdata.article_num/Math.ceil(sdata.article_num / 100)).toFixed(2)}%; background: rgba(29, 217, 211, 0.6);">${(sdata.article_num/Math.ceil(sdata.article_num / 100)).toFixed(2)}%</span></span>
          <span class="fMessage">${sdata.article_num}/${Math.ceil(Number( sdata.article_num) / 100) * 100}</span>
        </div>
      </div>
      <div id="switchRankBtn">
        <span id="rankByCreated">created</span>
        <span>
        <input type="checkbox" id="switchRankMode" checked="true" onchange="checkRankMode()"/><label for="switchRankMode" id="switchRank">Toggle</label>
        </span>
        <span id="rankByUpdated">updated</span>
      </div>
    </div>
    `;
    // 加載更多按鈕
    var loadMoreBtn = `
    <div id="fcircleMoreBtn" onclick="loadMoreArticle()">
      <i class="fas fa-angle-double-down"></i>
    </div>
    `
    // 原則上信息面板應該在最前面，所以用beforebegin表示從開始符前面插入
    if(container){
      container.insertAdjacentHTML('beforebegin', messageBoard);
      // 為了不影響文章加載，選擇afterend表示從結束符後面插入
      container.insertAdjacentHTML('afterend', loadMoreBtn);
      }
    }
    
    // ======================================================
    // 打印友鏈內容
    function loadArticleItem(datalist,start,end){
    var fdatalist = JSON.parse(localStorage.getItem("fdatalist"));
    // 聲明友鏈頁面的掛載容器
    var container = document.getElementById('fcircleContainer');
    // 循環讀取輸出友鏈信息
    for (var i = start;i<end;i++){
    var item = datalist[i];
    var articleItem=`
      <div class="fArticleItem">
        <div class="fArticleAvatar">
          <a class="fArticlelink fAvatar" target="_blank" rel="noopener nofollow" href="${item.link}">
            <img src="${item.avatar}" alt="avatar"  onerror="this.src='${fdatalist.error_img}'; this.onerror = null;">
          </a>
          <div class="fArticleAuthor">
            ${item.author}
          </div>
        </div>
        <div class="fArticleMessage">
          <a class="fArticleTitle"  href="${item.link}" target="_blank" rel="noopener nofollow" data-title="${item.title}">
            ${item.title}
          </a>
          <div class="fArticleTime">
            <span class="fArticleCreated"><i class="far fa-calendar-alt">發表於</i>${item.created}</span>
            <span class="fArticleUpdated"><i class="fas fa-history">更新於</i>${item.updated}</span>
          </div>
        </div>
      </div>
    `;
    if(container){
    // 為了便於和後續拼接，選擇從容器尾部插入
    container.insertAdjacentHTML('beforeend', articleItem);
        }
      }
    }
    
    
    // 初始化方法
    function initFriendCircle(){
      // 獲取友鏈掛載容器
      var fcircleContainer = document.getElementById('fcircleContainer')
      // 獲取本地存儲的友鏈基本信息
      var statistical_data = JSON.parse(localStorage.getItem("statisticalList"));
      // 從本地內存讀取配置信息
      var fdatalist = JSON.parse(localStorage.getItem("fdatalist"));
      // 只有當容器、基本信息均存在時才執行初始化
      if (fcircleContainer && statistical_data && fdatalist){
        // 加載基本信息面板
        loadStatistical(statistical_data);
        // 獲取切換排序按鈕
        var switchRankMode = document.getElementById("switchRankMode");
        //根據當前選擇的排序方案加載對應的排序內容
        if(switchRankMode.checked){
          // console.log("按更新時間排序");
          var article_sortupdated = JSON.parse(localStorage.getItem("updatedList"));
          loadArticleItem(article_sortupdated ,0,fdatalist.initnumber)
        }else{
          // console.log("按創建時間排序");
          var article_sortcreated = JSON.parse(localStorage.getItem("createdList"));
          loadArticleItem(article_sortcreated ,0,fdatalist.initnumber)
        }
      }
    }
    
    // 加載更多文章
    function loadMoreArticle(){
      // 獲取當前已加載的文章數
      var currentArticle = document.getElementsByClassName('fArticleItem').length;
      // 獲取當前選擇的排序方式
      var switchRankMode = document.getElementById("switchRankMode");
      // 從本地內存讀取配置信息
      var fdatalist = JSON.parse(localStorage.getItem("fdatalist"));
      // 只有當兩者均存在時才繼續執行
      if (switchRankMode && fdatalist){
        if(switchRankMode.checked){
          // console.log("按更新時間排序");
          var article_sortupdated = JSON.parse(localStorage.getItem("updatedList"));
          // 從當前文章的下一篇開始，加載下一階程篇數
          loadArticleItem(article_sortupdated,currentArticle,currentArticle + fdatalist.stepnumber)
        }else{
          // console.log("按創建時間排序");
          var article_sortcreated = JSON.parse(localStorage.getItem("createdList"));
          // 從當前文章的下一篇開始，加載下一階程篇數
          loadArticleItem(article_sortcreated,currentArticle,currentArticle + fdatalist.stepnumber)
        }
      }
      // 向上滾動一篇文章的距離
      window.scrollBy(0,180)
    }
    
    //切換按鈕
    function checkRankMode(){
      // 首先清空現有的文章內容
      document.getElementById('fcircleContainer').innerHTML=''
      // 獲取當前選擇的排序方式
      var switchRankMode = document.getElementById("switchRankMode");
      // 從本地內存讀取配置信息
      var fdatalist = JSON.parse(localStorage.getItem("fdatalist"));
      // 只有當兩者均存在時才繼續執行
      if (switchRankMode && fdatalist){
        //按更新時間排序
        if(switchRankMode.checked){
          // console.log("按更新時間排序");
          var article_sortupdated = JSON.parse(localStorage.getItem("updatedList"));
          //加載配置項中指定的初始化篇數
          loadArticleItem(article_sortupdated ,0,fdatalist.initnumber)
        }else{
          // console.log("按創建時間排序");
          var article_sortcreated = JSON.parse(localStorage.getItem("createdList"));
          //加載配置項中指定的初始化篇數
          loadArticleItem(article_sortcreated ,0,fdatalist.initnumber)
        }
      }
    }
    //執行初始化方法
    initFriendCircle()