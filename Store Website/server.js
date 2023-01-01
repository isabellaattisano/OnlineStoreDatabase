//creating a get messages service endpoint and node to get messages from our backend to our 
//front end website

var express = require('express')
var bodyParser = require('body-parser')
var app = express() //form an instance of express

var http = require('http').Server(app)

app.use(express.static(__dirname)) //serve some static content 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const oracledb = require('oracledb');
const { type } = require('os')
    try {
        oracledb.initOracleClient({libDir: '/Users/isabellaattisano/Downloads/instantclient_19_8'});
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
let connection; 


//You define routing using methods of the Express app object that correspond to HTTP methods; for 
// example, app.get() to handle GET requests and app.post to handle POST requests


app.post('/createaccount', (req, res)=>{
    const fname = req.body["fname"]
    const lname = req.body["lname"]
    const email = req.body["email"]
    const phone = req.body["phone"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        // conn.execute('delete from customer', [], {autoCommit:true});
        conn.execute(
                'INSERT into CUSTOMER VALUES(seqId.nextVal, :0, :1, :2, :3)', {
                    0: fname,
                    1: lname,
                    2: email,
                    3: phone }, {autoCommit:true})

        conn.execute("SELECT accountid FROM CUSTOMER where email=:0",{0:email}, function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });
         
     });


})

app.post('/login', (req, res)=>{
    const email = req.body["email"]
    console.log(email)

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        // conn.execute('delete from customer', [], {autoCommit:true});
        // conn.execute(
        //         'INSERT into CUSTOMER VALUES(seqId.nextVal, :0, :1, :2, :3)', {
        //             0: fname,
        //             1: lname,
        //             2: email,
        //             3: phone }, {autoCommit:true})

        conn.execute("SELECT accountid, lname, fname FROM CUSTOMER where email = :0",{0:email}, function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });
         
     });


})

app.post('/placeorder', (req, res)=>{
    const accountid = req.body["accountid"]
    console.log(accountid)
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute("update cart set cartid = :0 where cartid = :0",{0:accountid},  {autoCommit:true}, function(err){
            console.log(err);
        });

        // conn.execute("select * from cart",[], function(err, result){
        //     console.log(result.rows);
        // });

        conn.close(function (err) {
            
            if (err)
              console.error(err.message);
            else
                console.log("closed")
          });
         
     });


})

app.post('/getinvoiceproducts', (req, res)=>{
    const invoiceid = req.body["invoiceid"]
    console.log(invoiceid)
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        // conn.execute('delete from customer', [], {autoCommit:true});
        // conn.execute(
        //         'INSERT into CUSTOMER VALUES(seqId.nextVal, :0, :1, :2, :3)', {
        //             0: fname,
        //             1: lname,
        //             2: email,
        //             3: phone }, {autoCommit:true})

        conn.execute("SELECT i.invoiceid, p.pname, i.psize, i.pquanity, p.price * i.pquanity as total_price, i.productid from invoice_products i join product p on p.productid = i.productid where i.invoiceid = :0",{0:invoiceid}, function(err, result) {
            console.log(err);
            res.send(result.rows);
          });
         
     });


})


app.post('/postreview', (req, res)=>{
    const productid = req.body["productid"]
    const accountid = req.body["accountid"]
    const age = req.body["age"]
    const feet = req.body["feet"]
    const inches = req.body["inches"]
    const rating = req.body["rating"]
    const sizedesc = req.body["sizedesc"]
    const recommend = req.body["recommend"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        // conn.execute('delete from customer', [], {autoCommit:true});
        // conn.execute(
        //         'INSERT into CUSTOMER VALUES(seqId.nextVal, :0, :1, :2, :3)', {
        //             0: fname,
        //             1: lname,
        //             2: email,
        //             3: phone }, {autoCommit:true})
        conn.execute("INSERT into reviews Values(:0, :1, :2, :3, :4, :5, :6, :7)",{0:accountid, 1:productid, 2:age, 3:feet, 4:inches, 5:rating, 6:sizedesc, 7:recommend}, {autoCommit:true}, function(err, result) {
            console.log(err);
          });
         
     });


})

