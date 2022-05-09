const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())
const path = require('path');
var engines = require('consolidate');
const fs = require('fs');
var http = require('http');
var formidable = require('formidable');
const multer = require('multer');
app.use('/image', express.static(__dirname + '/image'));

var  bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended:false});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  
});

app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);

app.get('/view',function(req,res)
{
    fs.readFile('formdata.json', (err, data) => {
        if (err) throw err;
        

        var realColors = data.filter(function (e) {return e != null;});

        let users = JSON.parse(realColors);
        
        res.render('view.html',{data : users});
    });
});

app.get('/edit/(:id)',function(req,res)
{
    fs.readFile('formdata.json', (err, data) => {
        if (err) throw err;
        let users = JSON.parse(data);
    
        const foundUser = Object.values(users).find(user => user.id == req.params.id);
        res.render('edit.html',{data : foundUser});
    });

});

let arr =[];

var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/xampp/htdocs/pro/image')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+".jpg")
    }
})
var upload = multer({ storage: Storage }).array('image', 12);

app.post('/create-form',function(req,res){

    
     upload(req, res , err => {
        
        let student = 
        {
            id :new Date().getUTCMilliseconds(),
            title: req.body.title,
            description: req.body.description, 
            image: req.files[0].filename,
            rating: req.body.rating,
        };

        arr.push(student);

        let data = JSON.stringify(arr);  

        fs.writeFileSync('formdata.json', data);

        return res.redirect('/view');
    });
  
  
});

app.post('/update-form',function(req,res){
    upload(req, res , err => {
    
    fs.readFile('formdata.json', (err, data) => {
        if (err) throw err;
        let jsonObj = JSON.parse(data);
            
                console.log(req.body);
                for (var i = 0; i < jsonObj.length; i++) 
                {
                    
                    if (jsonObj[i].id == req.body.id) 
                    {
                        jsonObj[i].title = req.body.title;
                        jsonObj[i].description = req.body.description;
                        jsonObj[i].image = req.files[0].filename;
                        jsonObj[i].rating = req.body.rating;
                        break;
                    }
                }
            
                let datas = JSON.stringify(jsonObj);  
                fs.writeFileSync('formdata.json', datas);

            });
    });
  
  
        return res.redirect('/view');
  });

  app.get('/delete-form/(:id)',urlencodedParser,function(req,res){
        cart = [];
        fs.readFile('formdata.json', function (err, data) {
            let jsonObj = JSON.parse(data);
            console
            for (var i = 0; i < jsonObj.length; i++) 
            {
                if(jsonObj[i] !=  null)
                {

                    if (jsonObj[i].id == req.params.id) 
                    {
                    
                        delete jsonObj[i];
                    
                    };
                }
            }

            let datas = JSON.stringify(jsonObj);  

            fs.writeFileSync('formdata.json', datas);

            return res.redirect('/view');
            
        });
    });



app.listen(3000);

console.log('Running at Port 3000');