// posting comments

 //reuse inital post to edit
 const postComment = async(event) => {

    // Prevent Default
    event.preventDefault();

    //getting the comments user and blog id

        //getting comment
            //call clicked button
            const postCommentButton = event.target
                console.log(postCommentButton);
            //going up a parent
            const upFromButton = postCommentButton.parentElement;
                console.log(upFromButton);
            //going up to a prior sibling
            const form = upFromButton.previousElementSibling;
                console.log(form);
            //find lement class holding comment within prior sibling
            const textArea = form.querySelector('.new-comment');
                console.log(textArea);
            //getting trimmed value of comment/text area
            const comment = textArea.value.trim();
                console.log(comment);
            
            
        //getting blog id
            //going up an element from form
            const modalDiv = form.parentElement;
            //getting blog id
            const game_id = modalDiv.getAttribute('data-blog-id');
                console.log(game_id);
            

        //geting user id for who is logged in
         const user_id = modalDiv.getAttribute('data-currentuser-id');
            console.log(user_id);

        //rendering to server if content exists
        if (comment) {
            //posting information
            const response = await fetch(`/comment`, {
                method: 'POST',
                body: JSON.stringify({comment,blog_id,user_id}),
                headers: {
                    'Content-Type': 'application/JSON',
                }
            });
            //reload latest dash if response is valid
            if (response.ok) {
                document.location.replace('/');
            }
            //send message if not valid
            else {
                alert('Failed to update')
            }
        }
        
        //send message if no content to post
        else {
            alert('Please ensure you have content filled out to update. Content cannot be blank.');
        }

};

    //defining variable holding all instances of buttons with class delete-blog
    const commentBlogButtons = document.querySelectorAll('.post-comment');

    //looping thorugh the array of buttons to add event listener in order to run edit blog function
    commentBlogButtons.forEach(function(el) {
        el.addEventListener('click', postComment)
    });