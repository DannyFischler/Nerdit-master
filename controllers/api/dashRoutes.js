const router = require("express").Router();
const { User, Game } = require("../../models");
const Comment = require("../../models");
const withAuth = require("../../utils/auth");

//getting routes

router.get("/", withAuth, async (req, res) => {
  try {
    //getting data from blogs DB
    // const gameData = await Game.findAll({
    //   include: [
    //     {
    //       model: User,
    //     },
    //     {
    //       model: Comment,
    //     },
    //   ],
    //   where: {
    //     user_id: req.session.user_id,
    //   },
    // });

    //serialzing data for template to read
    // const games = gameData.map((game) => game.get({plain : true}));

    
    const games = [
      {
        id: 1234,
        content: "stupid content",
        title: "test",
        user_id: 1234,
        date_created: "12/2/23",
        user: {
          user_name: "Danny",
        },
        comments: [
          { date_created: "now", user_id: 6969, comment: "comment 1" },
          { date_created: "whenever", user_id: 777, comment: "comment 2" },
        ],
      },
      {
        id: 6882,
        content: "extra content",
        title: "everyone",
        user_id: 1234,
        date_created: "11/2/23",
        user: {
          user_name: "Danny",
        },
        comments: [
          { date_created: "after", user_id: 6969, comment: "comment 1" },
          { date_created: "before", user_id: 777, comment: "comment 88" },
        ],
      },
    ];
    res.render("dash", {
        games,
        logged_in: req.session.logged_in,
        user_name: req.session.user_name,
        user_id: req.session.user_id,
      });
    //passing serialized data and session flag into db
  } catch (err) {
    res.status(500).json(err);
  }
});

//post routes

router.post("/game", withAuth, async (req, res) => {
  console.log(`trying to create a game talk`);
  try {
    console.log(JSON.stringify(req.body));
    const gameData = await Game.create(req.body);
    res.status(200).json(gameData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//posting new comments associated with blogs and users to db

// Posts new blogs associated with users to the db
//Route
router.post("/game", withAuth, async (req, res) => {
  console.log(`trying to create a game talk`);
  try {
    console.log(JSON.stringify(req.body));
    const gameData = await Game.create(req.body);
    res.status(200).json(gameData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//posting new comments to blogs and users to the db
//Route
router.post("/comment", withAuth, async (req, res) => {
  console.log(`reqeust body is ${JSON.stringify(req.body)}`);
  try {
    const commentData = await Comment.create(req.body);
    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//put routes

//editing existing comment
// Route
router.put("/game/:id", async (req, res) => {
  console.log(`reqeust body is ${JSON.stringify(req.body)}`);
  console.log(req.params.id);
  try {
    await Game.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );
    res.status(200).json(`game talk updated successfully!`);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete routes

//route to delete a blog
router.delete("/game/:id", async (req, res) => {
  console.log(`reqeust body is ${JSON.stringify(req.body)}`);
  try {
    await Game.destroy({ where: { id: req.params.id } });
    res.status(200).json(`game talk deleted successfully.`);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
