const path = require('path');
module.export = {
    // entry: path.join(__dirname, './src/main.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: "./dist/"
    },
    watch: true,
    // 新添加的module属性
    module: {
        loaders: [
            {test: /\.js$/, loader: "babel"},
            {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
            {test: /\.css$/, loader: ['style', 'css']},
            {test: /\.scss$/, loader: ['style', 'css', 'sass']}
        ]
    }
}