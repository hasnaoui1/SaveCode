const { Comment, User,Notification, Snippet } = require('../models');


exports.createComment = async (req, res) => {
  try {
    const { snippetId, content } = req.body;
    const userId = req.user.id;

   
    const snippet = await Snippet.findByPk(snippetId, {include : User});
    if (!snippet) return res.status(404).json({ message: 'Snippet not found' });

    const comment = await Comment.create({
      content,
      userId,
      snippetId
    });
    if (snippet.userId !== userId) {
      await Notification.create({
        userId: snippet.userId,
        message: `${req.user.username} commented on your snippet "${snippet.title}": "${content}"`,
      });
    }

    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.error('Create Comment Error:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};


exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await comment.update({ content });
    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Update Comment Error:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.userId !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete Comment Error:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
