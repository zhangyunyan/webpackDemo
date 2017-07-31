## mkdir webpack-demo
## cd webpack-demo
## npm init -y生成package.json
## npm install webpack --save-dev
## mkdir src(存放代码源文件的目录)
## mkdir dist(存放打包过后的静态资源文件)
## 新建index.html并引入bundle.js文件
## src下建立script和style文件夹
## 新建webpack配置文件webpack.config.js文件（文件名称是固定的）
```
config API地址：
http://webpack.github.io/docs/configuration.html
```

## 注意：__dirname不能用.代替
```
module.exports={
    // __dirname不能用.代替
    entry: __dirname+'/src/script/main.js',
    output:{
    // __dirname不能用.代替
        path: __dirname+'/dist/js',
        filename:'bundle.js'
    }
}
```
### 用.报错如下
```
Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
 - configuration.output.path: The provided value "./dist/js" is not an absolute path!
```

## 这时直接在命令行运行webpack命令即可，dist文件夹下就出现了js->bundle.js

## 如果把webpack.config.js文件的名称改掉，webpack.config.js，运行报如下错误
```
No configuration file found and no output filename configured via CLI option.
A configuration file could be named 'webpack.config.js' in the current directory.
Use --help to display the CLI options.
```
### 解决方法：
```
方法1.webpack --config webpack.config.js
方法2.webpack.config.js文件名称用固定的这个
```

## 这种写法应该怎么添加参数？配合npm脚本可以做到，然后npm run webpack就可以了
```
{
  "name": "webpack-domo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    //增加webpack这段脚本
    "webpack":"webpack --config webpack.config.js --progress --display-modules --display-reasons --color"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^3.4.1"
  }
}
```

## entry入口，为了适应不同的需求有三种写法

### 字符串(一个入口文件，所有的依赖都在这一个文件中指定，也就是所有的require都在此文件中写)
```
entry: __dirname+'/src/script/main.js'
```
### 数组（为了解决两个平行的不相依赖的文件却想打包在一起）
```
entry: ["./entry1", "./entry2"]
```
### 对象（多页面应用,key为块名称）
```
{
    entry: {
        page1: "./page1",
        page2: ["./entry1", "./entry2"]
    },
    output: {
        // Make sure to use [name] or [id] in output.filename
        //  when using multiple entry points
        filename: "[name].bundle.js",
        chunkFilename: "[id].bundle.js"
    }
}
```

## output
### output中的filename不要指定路径，因为path中有路径了，如果filename也同时指定容易造成混乱

## 多个入口（多页面时候）
```
If your configuration creates more than a single “chunk” (as with multiple entry points or when using plugins like CommonsChunkPlugin), you should use substitutions to ensure that each file has a unique name.
[name] is replaced by the name of the chunk.(对象的key)
[hash] is replaced by the hash of the compilation.(哈希值)
[chunkhash] is replaced by the hash of the chunk. (文件版本号或者是MD5值)
```
```
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build'
  }
}
```

## 解决index.html引入的script文件的名称不确定问题，需要一个插件（html-webpack-plugin）,因此需要npm install html-webpack-plugin --save-dev这个插件

## 安装完此插件后需要在webpack.config.js中引入此插件

## 引入后如何使其与webpack结合起来呢

## 如果想使用插件，只需要在webpack.config.js配置文件的对象增加一项plugins,在plugins的value中新加一项，对这个插件初始化，这个插件的传参完全看插件的实现（实例化new html...()）
```
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
        path: __dirname+'/dist/js',
        // filename:'bundle.js'
        filename:'[name].js'
    },
    plugins:[
        new htmlWebpackPlugin()
    ]
}
```

## 运行npm run webpack,发现dist->js->index.html中已经自动引入了生成的这两个js文件

## 如何让初始化定义好的index.html和插件生成的index.html关联起来，以根目录下的index.html为模板生成dist—>js->index.html
### 可以通过给这个实例传参实现
```
plugins:[
        new htmlWebpackPlugin({
            template:'index.html'
            //这里有个疑问，为什么这的index.html是根目录下的呢？其中这有个上下文的概念
        })
    ]
    //代表整个运行环境的上下文，上下文环境context的默认值是运行这个脚本的目录，所以我们一般是在根目录下运行脚本，那么我们的上下文就是根目录
```

## 此时运行会发现dist下的index.html中除了刚刚生成的两个js还多了根目录下引用的bundle.js文件

## 更改根目录下index.html模板的标题，重新运行命令，发现dist下的index.html的标题也改为模板标题了

## 此时我们发现所有打包生成的文件都是在dist->js下的这与实际项目不符
```
//因为 path: __dirname+'/dist/js'指向这，所以插件生成的东西也是存放在这
output:{
        path: __dirname+'/dist/js',
        // filename:'bundle.js'
        filename:'[name].js'
    }
```
### 解决方法：
```
output:{
        path: __dirname+'/dist',
        // filename:'bundle.js'
        filename:'js/[name].js'
    }
```

