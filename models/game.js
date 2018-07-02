const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: new mongoose.Types.ObjectId()
    },
    participants: [String],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
      }
    ]
  },
  { usePushEach: true }
);

const gameSchema = new mongoose.Schema(
  {
    name: String,
    conversations: [conversationSchema],
    participants: [String],
    invites: [String]
  },
  { usePushEach: true }
);

module.exports = mongoose.model('Game', gameSchema);
