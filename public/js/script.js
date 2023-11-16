var attributes = []
document.addEventListener("DOMContentLoaded", (event) => {
  // Attempt to get gameId from URL path
  const gameId = window.location.pathname.split("/")[2];
  if (gameId) {
    document.getElementById("gameSlug").value = gameId;
    loadGameDetails(gameId);
  }

  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const searchQuery = document.getElementById("search-input").value;
    searchAndDisplayGame(searchQuery);
  });

  const commentForm = document.getElementById("comment-form");
  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitComment();
  });
});

function searchAndDisplayGame(searchQuery) {
  fetch(`/api/games/search/${encodeURIComponent(searchQuery)}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("DATA", data);
      attributes = Object.keys(data.attributes)
      displayGameInfo(data.gameDetails);
      displayAttributes(data.attributes);
      // document.getElementById("gameSlug").value = data.gameDetails2.id; // 
      // selectAttribute("overview"); // 
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loadGameDetails(gameId) {
  fetch(`/api/games/search/${gameId}`)
    .then((response) => response.json())
    .then((data) => {
      displayGameInfo(data.gameDetails2);
      displayAttributes(data.attributes);
      selectAttribute("overview");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// displays the name of the title in bold
function displayGameInfo(gameDetails) {
  console.log("displayGameInfo", gameDetails);
  const gameInfoDiv = document.getElementById("game-info");
  gameInfoDiv.innerHTML = `<h2>${gameDetails.name}</h2>`; 
  const gamePic = document.getElementById("game-pic");
  gamePic.setAttribute("src", gameDetails.background_image); 
  gamePic.style.visibility = "visible";
}

// displays a list of interactable attributes FAIL!
function displayAttributes(attributes) {
  const attributesContainer = document.getElementById("game-attributes-list");
  attributesContainer.innerHTML = ""; // Clear existing attributes

  // Iterate over attributes and create cards
  for (const key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const card = document.createElement('div');
      card.classList.add('card', 'mt-3');

      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-header');
      cardHeader.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      cardHeader.setAttribute('data-toggle', 'collapse');
      cardHeader.setAttribute('href', `#collapse${key}`);
      cardHeader.style.cursor = 'pointer';

      const collapseDiv = document.createElement('div');
      collapseDiv.id = `collapse${key}`;
      collapseDiv.classList.add('collapse');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.innerHTML = getAttributeHTML(key, attributes[key]);

      collapseDiv.appendChild(cardBody);
      card.appendChild(cardHeader);
      card.appendChild(collapseDiv);      
      
      attributesContainer.appendChild(card);
    }
  }

  // Add comments section after attributes
  displayCommentsSection();
}

function displayCommentsSection(comments) {

  const attributesContainer = document.getElementById("game-attributes-list");

  const commentsCard = document.createElement('div');
  commentsCard.classList.add('card', 'mt-3');

  const commentsHeader = document.createElement('div');
  commentsHeader.classList.add('card-header');
  commentsHeader.textContent = 'Comments';

  const commentsList = document.createElement('ul');
  commentsList.id = 'comments-list';
  commentsList.classList.add('list-group', 'list-group-flush');

  if (comments && comments.length > 0) {
    comments.forEach(comment => {
      const commentItem = document.createElement('li');
      commentItem.classList.add('list-group-item');
      commentItem.textContent = `${comment.user.user_name}: ${comment.text}`;
      commentsList.appendChild(commentItem);
    });
  } else {
    const noCommentsItem = document.createElement('li');
    noCommentsItem.classList.add('list-group-item');
    noCommentsItem.textContent = 'No comments yet.';
    commentsList.appendChild(noCommentsItem);
  }

  commentsCard.appendChild(commentsHeader);
  commentsCard.appendChild(commentsList);

  attributesContainer.appendChild(commentsCard);
}

function getAttributeHTML(key, attribute) {
  let innerHtml = "<ul class='list-group list-group-flush'>"; // Start list

  if (typeof attribute === "string") {
    innerHtml += `<li class='list-group-item'>${attribute}</li>`;
  } else if (Array.isArray(attribute)) {
    attribute.forEach((value) => {
      innerHtml += `<li class='list-group-item'>${value}</li>`;
    });
  }

  innerHtml += "</ul>"; // End list
  return innerHtml;
}


