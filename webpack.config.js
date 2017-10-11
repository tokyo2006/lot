var path = require('path');

var config = {
    entry: {
        main: './views/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: "/public",
        filename: 'main.js',
    },
    devServer: {
        open: true, // to open the local server in browser
        contentBase: __dirname + '/public',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract(['css-loader', 'less-loader'])
        ]
    }
};

module.exports = config;
