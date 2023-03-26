import mongoose from "mongoose";


// 오류가 나면 그냥 추가해준다
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_URL);
//mongoose.connect("mongodb://127.0.0.1:27017/youtube", { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true,
//   useFindAndModify: false, 
//   useCreateIndex: true, 
// });

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB")
const handleError = (error) => console.log("DB Error", error)
db.on("error", handleError)
db.once("open", handleOpen);