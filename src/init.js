import "dotenv/config";  // require("dotenv").config(); 와 같다.
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server"

// listening 할 포트(, 콜백 함수 설정)
//const PORT = 4000;

//const handleServer = () => console.log(`Server listening on port http://localhost:${PORT}`);
const handleServer = () => console.log(`Server listening on`);

// app.listen(PORT, handleServer);
app.listen(process.env.PORT || 4000, handleServer);