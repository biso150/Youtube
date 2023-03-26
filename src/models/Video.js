import mongoose from "mongoose";

const videoSchema = new mongoose.Schema ({
  title: {type: String, required: true, maxLength: 80},
  description: {type: String, required: true, minLength: 5},
  fileUrl: {type: String, required: true},
  thumbUrl: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  hashtags: [{type: String, required: true}],
  meta: {
    views: {type: Number, default: 0, required: true},
    rating: {type: Number, default: 0, required: true}
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }  // mongoose.Schema.Types.ObjectId - mongoose에서만 사용하는 objectId type  // ref: "User" - models와 연결함
});

// videoSchema.pre('save', async function() {
//   this.hashtags = this.hashtags[0].split(",").map((word) => word.startsWith('#') ? word : `#${word})`)
//   console.log(this)
// });

videoSchema.static('formatHashtags', function(hashtags) {  // 사용자 정의 함수 생성
  return hashtags.split(",").map((word) => word.startsWith('#') ? word : `#${word}`);
});

const Video = mongoose.model("Video", videoSchema);

export default Video;