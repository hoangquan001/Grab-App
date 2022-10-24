const { Trip, Room } = require('../../models');
const { leaveAllUserInRoom } = require('../../../socket');

async function createTripByCustomer(args, { signature }) {
  try {
    const { userId, userRole } = signature;
    if (userRole !== 'Customer') {
      return {
        isSuccess: false,
        message: 'Only customer create trip',
      };
    }
    const tripProps = { ...args.trip, customer: userId };
    const NewTrip = new Trip(tripProps);
    const insTrip = await NewTrip.save();
    // console.log(insTrip);
    return {
      isSuccess: true,
      message: 'Creating trip successfully',
      trip: insTrip,
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: e.message,
    };
  }
}

async function acceptTripByDriver(args, { signature }) {
  try {
    const { userId, userRole } = signature;
    if (userRole !== 'Driver') {
      return {
        isSuccess: false,
        message: 'Only Driver accept trip',
      };
    }

    const { tripId } = args;
    let tripInstance = await Trip.findById(tripId).lean();
    if (tripInstance.driver) {
      return {
        isSuccess: false,
        message: 'Trip has driver',
      };
    }
    tripInstance = await Trip.findByIdAndUpdate(
      { _id: tripId },
      { driver: userId, status: 'Driving', startDate: Date.now() },
      { new: true },
    ).lean();

    return {
      isSuccess: true,
      message: 'Accepting trip successfully',
      trip: tripInstance,
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: e.message,
    };
  }
}
async function cancelTripByCustomer(args, { signature }) {
  try {
    const { userId, userRole } = signature;

    if (userRole !== 'Customer') {
      return {
        isSuccess: false,
        message: 'Only customer cancel trip',
      };
    }
    const { tripId } = args;
    let tripInstance = await Trip.findOne({ _id: tripId, customer: userId })
      .lean();
    if (!tripInstance) {
      return {
        isSuccess: false,
        message: 'trip not found',
      };
    }

    if (tripInstance.status !== 'Waiting') {
      return {
        isSuccess: false,
        message: 'only waiting status can cancel',
      };
    }

    tripInstance = await Trip.findOneAndUpdate(
      { _id: tripId, customerId: userId },
      { status: 'Cancelled' },
      { new: true },
    ).lean();

    const { _id: roomId } = await Room.findOne({ trip: tripId })
      .select({ _id: 1 })
      .lean();
    leaveAllUserInRoom(roomId);
    return {
      isSuccess: true,
      message: 'cancel trip successfully',
      trip: tripInstance,
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: e.message,
    };
  }
}

async function finishTripByDriver(args, { signature }) {
  try {
    const { userId, userRole } = signature;
    const { tripId } = args;
    if (userRole !== 'Driver') {
      return {
        isSuccess: false,
        message: 'Only customer cancel trip',
      };
    }
    let tripInstance = await Trip.findOne({ _id: tripId, driver: userId })
      .lean();
    if (!tripInstance) {
      return {
        isSuccess: false,
        message: 'trip not found',
      };
    }

    if (tripInstance.status !== 'Driving') {
      return {
        isSuccess: false,
        message: 'only Driving status can finish trip',
      };
    }

    tripInstance = await Trip.findOneAndUpdate(
      { _id: tripId, driver: userId },
      { status: 'Finished', endDate: Date.now() },
      { new: true },
    )
      .lean();
    const { _id: roomId } = await Room.findOne({ trip: tripId })
      .select({ _id: 1 })
      .lean();

    leaveAllUserInRoom(roomId);
    return {
      isSuccess: true,
      message: 'cancel trip successfully',
      trip: tripInstance,
    };
  } catch (e) {
    return {
      isSuccess: false,
      message: e.message,
    };
  }
}
module.exports = {
  createTripByCustomer,
  cancelTripByCustomer,
  acceptTripByDriver,
  finishTripByDriver,
};
