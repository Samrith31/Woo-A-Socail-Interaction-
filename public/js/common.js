$('#postTextarea,#replyTextarea').keyup(event =>{

    var textbox=$(event.target);
    var value=textbox.val().trim();
     var isModal=textbox.parents(".modal").length == 1;



   
    var submitButton= isModal ? $("#submitReplyButton"): $("#submitPostButton");
    if(submitButton.length==0)return alert("no submit button found")
    if(value==""){
        submitButton.prop("disabled",true);
        return;
    }
    submitButton.prop("disabled",false);
})

$('#submitPostButton,#submitReplyButton').click((event)=>{
    var button=$(event.target);

    var isModal=button.parents(".modal").length == 1;
    var textbox=isModal? $('#replyTextarea'):$('#postTextarea')


    var data={
        content:textbox.val()
    }
    if(isModal){
          var id=button.data().id;
          if(id==null)return alert("button id is null")
          data.replyTo=id;
    }

    $.post("/api/posts",data,postData=>{


          if(postData.replyTo){
            location.reload();
          }
          else{
            var html=createPostHtml(postData);
            $(".postContainer").prepend(html);
            textbox.val("");
            button.prop("disabled",true);
          }
    })


}) 




$("#replyModal").on("show.bs.modal",(event)=>{
    var button=$(event.relatedTarget);
    var postId=getPostIdFromElement(button);
     $('#submitReplyButton').data("id",postId)

    $.get("/api/posts/" + postId,results=>{
        
      outputPosts(results.postData,$("#originalPostContainer"))
})


})


$("#replyModal").on("hidden.bs.modal",(event)=>{

    $("#originalPostContainer").html("");
    
})












$(document).on("click",'.likesButton',(event)=>{
   
    var button=$(event.target);
    var postId=getPostIdFromElement(button);
    if(postId==undefined)return;


    $.ajax({
        url:`/api/posts/${postId}/like`,
        type:"PUT",
        success: (postData)=>{
             
            button.find("span").text(postData.likes.length||"");

            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }
        }
    })



})

$(document).on("click",'.retweetButton',(event)=>{
   
    var button=$(event.target);
    var postId=getPostIdFromElement(button);
    if(postId==undefined)return;


    $.ajax({
        url:`/api/posts/${postId}/retweet`,
        type:"POST",
        success: (postData)=>{
           
             
            button.find("span").text(postData.retweetUsers.length||"");

            if(postData.retweetUsers.includes(userLoggedIn._id)){
                button.addClass("active");
            }
            else{
                button.removeClass("active");
            }
        }
    })



})



$(document).on("click",'.post',(event)=>{
    var element=$(event.target);
    var postId=getPostIdFromElement(element);
    
    if(postId!=undefined&& !element.is("button")){
        window.location.href='/posts/' + postId;
    }
})


function getPostIdFromElement(element){
    var isRoot=element.hasClass('post');
    var rootElement= isRoot ? element:element.closest(".post");
    var postId=rootElement.data().id;

    if(postId==undefined) return alert("post id undefinde");
    return postId;

}




function createPostHtml(postData,largefont=false){

          if(postData==null)return alert("post object is null");

          var isRetweet=postData.retweetData !==undefined;

          var retweetedBy=isRetweet? postData.postedBy.username:null;
          postData=isRetweet?postData.retweetData:postData;


         var postedBy=postData.postedBy;  
        if(postedBy._id==undefined){
            return console.log("user object not populated");
        }



         var displayName=postedBy.firstname+""+postedBy.lastname;
         var timestamp=timeDifference(new Date(),new Date(postData.createdAt));
         var likesButtonActiveClass=postData.likes.includes(userLoggedIn._id)? "active":"";
         var retweetButtonActiveClass=postData.retweetUsers.includes(userLoggedIn._id)? "active":"";
         var largefontclass=largefont? "largefont":"";
         var retweetText="";
         if(isRetweet){
            retweetText=`<span>
            <i class="fa-solid fa-retweet"></i>
            Wooted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a></span>`;
         }

        


         var replyflag="";
         if(postData.replyTo&&postData.replyTo._id){
            if(!postData.replyTo._id){
                return alert("reply to is not populated")
            }
            else if(!postData.replyTo.postedBy._id){
                return alert("posted by is not populated")
            }
            var replyTousername=postData.replyTo.postedBy.username;
            
            replyflag=` <div class ='replyflag'>
                     Replying to <a href='/profile/${replyTousername}'>@${replyTousername}</a>
            
            </div>`;
           
         }

         var buttons="";
         if(postData.postedBy._id==userLoggedIn._id){
            buttons=`<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"><i class='fas fa-times'></i>
            
            
            </button>`
         }



     return `<div class='post  ${largefontclass}
     ' data-id='${postData._id}'>
               <div class='postActionContainer'>
                ${retweetText}

               </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                       <img src='${postedBy.profilepic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href="/profile/${postedBy.username}"class="displayName">${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyflag}
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class="postButtonContainer">
                             <button data-toggle="modal" data-target="#replyModal">
                             <i class="fa-solid fa-comment"></i>
                             </button>
                            </div>
                             <div class="postButtonContainer green">
                             <button class="retweetButton ${retweetButtonActiveClass}">
                             <i class= "fa fa-light fa-hands-asl-interpreting"></i>
                             <span>${postData.retweetUsers.length || ""}</span>
                             </button>
                             </div>
                             <div class="postButtonContainer red">
                             <button class='likesButton ${likesButtonActiveClass}'>
                             <i class="fa-solid fa-heart"></i>
                             <span>${postData.likes.length || ""}</span>
                             </button>
                             </div>
                            </div>
                            
                        </div>
                    </div>
               </div>
             </div>`;

}

function outputPosts(results,container){

    container.html("");
   
    if(!Array.isArray(results)){
        results=[results];
    }
   
    results.forEach(results => {
       var html=createPostHtml(results);
       container.append(html);
    });
   
    if(results.length==0){
       container.append("<span class='noResults'>No Posts yet</span>")
    }
   
   }


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 <30) return "Just now";
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}


 function outputPostswithreplies(results,container){

    container.html("");

    if(results.replyTo!==undefined && results.replyTo._id!==undefined){
        var html=createPostHtml(results.replyTo);
        container.append(html);
    }

    var mainposthtml=createPostHtml(results.postData,true)
    container.append(mainposthtml);



    results.replies.forEach(results => {
       var html=createPostHtml(results);
       container.append(html);
    });
   
    
   
   }