var htmlWebpackPlugin=require("html-webpack-plugin");
module.exports={
    // 字符串这种写法时，__dirname不能用.代替
    // entry: __dirname+'/src/script/main.js',

    // entry:["./src/script/main.js","./src/script/a.js"],

    entry:{
        main:"./src/script/main.js",
        a:"./src/script/a.js",
        b:"./src/script/b.js",
        c:"./src/script/c.js"
    },
    output:{
        path: __dirname+'/dist',
        // filename:'bundle.js'
        filename:'js/[name].js',
        publicPath:'http://zhangyunyan.github.io/'
    },
    plugins:[
        new htmlWebpackPlugin({
            filename:'a.html',
            template:'index.html',
            // inject:'head',
            // inject:'body',
            inject:false,
            title:'a.html',
            // chunks:['a','main']
        }),
        new htmlWebpackPlugin({
            filename:'b.html',
            template:'index.html',
            // inject:'head',
            // inject:'body',
            inject:false,
            title:'b.html',
            // chunks:['b','main']
        }),
        new htmlWebpackPlugin({
            filename:'c.html',
            template:'index.html',
            // inject:'head',
            // inject:'body',
            inject:false,
            title:'c.html',
            // chunks:['c','main']
        })
    ]
}