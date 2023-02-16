// "express" import
import express from "express";
import morgan from "morgan";


const PORT = 4000;


// app 생성
const app = express();

// morgan 호출 
//설정한 middleware를 호출
const logger = morgan("dev");


// application 설정
const handleHome = (request, response) => {
    return response.end();
};
const handleLogin = (req, res) => {
    return res.send("Login here.");
};

app.use(logger)
app.get("/", handleHome);  // middleware 사용시 app.get(route, middleware, controller);로 사용. middleware는 여러개 사용 가능
app.get("/login", handleLogin);


// listening 할 포트(, 콜백 함수 설정)
const handleServer = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleServer);
