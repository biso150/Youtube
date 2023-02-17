// package import
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;


// app 생성
const app = express();


// morgan으로 설정한 middleware("dev")를 호출
const logger = morgan("dev");
app.use(logger);


// router 설정
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);


// listening 할 포트(, 콜백 함수 설정)
const handleServer = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleServer);


/*
// application 설정
const handleHome = (request, response) => {
    return response.end();
};
const handleLogin = (req, res) => {
    return res.send("Login here.");
};

app.get("/", handleHome);  // middleware 사용시 app.get(route, middleware, controller);로 사용. middleware는 여러개 사용 가능
app.get("/login", handleLogin);
*/