app.post('/getallproducts', (req, res)=>{
    var quantity = req.body["quantity"]
    var type = req.body["type"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        var statement = "select * from product"

        if(type != "type"){
            statement = statement + " where ptype = :0";
            if(quantity == "instock")
                statement = statement + " and pquantity > 0";
            else if(quantity == "outstock")
                statement = statement + " and pquantity = 0";
            
                conn.execute(statement,{0:type}, function(err, result) {
                    console.log(err);
                    res.send(result.rows);
                  });
        }
        else{
            if(quantity == "instock")
                statement = statement + " where pquantity > 0";
            else if(quantity == "outstock")
                statement = statement + " where pquantity = 0";
            
                conn.execute(statement, function(err, result) {
                    console.log(err);
                    res.send(result.rows);
                  });
        }

    
         
     });


})

app.post('/vieworderhistory', (req, res)=>{
    const accountid = req.body["accountid"]
    console.log(accountid)
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 


        conn.execute("SELECT invoiceid, totalprice from invoice where accountid = :0",{0:accountid}, function(err, result) {
            console.log(result.rows);
            res.send(result.rows);
          });
         
     });


})

app.post('/restockproduct', (req, res)=>{
    var productid = req.body["productid"]
    var quantity = req.body["quantity"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 


        conn.execute("Update product set pquantity = pquantity + :0 where productid = :1",{0:quantity, 1:productid}, {autoCommit:true}, function(err, result) {
            console.log(result.rows);
            res.send(result.rows);
          });
         
     });


})

app.post('/getcustomer', (req, res)=>{
    const accountid = req.body["accountid"]
    console.log(accountid)

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 


        conn.execute("SELECT accountid, lname, fname FROM CUSTOMER where accountid = :0",{0:accountid}, function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

     });


})

app.post('/getinvoice', (req, res)=>{

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 


        conn.execute("SELECT i.invoiceid, i.totalprice, c.fname || ' ' ||c.lname from invoice i join customer c on c.accountid= i.accountid where i.accountid>0",[], function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

     });

    })

    app.post('/getinvoicedeleted', (req, res)=>{

        oracledb.getConnection({
            user: "iattisan",
            password: "fL02257240",
            connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
        }, function(err, conn) { 
    
    
            conn.execute("SELECT invoiceid, fname || ' ' ||lname from invoice_record_deleted_account",[], function(err, result) {
                    console.log(result.rows);
                    res.send(result.rows);
                  });
    
         });
    
        })

app.post('/getallcustomers', (req, res)=>{
  
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 


        conn.execute("SELECT accountid, fname || ' ' || lname as Name, email FROM CUSTOMER",[], function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

     });


})

app.post('/getreviews', (req, res)=>{
    productid = req.body["productid"]
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 


        conn.execute("SELECT * FROM reviews where productid = :0",{0:productid}, function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

     });


})

app.post('/getpayment', (req, res)=>{
    const accountid = req.body["accountid"]
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute("select expMonth ||'/'|| expYear AS Expiration_Date, '************'||''||SUBSTR(cardnumber, 12, 4) AS Card_Number from payment where accountid = :0",{0:accountid}, function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });
         
     });
})

app.post('/getaddress', (req, res)=>{
    const accountid = req.body["accountid"]
    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute("select street,  city, state, zip from address where accountid = :0",{0:accountid}, function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });
         
     });
})

app.post('/addpayment', (req, res)=>{
    const cardnum = req.body["cardnum"]
    const code = req.body["code"]
    const expmonth = req.body["expmonth"]
    const expyear = req.body["expyear"]
    const accountid = req.body["accountid"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute("INSERT INTO PAYMENT VALUES(:0, :1, :2, :3, :4)",{0:accountid, 1:expmonth, 2:expyear, 3:cardnum, 4:code}, {autoCommit:true});

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });
         
     });
})

