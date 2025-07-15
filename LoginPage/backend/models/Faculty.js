import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, default: "faculty" },
});

const Faculty = mongoose.model("Faculty", facultySchema);
export default Faculty;
