import { Booking,Room } from "../Model/Model.js";

export const createRoom = async(req,res) => {
        try {
                const room = new Room(req.body);
                const savedRoom = await room.save();
                res.status(201).json(savedRoom);
              } catch (error) {
                res.status(400).json({ error: error.message });
              }
}
export const bookRoom = async(req,res) => {
        try {
                const booking = new Booking(req.body);
                const savedBooking = await booking.save();
                res.status(201).json(savedBooking);
              } catch (error) {
                res.status(400).json({ error: error.message });
              }
}
export const getAllBookedRooms = async(req,res) => {
        try {
                const rooms = await Room.aggregate([
                  {
                    $lookup: {
                      from: 'bookings',
                      localField: '_id',
                      foreignField: 'roomId',
                      as: 'bookings',
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1, 
                      bookings: {
                        $map: {
                          input: '$bookings',
                          as: 'booking',
                          in: {
                            bookedStatus: true, 
                            customerName: '$$booking.customerName', 
                            date: '$$booking.date', 
                            startTime: '$$booking.startTime', 
                            endTime: '$$booking.endTime', 
                          },
                        },
                      },
                    },
                  },
                ]);
                res.status(200).json(rooms);
              } catch (error) {
                res.status(500).json({ error: error.message });
              }
            };
export const getAllBookedCustomers = async(req,res) => {
        try {
                const customers = await Booking.aggregate([
                  {
                    $lookup: {
                      from: 'rooms',
                      localField: 'roomId',
                      foreignField: '_id',
                      as: 'room',
                    },
                  },
                  {
                    $project: {
                      customerName: 1, 
                      roomName: '$room.name', 
                      date: 1, 
                      startTime: 1, 
                      endTime: 1,
                      _id: 0,
                    },
                  },
                ]);
                res.status(200).json(customers);
              } catch (error) {
                res.status(500).json({ error: error.message });
              }
            };
export const getCustomerBookingCount = async(req,res) =>{
        try {
                const customerBookingHistory = await Booking.aggregate([
                  {
                    $group: {
                      _id: {
                        customerName: '$customerName',
                        roomId: '$roomId', // Include room ID for grouping by room
                      },
                      count: { $sum: 1 },
                      bookings: { $push: '$$ROOT' },
                    },
                  },
                  {
                    $lookup: {
                      from: 'rooms',
                      localField: '_id.roomId',
                      foreignField: '_id',
                      as: 'room',
                    },
                  },
                  {
                    $unwind: '$room',
                  },
                  {
                    $project: {
                      _id: 0, 
                      customerName: '$_id.customerName',
                      roomName: '$room.name',
                      date: '$bookings.date',
                      startTime: '$bookings.startTime',
                      endTime: '$bookings.endTime',
                      bookingId: '$bookings._id',
                      bookingDate: '$bookings.createdAt', 
                      count: 1, 
                    },
                  },
                ]);
                res.status(200).json(customerBookingHistory);
              } catch (error) {
                res.status(500).json({ error: error.message });
              }
            };