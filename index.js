var express = require('express');
var session = require('express-session')
var app = express();
var admin = express();
var routes = require('./routes');
var admin_app = require('./routes/admin');
var filter = require('./lib/filter');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var sm = require('sitemap');

app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true
}));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/post', routes.post);
app.get('/contact', routes.contact);
app.get('/post/:id', routes.post);
app.get('/list', routes.list);
app.get('/test', routes.test);
app.get('/timeline', routes.timeline);

admin.get('/', filter.authorize, admin_app.index);
admin.get('/login', admin_app.login);
admin.post('/do_login', admin_app.do_login);
admin.get('/logout', admin_app.logout);
admin.get('/add_post',filter.authorize,  admin_app.add_post);
admin.post('/create_post',filter.authorize,  admin_app.create_post);
admin.get('/edit_post/:id',filter.authorize,  admin_app.edit_post);
admin.post('/update_post/:id',filter.authorize,  admin_app.update_post);
admin.get('/delete_post/:id',filter.authorize,  admin_app.delete_post);
admin.get('/timeline',filter.authorize,  admin_app.timeline);
admin.get('/add_timeline',filter.authorize,  admin_app.add_timeline);
admin.post('/create_timeline',filter.authorize,  admin_app.create_timeline);
admin.get('/edit_timeline/:id',filter.authorize,  admin_app.edit_timeline);
admin.post('/update_timeline/:id',filter.authorize,  admin_app.update_timeline);
admin.get('/delete_timeline/:id',filter.authorize,  admin_app.delete_timeline);
admin.get('/init_db',filter.authorize,  admin_app.init_db);

app.use('/admin', admin); // mount the sub app

var sitemap = sm.createSitemap ({
      hostname: 'http://www.taocss.com',
      cacheTime: 600000
    });
sitemap.add({url: '/about/', changefreq: 'monthly'});
sitemap.add({url: '/contact/', changefreq: 'monthly'});
sitemap.add({url: '/list/', changefreq: 'daily', priority: 0.7});
app.get('/sitemap.xml', function(req, res) {
  sitemap.toXML( function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});




