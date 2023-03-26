const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/";
module.exports = {
    entry: {
        main: BASE_JS + "main.js",  // 변경할 파일
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js"
    },
    // mode: "development",  // default는 production. 개발시 development로 사용하고 완료 후 배포시 production로 변경
    // watch: true,  // frontend file 수정시 자동으로 comfile, refresh. console을 따로 사용해야 함
    output: {
        filename: "js/[name].js",  // 변경된 파일. [name]이라고 쓰면 entry에 있는 이름으로 각각 생성됨
        path: path.resolve(__dirname, "assets"),
        clean: true  // 서버 재실행시 사용하지 않는 파일 자동 삭제
    },
    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css"
    })],
    module: {
        rules: [
            {
                test: /\.js$/,

    /* 여기까지는 꼭 이해하고 기억하자 */

                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                        ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use:  [MiniCssExtractPlugin.loader/*"style-loader" 대체*/, "css-loader", "sass-loader"]  // webpack은 뒤에서부터 실행. js에서 css를 적용
            }
        ],
    },
}

