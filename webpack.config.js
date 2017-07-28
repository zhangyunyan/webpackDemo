var htmlWebpackPlugin=require("html-webpack-plugin");
module.exports={
    // 字符串这种写法时，__dirname不能用.代替
    // entry: __dirname+'/src/script/main.js',

    // entry:["./src/script/main.js","./src/script/a.js"],

    entry:{
        main:"./src/script/main.js",
        a:"./src/script/a.js"
    },
    output:{
        path: __dirname+'/dist',
        // filename:'bundle.js'
        filename:'js/[name].js',
        publicPath:'http://zhangyunyan.github.io/'
    },
    plugins:[
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'index.html',
            // inject:'head',
            inject:false,
            title:'webpack is good',
            date:new Date(),
            minify:{
                removeComments:true,
                collapseWhitespace:true
            }
        })
    ]
}