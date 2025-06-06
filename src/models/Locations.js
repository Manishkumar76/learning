import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
});

export default mongoose.models.Locations || mongoose.model('Locations', locationSchema);