function getAttributeHTML(key, attribute) {
  let innerHtml = "<ul class='list-group list-group-flush'>"; // Start list

  if (typeof attribute === "string") {
    innerHtml += `<li class='list-group-item'>${attribute}</li>`;
  } else if (Array.isArray(attribute)) {
    attribute.forEach((value) => {
      innerHtml += `<li class='list-group-item'>${value}</li>`;
    });
  }

  innerHtml += "</ul>"; // End list
  return innerHtml;
}


// DROPDOWN
function selectAttribute(attribute) {
  console.log("selecting attribute", attribute);
  for (let i = 0; i < attributes.length; i++) {
    if (attributes[i].localeCompare(attribute) != 0) {
    document.getElementById(attributes[i]).style.display = `none`;
    }
  }
  
  const attributeElement = document.getElementById(attribute)
  if (attributeElement.style.display === `block`){
    attributeElement.style.display = `none`;
  } else {
    attributeElement.style.display = `block`;
  }
  // const gameId = document.getElementById("gameSlug").value;
  // fetchAndDisplayComments(gameId, attribute);
}

function fetchAndDisplayComments(gameId, attribute) {
  let url = `/api/comments/${gameId}`;
  if (attribute && attribute !== "overview") {
    url += `/${attribute}`;
  }

  fetch(url)
    .then((response) => response.json())
    .then((comments) => {
      displayComments(comments);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function displayComments(comments) {
  const commentsDiv = document.getElementById("comments");
  commentsDiv.innerHTML = comments
    .map((comment) => `<p>${comment.user.user_name}: ${comment.text}</p>`)
    .join("");
}

function submitComment() {
  const commentText = document.getElementById("commentText").value;

  fetch(`/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include other headers as needed, e.g., authorization tokens
    },
    body: JSON.stringify({
      gameSlug: gameId,
      attribute: 'overview', // Assuming 'overview' is the default category for comments
      text: commentText,
    }),
  })
  .then(response => response.json())
  .then(comment => {
    addCommentToDisplay(comment);
    document.getElementById("commentText").value = ""; // Clear the text area
  })
  .catch(error => {
    console.error("Error posting comment:", error);
  });
}

function addCommentToDisplay(comment) {
  // Assuming comment object has the structure: { id, text, user: { user_name } }
  const commentsDiv = document.getElementById("comments");
  const commentElement = document.createElement('div');
  commentElement.innerHTML = `
    <div class="card mb-2">
      <div class="card-body">
        <p class="card-text">${comment.text}</p>
        <footer class="blockquote-footer">${comment.user.user_name}</footer>
        <button onclick="deleteComment(${comment.id})" class="btn btn-danger btn-sm">Delete</button>
        <button onclick="editComment(${comment.id})" class="btn btn-info btn-sm">Edit</button>
      </div>
    </div>
  `;
  commentsDiv.appendChild(commentElement);
}

function deleteComment(commentId) {
  fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      // Include headers as needed, e.g., authorization tokens
    }
  })
  .then(response => {
    if (response.ok) {
      // Remove the comment element from the DOM
      document.getElementById(`comment-${commentId}`).remove();
    } else {
      throw new Error('Failed to delete the comment.');
    }
  })
  .catch(error => {
    console.error("Error deleting comment:", error);
  });
}

function editComment(commentId) {
  // You need to provide a way for users to input their edited comment
  const newCommentText = prompt("Edit your comment:");
  if (newCommentText) {
    fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Include headers as needed, e.g., authorization tokens
      },
      body: JSON.stringify({ text: newCommentText })
    })
    .then(response => response.json())
    .then(() => {
      // Update the comment text in the DOM
      document.querySelector(`#comment-${commentId} .card-text`).textContent = newCommentText;
    })
    .catch(error => {
      console.error("Error updating comment:", error);
    });
  }
}