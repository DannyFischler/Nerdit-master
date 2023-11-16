//posting new gamechat
//when clicking post, log information to create new gamechat
const postNewGame = async (event) => {

  event.preventDefault();

  //defining items to get and manipulate

  //when clicked get game title entered
  const title = document.querySelector(".new-game-title").value.trim();

  //when clicked get game content entered
  const content = document.querySelector(".new-game-content").value.trim();

  //getting user id for who is submitting gamechat
  // Get the modal I put an attribute on
  const userModal = document.querySelector(".modal-content");
  // Get the data-user-id attribute I created
  const user_id = userModal.getAttribute("data-user-id");

  //posting contenet to the server if exists
  if (title && content) {
    //posting the information
    const response = await fetch("/api/dash/game", {
      method: "POST",
      body: JSON.stringify({ title, content, user_id }),
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    //load the latest dash again if the response is valid
    if (response.ok) {
      alert(`New gamechat created!`);
      document.location.replace("/api/dash");
    }
    //notify if there is a failure
    else {
      alert("Failed to Create Gamechat");
    }
  }
  //if no content send message to fill out info
  else {
    alert("Please fill out a title and content to post");
  }
};

//editing gamechat

//edit button renders straught from handlebars, this runs when the post update is clicked.
const editGame = async (event) => {
  // Prevent Default
  event.preventDefault();

  //get the latest title and text area inputs when button is clicked on

  //getting updated title
  //call out button when clicked
  const updateButton = event.target;
  console.log(updateButton);
  //go up a parent
  const modalFooter = updateButton.parentElement;
  console.log(modalFooter);
  //go over a prior sibling
  const form = modalFooter.previousElementSibling;
  console.log(form);
  //using querySelector and scope within to form the children
  const input = form.querySelector(".new-game-title");
  console.log(input);
  //get updated Title
  const title = input.value.trim();
  console.log(title);

  //getting updated content
  //using querySelector and scope within to build on the vairable above
  const textArea = form.querySelector(".new-game-content");
  console.log(textArea);
  //getting updated Title
  const content = textArea.value.trim();
  console.log(content);

  //getting user id for who is submitting gamechat
  //getting the modal that attribute is put on
  const modalContentContainer = form.parentElement;
  console.log(modalContentContainer);
  //getting the data-gamechat attribute that is created
  const game_id = modalContentContainer.getAttribute("data-game-id");
  console.log(game_id);

  //rendering content to server if it exists
  if (title && content) {
    //posting information
    const response = await fetch(`/api/dash/game/${game_id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    //reload latest dash if info is valid
    if (response.ok) {
      alert(`Gamechat successfully updated!`);
      document.location.replace("/api/dash");
    }
    //if fails send message
    else {
      alert("Failed to Update Gamechat");
    }
  }
  //send error message if no content exists
  else {
    alert(
      "Please ensure you have content filled out to update. Content cannot be blank."
    );
  }
};

//delete gamechat

//delete gamechat when delete button clicked
const deleteGame = async (event) => {
  // Prevent Default
  event.preventDefault();

  //clearing the variables
  let button;
  let buttonsContainer;
  let game_id;

  //getting the id for the gamechat getting deleted

  //getting updated title
  //call out button when clicked
  button = event.currentTarget;
  console.log(button);
  buttonsContainer = button.parentElement;
  console.log(buttonsContainer);
  game_id = buttonsContainer.getAttribute("data-gameid");
  console.log(game_id);

  //deleting gamechat by id
  try {
    //posting information
    const response = await fetch(`/api/dash/game/${game_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    //reload dash if info is valid
    if (response.ok) {
      alert(`Gamechat Deleted`);
      document.location.replace("/api/dash");
    }
    //send message if failure
    else {
      alert("Failed to Delete Gamechat");
      return;
    }
  } catch {
    //send message if no contenet entered
    alert(
      "Please ensure you have content filled out to update. Content cannot be blank."
    );
  }
};

//posting comments

//reusing initial info to add on to when edit button is clicked
const postComment = async (event) => {
  // Prevent Default
  event.preventDefault();

  //getting comment gamechat id and user id

  //getting comment
  //calling out hte button clicked
  const postCommentButton = event.target;
  console.log("postCommentButton");
  //going up one parent
  const upFromButton = postCommentButton.parentElement;
  console.log("upFromButton");
  //going up a prior sibling
  const form = upFromButton.previousElementSibling;
  console.log("form");
  //finding the sibing element that is holding the new comment
  const textArea = form.querySelector(".new-comment");
  console.log("textArea");
  //getting the trimmed value of the comments text area
  const comment = textArea.value.trim();
  console.log("comment");

  //getting the gamechat id
  //going up one element
  const modalDiv = form.parentElement;
  //getting gamechat id
  const game_id = modalDiv.getAttribute("data-game-id");
  console.log("game_id");

  //gettign user id for user the is signed in
  const user_id = modalDiv.getAttribute("data-currentuser-id");
  console.log("user_id");

  //rendering content to server if it exists
  if (comment) {
    //posting information
    const response = await fetch(`/api/dash/comment`, {
      method: "POST",
      body: JSON.stringify({ comment, game_id, user_id }),
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    //reload latest dash if info is valid
    if (response.ok) {
        alert("Success");
      document.location.replace("/api/dash");
    }
    //send message if not valid
    else {
      alert("Failed to update");
    }
  }

  //send message if no content to post
  else {
    alert(
      "Please ensure you have content filled out to update. Content cannot be blank."
    );
  }
};

//posting new gamechat

//selecting new blog button and add event listener to the run new blog function
document.querySelector("#post-new-game").addEventListener("click", postNewGame);

//edit blog

//defining a variable holding all the button instances with class update-blog
const editGameButtons = document.querySelectorAll(".update-game");

//loop through array of buttons and add event listener in order to run edit blog function

editGameButtons.forEach(function (el) {
  el.addEventListener("click", editGame);
});

//deleting gamechat

//defining a variable holding all the button instances with class delete-blog
const deleteGameButtons = document.querySelectorAll(".delete-game");

//loop through array of buttons and add event listener in order to run delete blog function
deleteGameButtons.forEach(function (el) {
  el.addEventListener("click", deleteGame);
});

//posting comment

const commentGameButtons = document.querySelectorAll(".post-comment");

//loop through array of buttons and add event listener in order to run edit gamechat function
commentGameButtons.forEach(function (el) {
  el.addEventListener("click", postComment);
});
