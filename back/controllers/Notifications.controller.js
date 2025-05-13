const {Notification, User } = require('../models');


exports.DisplayNotifications = async (req, res) => {
    try {
      const Notifications = await Notification.findAll({
        include: [{ model: User, attributes: ['id', 'username'] }],
        order: [['createdAt', 'DESC']],
        where: { userId: req.user.id }, 
      });
  
      res.json(Notifications); 
    } catch (err) {
      res.status(500).json({ message: 'Failed to get notifications' });
    }
  };
  

  exports.markRead = async (req, res) => {
    try {
      const { notificationId } = req.body;
  
      const notification = await Notification.findByPk(notificationId);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      notification.isRead = true;
      await notification.save();
  
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update notification' });
    }
  };
  