app.post('/addaddress', (req, res)=>{
    const street = req.body["street"]
    const city = req.body["city"]
    const state = req.body["state"]
    const zip = req.body["zip"]
    const accountid = req.body["accountid"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute("INSERT INTO ADDRESS VALUES(:0, :1, :2, :3, :4)",{0:accountid, 1:street, 2:city, 3:state, 4:zip}, {autoCommit:true});

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });
         
     });
})

app.post('/deletepayment', (req, res)=>{

    cardnum = req.body["cardnum"]
    accountid = req.body["accountid"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('delete from payment where accountid = :0 AND cardnumber=:1',{0:accountid, 1:cardnum}, {autoCommit:true},(err)=>{
            console.log(err);
        });

            //   conn.close(function (err) {
            
            //     if (err)
            //       console.error(err.message);
            //     else
            //         console.log("closed")
            //   });
         
     });
})

app.post('/deleteaddress', (req, res)=>{

    street = req.body["street"]
    accountid = req.body["accountid"]

    console.log(street.length);

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('delete from address where accountid = :0 AND Street = :1',{0:accountid, 1:street}, {autoCommit:true},(err)=>{
            console.log(err);
            console.log("deleting");
        });

            //   conn.close(function (err) {
            
            //     if (err)
            //       console.error(err.message);
            //     else
            //         console.log("closed")
            //   });
         
     });
})

app.post('/deletefromcart', (req, res)=>{

    productid = req.body["productid"]
    cartid = req.body["cartid"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('delete from cart_items where cartid = :0 AND productid = :1',{0:cartid, 1:productid}, {autoCommit:true},(err)=>{
            console.log(err);
            console.log("deleting");
        });

            //   conn.close(function (err) {
            
            //     if (err)
            //       console.error(err.message);
            //     else
            //         console.log("closed")
            //   });
         
     });
})

app.post('/addtocart', (req, res)=>{

    productid = parseInt(req.body["productid"])
    accountid = parseInt(req.body["accountid"])
    quantity = parseInt(req.body["quantity"])
    price =  req.body["price"]
    size = req.body["size"]

    console.log(size)

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('insert into cart_items values(:0, :1, :2, :3, :4)',{0:accountid, 1:productid, 2:size, 3:quantity, 4:price}, {autoCommit:true},(err)=>{
            console.log(err);
            console.log("inserting");
        });

            //   conn.close(function (err) {
            
            //     if (err)
            //       console.error(err.message);
            //     else
            //         console.log("closed")
            //   });
         
     });
})

app.post('/updatecartitem', (req, res)=>{

    productid = parseInt(req.body["productid"])
    accountid = parseInt(req.body["accountid"])
    quantity = parseInt(req.body["quantity"])
    size = req.body["size"]

    console.log(size, quantity, accountid, productid)


    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('update cart_items set psize = :0, pquantity = :1 where cartid=:2 and productid=:3 ',{2:accountid, 3:productid, 0:size, 1:quantity}, {autoCommit:true},(err)=>{
            console.log(err);
            console.log("inserting");
        });

            //   conn.close(function (err) {
            
            //     if (err)
            //       console.error(err.message);
            //     else
            //         console.log("closed")
            //   });
         
     });
})

app.post('/getclothing', (req, res)=>{
    var order = req.body["order"]
   var pricelimit = req.body["pricelimit"]
   var typee = req.body["type"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

    var statement = '';

    if (order=="high"){
        statement = 'order by price desc';
    }
    else if(order == "low")
        statement = 'order by price asc';


    if(typee != "type"){
        if(pricelimit != "pricelimit"){
            statement = 'select * from product where pquantity > 0 and ptype = :0 and price<=:1' + statement;
            conn.execute(statement,{0:typee, 1:pricelimit}, {autoCommit:true},function(err, result) {
                res.send(result.rows);
              });
        }
        else{
            conn.execute('select * from product where pquantity > 0 and ptype = :6' +statement,{6:typee}, {autoCommit:true},function(err, result) {
                res.send(result.rows);
              });
        }
    }

    else{
        if(pricelimit != "pricelimit"){
            statement = 'select * from product where pquantity > 0 and ptype not in (:0, :1, :2, :3, :4) and price<=:5' + statement;
            conn.execute(statement,{0:"candles", 1:"phone cases", 2:"board games", 3:"mugs", 4:"posters", 5:pricelimit}, {autoCommit:true},function(err, result) {
                res.send(result.rows);
              });
        }
        else{
            conn.execute('select * from product where pquantity > 0 and ptype not in (:0, :1, :2, :3, :4)' +statement,{0:"candles", 1:"phone cases", 2:"board games", 3:"mugs", 4:"posters"}, {autoCommit:true},function(err, result) {
                res.send(result.rows);
              });
        }

    }

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });

            });
         
})

