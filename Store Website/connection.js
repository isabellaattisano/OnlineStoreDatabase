const oracledb = require('oracledb');
    try {
        oracledb.initOracleClient({libDir: '/Users/isabellaattisano/Downloads/instantclient_19_8'});
    } catch (err) {
        console.error(err);
        process.exit(1);
    }



   function createaccount(){
     const message = document.getElementById("fname");
     console.log("name" + message.value);

     oracledb.getConnection({
            user: "iattisan",
            password: "fL02257240",
            connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=csdb2.csc.villanova.edu)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SID=orcl)))"
        }, function(err, conn) {
            console.log(conn);
              
        //    conn.execute("SELECT lname FROM employee",[], function(err, result) {
        //     console.log(result.metaData);
        //     console.log(result.rows);
        //   });
            
     });

    }
      
            
    