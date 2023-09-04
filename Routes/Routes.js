import express from "express"
import { bookRoom, createRoom, getAllBookedCustomers, getAllBookedRooms, getCustomerBookingCount } from "../Controller/Controller.js"

const router = express.Router()
router.post("/createRoom",createRoom)
router.post("/bookRoom",bookRoom)
router.get("/rooms/booked",getAllBookedRooms)
router.get("/customers/booked",getAllBookedCustomers)
router.get("/customers/booking-count",getCustomerBookingCount)

export default router