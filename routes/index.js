var pg = require('pg');
var strftime = require('strftime');
var markdown = require( "markdown" ).markdown;
var database_url = 'postgres://';
exports.index = function (req, res){
  pg.connect(database_url, function(err, client, done) {
    var sql = "select * from posts order by id desc limit 5;"
    client.query(sql, function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.render("app/index", {posts: result.rows, strftime: strftime});
      }
    });
  });
}

exports.post = function (req, res){
  var id = req.params.id;
  pg.connect(database_url, function(err, client, done) {
    var sql = "select * from posts where id = $1 limit 1"
    client.query(sql, [id] , function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        if(result.rows.length == 1){
          var post = result.rows[0];
          var json={title: post.title, body: markdown.toHTML(post.body), subtitle: post.subtitle, created_at: strftime('%Y-%m-%d', post.created_at)};
          res.render('app/post', json);
        }else{
          res.send("Error No Data"); 
        }
      }
    });
  });
}

exports.about = function (req, res){
  res.render("app/about");
}

exports.contact = function (req, res){
  res.render("app/contact");
}

exports.test = function(req, res){
  res.render("app/test");
}

exports.list = function (req, res){
  pg.connect(database_url, function(err, client, done) {
    var sql = "select * from posts order by id desc;"
    client.query(sql, function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.render("app/index", {posts: result.rows, strftime: strftime});
      }
    });
  });
}

exports.timeline = function(req, res){
  pg.connect(database_url, function(err, client, done) {
    var sql = "select id, title, body, line_at from lines order by line_at desc";
    client.query(sql, function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.render("app/timeline", {lines: result.rows, strftime: strftime});
      }
    });
  });
}

