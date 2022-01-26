module.exports = {
    /* lintOnSave:true, */
	devServer:{
        proxy: {
                '/posts': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            }
   	    }
    }
}