var pg = require('pg');
var strftime = require('strftime');
var database_url = 'postgres://';
exports.index = function (req, res){
  pg.connect(database_url, function(err, client, done) {
    var sql = "select id, title, subtitle, created_at from posts order by id desc";
    client.query(sql, function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.render("admin/index", {posts: result.rows});
      }
    });
  });
  
}

exports.login = function (req, res){
  res.render("admin/login");
}

exports.do_login = function(req, res, next){
  var username = req.body.username;
  var pwd = req.body.pwd;
  var test_username = '';
  var test_pwd = '';
  if(username == test_username && pwd == test_pwd){
    req.session.user = 1;
    res.redirect("/admin");
  }else{
    var json={title:'管理后台-- 请先登录', error: '帐号或者密码错误！'};
    res.render('admin/login', json);
  }
}

exports.init_db = function(req, res, next){
  pg.connect(database_url, function(err, client, done) {
    //var drop_table_sql = "drop table if exists test_table, posts; create table if not exists test_table(id int, name text); ";
    //var sql = 'CREATE TABLE if not exists posts(id serial NOT NULL,title character varying(255),subtitle character varying(255),body text,is_show boolean NOT NULL default true,sort_index int NOT NULL default 1,created_at timestamp without time zone NOT NULL,updated_at timestamp without time zone NOT NULL);';
    var sql = 'CREATE TABLE if not exists lines(id serial NOT NULL, title character varying(255),body text, line_at timestamp without time zone NOT NULL,created_at timestamp without time zone NOT NULL,updated_at timestamp without time zone NOT NULL);';
    client.query(sql, function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.send(result.rows);  
      }
    });
  });
}

exports.logout = function (req, res){
  req.session.user = null;
  res.redirect("/admin/login");
}

exports.add_post = function (req, res){
  res.render('admin/add');
}

exports.create_post = function (req, res){
  var title = req.body.title;
  var subtitle = req.body.subtitle;
  var body = req.body.post_body;
  pg.connect(database_url, function(err, client, done) {
    var sql = "insert into posts(title, subtitle, body, created_at, updated_at)values($1,$2,$3,$4,$5);"
    client.query(sql,[title, subtitle, body, new Date().toLocaleDateString(), new Date().toLocaleDateString()], function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.redirect('/admin/');
      }
    });
  });
}

exports.edit_post = function (req, res){
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
          var json={id: post.id, title: post.title, body: post.body, subtitle: post.subtitle};
          res.render('admin/post', json);
        }else{
          res.send("Error No Data"); 
        }
      }
    });
  });
}

exports.update_post = function (req, res){
  var id = req.params.id;
  var title = req.body.title;
  var subtitle = req.body.subtitle;
  var body = req.body.post_body;
  pg.connect(database_url, function(err, client, done) {
    var update_sql = "update posts set title = $1, subtitle = $2, body = $3 where id = $4;"
    client.query(update_sql, [title, subtitle, body, id] , function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.redirect('/admin/edit_post/' + id)
      }
    });
  });
}

exports.delete_post = function (req, res){
  var id = req.params.id;
  pg.connect(database_url, function(err, client, done) {
    var sql = "delete from posts where id = $1"
    client.query(sql,[id], function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.redirect('/admin/');
      }
    });
  });
}

exports.timeline = function (req, res){
  pg.connect(database_url, function(err, client, done) {
    var sql = "select id, title from lines order by line_at desc";
    client.query(sql, function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.render("admin/timeline", {lines: result.rows});
      }
    });
  });
}

exports.add_timeline = function (req, res){
  res.render('admin/add_timeline');
}

exports.create_timeline = function (req, res){
  var title = req.body.title;
  var body = req.body.line_body;
  var line_at = req.body.line_at;
  pg.connect(database_url, function(err, client, done) {
    var sql = "insert into lines(title, body, line_at, created_at, updated_at)values($1,$2,$3,$4,$5);"
    client.query(sql,[title, body, line_at, new Date().toLocaleDateString(), new Date().toLocaleDateString()], function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.redirect('/admin/timeline');
      }
    });
  });
}

exports.edit_timeline = function (req, res){
  var id = req.params.id;
  pg.connect(database_url, function(err, client, done) {
    var sql = "select * from lines where id = $1 limit 1"
    client.query(sql, [id] , function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        if(result.rows.length == 1){
          var line = result.rows[0];
          var json={id: line.id, title: line.title, body: line.body, line_at: strftime("%Y-%m-%d %H:%M:%S", line.line_at)};
          res.render('admin/edit_timeline', json);
        }else{
          res.send("Error No Data"); 
        }
      }
    });
  });
}

exports.update_timeline = function (req, res){
  var id = req.params.id;
  var title = req.body.title;
  var body = req.body.line_body;
  var line_at = req.body.line_at;
  pg.connect(database_url, function(err, client, done) {
    var update_sql = "update lines set title = $1, body = $2, line_at = $3 where id = $4;"
    client.query(update_sql, [title, body, line_at, id] , function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.redirect('/admin/edit_timeline/' + id)
      }
    });
  });
}

exports.delete_timeline = function (req, res){
  var id = req.params.id;
  pg.connect(database_url, function(err, client, done) {
    var sql = "delete from lines where id = $1"
    client.query(sql,[id], function(err, result){
      done();
      if (err){
        res.send("Error " + err); 
      }else{ 
        res.redirect('/admin/timeline');
      }
    });
  });
}


