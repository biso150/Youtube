// package import
import "./init";
import express from "express";
import mongoStore from "connect-mongo";
import morgan from "morgan";
import session from "express-session"
import flash from "express-flash"

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";


// app 생성
const app = express();


// morgan으로 설정한 middleware("dev")를 호출
const logger = morgan("dev");
app.use(logger);
app.use(express.urlencoded({extended: true}));  // form을 객체로 변환. input에서 보낸 value를 req.body에서 받을 수 있음
app.use(express.json());  // json이 string으로 변환한 값을 객체로 변환


// view 엔진을 pug로 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");  // 기본 폴더 변경


// FFmpeg SharedArrayBuffer 오류
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
})


// session 설정 (router 앞에 위치)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,  // 신규 생성 후 수정 이력이 없을 경우 저장. 로그인 후 수정을 하기 때문에 false로 하면 로그인 한 사용자만 쿠키를 주도록 설정하게 됨.
    store: mongoStore.create({mongoUrl: process.env.DB_URL})
}))

app.use((req, res, next) => {
    req.sessionStore.all((errer, sessions) => {
        next();
    })
})

app.use(localsMiddleware);

app.use(flash());


// router 설정
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));  // static("폴더명"): 선택한 폴더에 url로 접근 가능하도록 설정
app.use("/assets", express.static("assets"));


export default app;


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