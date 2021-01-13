module.exports= function () {
    var client = './src/';
    var clientApp = client+'app/';
    var root = './';
    var temp = './.tmp/';
    var config = {
        build: './.build/',
        // temporary folder
        temp: temp,
        
        // all js to vet
        allJs:[
            client + 'app/**/*.js'
        ],
        client: client,
        css: temp + 'styles.css',
        fonts: client + 'fonts/**/*.*',
        htmlTemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        js:[
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
        ],
        root: root,
        // styles folder
        styles: [
            client + 'styles/**/*.css'
        ],
        // templateCache
        
        templateCache: {
          file: 'templates.js',
          options: {
            module: 'app',
            standAlone: false,
            root: 'app/'                
          },  
            
        },
        
        
        // Bower and NPM locations
       bower:{
           json: require('./bower.json'),
           directory: './bower_components',
           ignorePath: '../..'
       },
       packages: [
           './package.json',
           './bower.json'
       ]         
    };
    
    config.getWiredepDefaultOptions = function() {
        var options={
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };
    
    return config;    
};