app.post('/gethomegoods', (req, res)=>{
    order = req.body["order"]
    pricelimit = req.body["pricelimit"]
    typee = req.body["type"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

    var statement = '';

    if (order=="high"){
        statement = 'order by price desc';
    }
    else if(order == "low")
        statement = 'order by price asc';


    if(typee != "type"){
        if(pricelimit != "pricelimit"){
            statement = 'select * from product where pquantity > 0 and ptype = :0 and price<=:1' + statement;
            conn.execute(statement,{0: typee, 1:pricelimit}, {autoCommit:true},function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });
        }
        else{
            conn.execute('select * from product where pquantity > 0 and ptype = :6' +statement,{6:typee}, {autoCommit:true},function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });
        }
    }

    else{
        if(pricelimit != "pricelimit"){
            statement = 'select * from product where pquantity > 0 and ptype in (:0, :1, :2, :3, :4) and price<=:5' + statement;
            conn.execute(statement,{0:"candles", 1:"phone cases", 2:"board games", 3:"mugs", 4:"posters", 5:pricelimit}, {autoCommit:true},function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });
        }
        else{
            conn.execute('select * from product where pquantity > 0 and ptype in (:0, :1, :2, :3, :4)' +statement,{0:"candles", 1:"phone cases", 2:"board games", 3:"mugs", 4:"posters"}, {autoCommit:true},function(err, result) {
                console.log(result.rows);
                res.send(result.rows);
              });
        }

    }

              conn.close(function (err) {
            
                if (err)
                  console.error(err.message);
                else
                    console.log("closed")
              });

            });
         
})

app.post('/getcart', (req, res)=>{
    accountid = req.body["accountid"]
    var response;

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('select p.productid, p.pname, c.psize, c.pquantity, p.price * c.pquantity as total_price from cart_items c JOIN product p on c.productid = p.productid where cartid = :0',{0:accountid}, {autoCommit:true},function(err, result) {
            console.log(result.rows);
            res.send(result.rows);
          });


            //   conn.close(function (err) {
            
            //     if (err)
            //       console.error(err.message);
            //     else
            //         console.log("closed")
            //   });
         
     });
})

app.post('/deletefavorite', (req, res)=>{
    accountid = req.body["accountid"]
    productid = req.body["productid"]
    var response;

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('delete from favorites where accountid = :0 and productid = :1',{0:accountid, 1:productid}, {autoCommit:true},function(err, result) {
            console.log(result.rows);
            res.send(result.rows);
          });

     });
})

app.post('/addfavorite', (req, res)=>{
    accountid = req.body["accountid"]
    productid = req.body["productid"]
    var response;

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('insert into favorites values(:0, :1)',{0:accountid, 1:productid}, {autoCommit:true},function(err, result) {
            console.log(result.rows);
            res.send(result.rows);
          });

     });
})

app.post('/getfavorites', (req, res)=>{
    accountid = req.body["accountid"]

    oracledb.getConnection({
        user: "iattisan",
        password: "fL02257240",
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
    }, function(err, conn) { 

        conn.execute('select f.productid, p.pname, p.price, p.ptype from favorites f JOIN product p on f.productid = p.productid where f.accountid = :0',{0:accountid}, {autoCommit:true},function(err, result) {
            console.log(result.rows);
            res.send(result.rows);
          });

     });
})



var server = http.listen(3000, ()=>{
    console.log("server is listening on port", server.address().port)
}) //the express server started and listening for requests localhost:3000 on port 3000

