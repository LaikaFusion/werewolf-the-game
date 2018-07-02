const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
  {
    from: String,
    to: [String],
    body: String
  },
  { usePushEach: true }
);

module.exports = mongoose.model('Message', messageSchema);