## filename指定生成的html的文件名，inject决定生成的script文件注入在head还是body中
```
plugins:[
        new htmlWebpackPlugin({
            filename:'index-[hash].html',
            template:'index.html',
            inject:'head'
        })
    ]
```

## 实现参数中传参，模板中引用
```
plugins:[
        new htmlWebpackPlugin({
            filename:'index-[hash].html',
            template:'index.html',
            inject:'head'，
            title:'webpack is good'
        })
    ]
```
```
<title>webpack demo test change</title>更改为==><title><%=htmlWebpackPlugin.options.title%></title>
```

## html-webpack-plugin插件官网
```
https://www.npmjs.com/package/html-webpack-plugin
```

## javascript head标签和body标签分别引入main 和a
```
plugins:[
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'index.html',
            inject:false,//false,如果为head的话，所有js都重新注入到head中
            title:'webpack is good',
            date:new Date()
        })
    ]
```
```
<head>
    <meta charset="UTF-8">
    <title><%=htmlWebpackPlugin.options.title%></title>
    <script src="<%= htmlWebpackPlugin.files.chunks.main.entry%>"></script>
</head>
```
```
<body>
<script src="<%= htmlWebpackPlugin.files.chunks.a.entry%>"></script>
</body>
```

## 打包上线地址，打包上线地址肯定和我们本地地址是不一样的,这时候需要借助output的一个新的属性publicPath;那么这个publicPath和path有什么区别呢？

- path：只要输出的时候就会起作用，把我们所有输出的文件放在这个目录下
- publicPath：可以理解为他是个占位符，当设他的时候需要上线，假如这个值为'http://zhangyunyan.github.io/',则打包后html中引用的地址就会变为线上地址
```
output:{
        path: __dirname+'/dist',
        // filename:'bundle.js'
        filename:'js/[name].js',
        publicPath:'http://zhangyunyan.github.io/'
    },
```
```
<head>
    <meta charset="UTF-8">
    <title>webpack is good</title>
    <script src="http://zhangyunyan.github.io/js/main.js"></script>
</head>
```
```
<body>
<script src="http://zhangyunyan.github.io/js/a.js"></script>
</body>
```

## 上线压缩，plugins中添加minify参数
```
plugins:[
        new htmlWebpackPlugin({
            filename:'index.html',
            template:'index.html',
            // inject:'head',
            inject:false,
            title:'webpack is good',
            date:new Date(),
            minify:{//压缩
                removeComments:true,//删除注释
                collapseWhitespace:true//删除空格
            }
        })
    ]
```

## htmlWebpackPlugin插件生成多页面
```
plugins:[
        new htmlWebpackPlugin({
            filename:'a.html',
            template:'index.html',
            // inject:'head',
            inject:false,
            title:'a.html'
        }),
        new htmlWebpackPlugin({
            filename:'b.html',
            template:'index.html',
            // inject:'head',
            inject:false,
            title:'b.html'
        }),
        new htmlWebpackPlugin({
            filename:'c.html',
            template:'index.html',
            // inject:'head',
            inject:false,
            title:'c.html'
        })
    ]
```

# 如何通过一个模板生成多页面
## chunks注入的
### 全部注入
```
new htmlWebpackPlugin({
            filename:'c.html',
            template:'index.html',
            inject:'body',
            title:'c.html'
        })
```
### 注入b、main
```
new htmlWebpackPlugin({
            filename:'b.html',
            template:'index.html',
            inject:'body',
            title:'b.html',
            chunks:['b','main']
            })
```
### 注入a、main
```
new htmlWebpackPlugin({
            filename:'a.html',
            template:'index.html',
            inject:'body',
            title:'a.html',
            chunks:['a','main']
            })
```
## excludeChuncks排除这些注入其他
### 注入b c
```
new htmlWebpackPlugin({
            filename:'a.html',
            template:'index.html',
            inject:'body',
            title:'a.html',
            excludeChunks:['a','main']
            })
```

## 把页面性能达到极致（把初始化的脚本直接切入到页面，不以链接的形式引入页面）
```
//目前都是链接的形式，这样会增加页面的http请求
<script type="text/javascript" src="http://zhangyunyan.github.io/js/main.js"></script><script type="text/javascript" src="http://zhangyunyan.github.io/js/a.js"></script>
```
### htmlWebpackPlugin之前并没有考虑到这一点，后来有人在github上不断的提需求(compilation.assets其实是webpack打包生成的对象,通过传文件名的路径，就可以拿到文件的索引，通过.source就可以拿到文件的内容)