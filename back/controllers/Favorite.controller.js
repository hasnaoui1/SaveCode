const { Favorite, Notification , Snippet, User } = require('../models');

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { snippetId } = req.body;

    const snippet = await Snippet.findByPk(snippetId , {include: User});
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

    const existing = await Favorite.findOne({ where: { userId, snippetId } });
    if (existing) return res.status(400).json({ message: 'Already favorited' });

    const favorite = await Favorite.create({ userId, snippetId });
    if (snippet.userId !== userId) {
      await Notification.create({
        userId: snippet.userId,
        message: `${req.user.username} favorited your snippet "${snippet.title}"`,
      });
    }
    res.status(201).json({ message: 'Snippet favorited', favorite });
  } catch (error) {
    console.error('Add Favorite Error:', error);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { snippetId } = req.params;

    const favorite = await Favorite.findOne({ where: { userId, snippetId } });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });

    await favorite.destroy();
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    console.error('Remove Favorite Error:', error);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};


exports.getAllFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Snippet,
          include: [{ model: User, attributes: ['id', 'username'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(favorites);
  } catch (error) {
    console.error('Get All Favorites Error:', error);
    res.status(500).json({ message: 'Failed to retrieve favorites' });
  }
};
