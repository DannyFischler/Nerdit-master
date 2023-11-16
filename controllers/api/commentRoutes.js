const axios = require('axios');
const router = require('express').Router();
const { Comment, User } = require('../../models'); 

// Route to post a new comment associated with a game's slug and category of info
router.post('/', async (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).json({ message: 'You must be logged in to post a comment.' });
  }

  const { gameSlug, category, text } = req.body;

  try {
    const newComment = await Comment.create({
      game_slug: gameSlug,
      category,
      text,
      userId: req.session.user_id
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error posting comment', error });
  }
});

// Route to fetch comments for a specific game and category/attribute
router.get('/:gameSlug/:category', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: {
        game_slug: req.params.gameSlug,
        category: req.params.category,
      },
      include: [{
        model: User,
        attributes: ['user_name']
      }]
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

// Route to fetch an overview of all comments for a game
router.get('/:gameSlug/overview', async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { game_slug: req.params.gameSlug },
      include: [{
        model: User,
        attributes: ['user_name']
      }]
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comment overview', error });
  }
});

// Route to update a specific comment by id
router.put('/:id', async (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).json({ message: 'You must be logged in to update a comment.' });
  }

  try {
    const updatedComment = await Comment.update(req.body, {
      where: {
        id: req.params.id,
        userId: req.session.user_id
      },
    });

    if (updatedComment[0] > 0) {
      res.status(200).json({ message: 'Comment updated' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
});

// Route to delete a specific comment by id
router.delete('/:id', async (req, res) => {
  if (!req.session.user_id) {
    return res.status(403).json({ message: 'You must be logged in to delete a comment.' });
  }

  try {
    const result = await Comment.destroy({
      where: {
        id: req.params.id,
        userId: req.session.user_id
      },
    });

    if (result > 0) {
      res.status(200).json({ message: 'Comment deleted' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
});

module.exports = router;
