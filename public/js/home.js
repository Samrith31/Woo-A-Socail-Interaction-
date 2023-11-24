$(document).ready(()=>{
      

    $.get("/api/posts",results=>{
        
        outputPosts(results,$(".postContainer"));
})


})

function outputPosts(results,container){

 container.html("");


 results.forEach(results => {
    var html=createPostHtml(results);
    container.append(html);
 });

 if(results.length==0){
    container.append("<span class='noResults'>No Posts yet</span>")
 }

}


$('#profilepicupdate').click((event)=>{
   $('#profilepicModal').modal('show')
   console.log("its working")

})

function readURL(input) {
   if (input.files && input.files[0]) {
   
     var reader = new FileReader();
     reader.onload = function (e) { 
       document.querySelector("#updateimagecontainer").setAttribute("src",e.target.result);
       
     };
     console.log(reader)

     reader.readAsDataURL(input.files[0]); 
   }
 }