$(document).ready(()=>{
      

    $.get("/api/posts/" +postId ,results=>{
        
        outputPostswithreplies(results,$(".postContainer"));
})


})