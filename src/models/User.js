import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl : String,
  githubLoginOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: String,
  name: { type: String, /*required: true */},
  location: String,  
  comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]  // ref: references 
})

userSchema.pre('save', async function() {
  if (this.isModified("password")) {  // password가 바뀔 떄
    this.password = await bcrypt.hash(this.password, 5)  // this = 새로 생기는 user 데이터
  }
})

const User = mongoose.model('User', userSchema)

export default User;