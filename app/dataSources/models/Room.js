const mongoose = require('mongoose');

const { Schema } = mongoose;
const RoomSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'user', required: true }],
  trip: { type: Schema.Types.ObjectId, ref: 'trip' },
  messages: [{
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    message: String,
    createAt: { type: Date, default: Date.now() },
  }],

});

const Room = mongoose.model('room', RoomSchema);

module.exports = Room;
