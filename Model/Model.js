import mongoose from "mongoose"

const roomSchema = mongoose.Schema({
        name: String,
        seats: Number,
        amenities: [String],
        pricePerHour: Number,      
})

const bookingSchema = mongoose.Schema({
        customerName: String,
        date: Date,
        startTime: String,
        endTime: String,
        roomId: mongoose.Schema.Types.ObjectId,
        createdAt: {
                type: Date,
                default: new Date(),
              },
})
export const Room = mongoose.model('Room', roomSchema);
export const Booking = mongoose.model('Booking', bookingSchema);