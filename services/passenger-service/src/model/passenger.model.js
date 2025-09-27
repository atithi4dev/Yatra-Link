import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // reference from Auth Service
  email: { type: String, required: true },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  bookings: { type: Array, default: [] },
  preferences: { type: Object, default: {} },
  isVerified: { type: Boolean, default: false },
});

export default mongoose.model('Passenger', passengerSchema);