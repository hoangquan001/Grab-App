const mongoose = require('mongoose');

const { Schema } = mongoose;
const TripSchema = new Schema({
  customer: { ref: 'user', type: Schema.Types.ObjectId, require: true },
  driver: { ref: 'user', type: Schema.Types.ObjectId },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date },
  departurePlace: String,
  destination: String,
  fare: Number,
  status: {
    type: String,
    enum: ['Waiting', 'Cancelled', 'Driving', 'Finished'],
    default: 'Waiting',
    require: true,
  },
}, { timestamps: true });
TripSchema.index({ departurePlace: 'text', destination: 'text' });

const Trip = mongoose.model('trip', TripSchema);

module.exports = Trip;
