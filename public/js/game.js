const searchGame = async (event) => {
  event.preventDefault();

  const searchText = document.querySelector("#inputGame").value.trim();
  if (searchText) {
    document.location.replace(`games/search/${searchText}`);
  } else {
    alert("enter a game to search!");
  }
};

const addComment = async (event) => {
  event.preventDefault();

  const commentBox = document.querySelector("#inputComment");

  const response = await fetch("/api/games/comment", {
    method: "POST",
    body: JSON.stringify({
      text: commentBox.value.trim(),
      user_id: commentBox.dataset.userId,
      game_id: commentBox.dataset.gameId,
    }),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    alert(
      `comment added: ${commentBox.value.trim()} ${commentBox.dataset.userId} ${
        commentBox.dataset.gameId
      }`
    );
    document.location.reload();
  } else {
    alert("NOOOOOOOOOOO");
  }
};

document.querySelector("#search-button").addEventListener("click", searchGame);
document.querySelector("#comment-button").addEventListener("click", addComment);
