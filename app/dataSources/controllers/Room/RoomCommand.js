const { Room, Trip } = require('../../models');

async function joinChatRoom(args, context) {
  try {
    const { signature } = context;
    const { userId } = signature;
    const { tripId } = args;
    const queryTrip = { _id: tripId, $or: [{ driver: userId }, { customer: userId }] };
    const trip = await Trip.findOne(queryTrip)
      .select({ _id: 1, status: 1, driver: 1, customer: 1 }).lean();
    if (!trip) {
      return {
        isSuccess: false,
        message: 'invalid conected user or trip',
      };
    }
    if (trip.status !== 'Driving') {
      return {
        isSuccess: false,
        message: 'you can\'t chat unless a trip is driving',
      };
    }

    const queryRoom = { users: [trip.driver, trip.customer], trip: tripId };
    let room = await Room.findOne(queryRoom).lean();

    if (!room) {
      room = await Room.create(queryRoom);
    }
    return {
      isSuccess: true,
      message: 'join room successfully',
      room,
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: e.message,
    };
  }
}

module.exports = {
  joinChatRoom,
};
