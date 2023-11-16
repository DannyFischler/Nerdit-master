const axios = require("axios");
const router = require("express").Router();
const { Game, Comment, User } = require("../../models");

// Route to get game details by game name
router.get("/", async (req, res) => {
  try {
    //rendering the login screen and status when they are logged in
    res.render("game", {
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search/:gameName", async (req, res) => {
  const gameName = req.params.gameName.replace(/-/g, " ");

  try {
    const rawgResponse = await axios.get(`https://api.rawg.io/api/games`, {
      params: {
        key: process.env.RAWG_KEY,
        search: gameName,
      },
    });

    if (!rawgResponse.data.results.length) {
      return res.status(404).json({ message: "Game not found" });
    }

    const gameInfo = rawgResponse.data.results[0];

    const gameidResponse = await axios.get(
      `https://api.rawg.io/api/games/${gameInfo.id}?key=${process.env.RAWG_KEY}`
    );

    if (!Object.keys(gameidResponse.data).length) {
      return res.status(404).json({ message: "Game still not found" });
    }

    const gameDetails = gameidResponse.data;

    const attributes = {
      Overview: gameDetails.description.replace(/<\/?[^>]+(>|$)/g, "") || "",
      "Release Date": gameDetails.released,
      Developers: gameDetails.developers?.map((dev) => dev.name) || [],
      Platforms: gameDetails.platforms?.map((p) => p.platform.name) || [],
      Genres: gameDetails.genres?.map((genre) => genre.name) || [],
      // Include additional attributes you're interested in
    };

    const game = await Game.findByPk(gameDetails.id);
    if (game === null) {
      const newGame = await Game.create({
        id: gameDetails.id,
        name: gameDetails.name,
      });
    }

    const comments = await Comment.findAll({
      where: { game_id: gameDetails.id },
    });

    res.render("game", {
      userId: `${req.session.user_id}`,
      gameDetails,
      attributes,
      comments: comments?.map((comment) => comment.text) || [],
      logged_in: req.session.logged_in,
    });
    // res.json({ gameDetails, attributes, comments });
  } catch (error) {
    console.error("Error fetching game data:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});

// Route to get comments for a specific game by ID and attribute/category
router.get("/comments/:gameId/:attribute", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        game_id: req.params.gameId,
        category: req.params.attribute,
      },
      include: [
        { model: Game },
        { model: User, attributes: ["user_name"] }, // Include User details here as well
      ],
    });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

router.post("/comment", async (req, res) => {
  const comment = await Comment.create(req.body);

  res.status(200).json(comment);
});

module.exports = router;
