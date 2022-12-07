let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

//homepage route
// call back funtion can get request and response
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful CRUD API with NodeJS, Express, MYSQL',
        written_by: 'IIEC',
        published_on: 'https://devivery.dev'
    })
})

// connection to mysql database
let dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database',
    port : '3306'
})
dbcon.connect();

app.get('/users', (req, res) => {

    dbcon.query('SELECT * FROM user', (error, results, fields) => {
        if (error) {
            return res.status(400).send({ error: true, data: results, message: "Database not available!" });
        };

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Users table is empty";
        } else {
            message = "Successfully retrieved all users";
        }

        return res.send({ error: false, data: results, message: message });
    })
})
app.get('/items', (req, res) => {

    dbcon.query('SELECT Item_id, Item_name, Item_price, Item_stock, Item_des, Category_id   FROM item', (error, results, fields) => {
        if (error) {
            return res.status(400).send({ error: true, data: results, message: "Database not available!" });
        };

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Users table is empty";
        } else {
            message = "Successfully retrieved all item";
        }


        return res.send({ error: false, data_length: results.length, data: results, message: message });
    })
})

app.get('/items/:a/:b', (req, res) => {
    let a = req.params.a;
    let b = req.params.b;
    console.log(a, b)
    if (!a || !b) {
        dbcon.query('SELECT Item_id, Item_name, Item_price, Item_stock, Item_des, Category_id  FROM item', (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = ""
            if (results === undefined || results.length == 0) {
                message = "Users table is empty";
            } else {
                message = "Successfully retrieved all item";
            }


            return res.send({ error: false, data_length: results.length, data: results, message: message });
        })

    } else {
        dbcon.query('SELECT Item_id, Item_name, Item_price, Item_stock, Item_des, Category_id  FROM item  LIMIT ' + a + ',' + b, (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = ""
            if (results === undefined || results.length == 0) {
                message = "Users table is empty";
            } else {
                message = "Successfully retrieved all item";
            }


            return res.send({ error: false, data_length: results.length, data: results, message: message });
        })
    }
})



app.get('/locations', (req, res) => {

    dbcon.query('SELECT * FROM location', (error, results, fields) => {
        if (error) {
            return res.status(400).send({ error: true, data: results, message: "Database not available!" });
        };

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "locations table is empty";
        } else {
            message = "Successfully retrieved all locations";
        }

        return res.send({ error: false, data: results, message: message });
    })
})

app.get('/user/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide user id" });
    } else {
        dbcon.query("SELECT * FROM user WHERE User_id = ?", id, (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            if (results === undefined || results.length == 0) {
                message = "User not found";
                data = {};
            } else {
                message = "Successfully retrieved user data";
                data = results[0];
            }


            return res.send({ error: false, data: data, message: message })
        })
    }
})

app.get('/orders', (req, res) => {

    dbcon.query("SELECT * FROM pageorder WHERE PageOrder_status = 'unsuccess' ORDER BY PageOrder_id ASC", (error, results, fields) => {
        if (error) {
            return res.status(400).send({ error: true, data: results, message: "Database not available!" });
        };

        let message = "";
        let data = "";
        if (results === undefined || results.length == 0) {
            message = "Order not found";
            data = {};
        } else {
            message = "Successfully retrieved order data";
            data = results;
        }


        return res.send({ error: false, data: data, message: message })
    })

})

app.get('/order/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide order id" });
    } else {
        dbcon.query("SELECT * FROM pageorder WHERE User_id = ? AND PageOrder_status !='success'", id, (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            if (results === undefined || results.length == 0) {
                message = "Order not found";
                data = {};
            } else {
                message = "Successfully retrieved order data";
                data = results[0];
            }
          

            return res.send({ error: false, data: data, message: message })
        })
    }
})

app.get('/robots', (req, res) => {

        dbcon.query("SELECT robot.* FROM robot LEFT JOIN task ON task.Robot_id != robot.Robot_id WHERE task.Task_status = 'unsuccess'", (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            if (results === undefined || results.length == 0) {
                message = "Robot not found";
                data = {};
            } else {
                message = "Successfully retrieved robot data";
                for(i = 0; i<results.length;i++ ){
                    results[i].Robot_status = "available";
                }
                data = results;
            }
          

            return res.send({ error: false, data: data, message: message })
        })
    
})




app.get('/task/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide user id" });
    } else {
        dbcon.query("SELECT * FROM task LEFT JOIN robot_data ON task.Robot_id = robot_data.Robot_id WHERE task.Task_status = 'unsuccess'", (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            let user_id = [];
            let order_id = []
            let status = [];
            let start = []
            let end = []
            let index = 0;
            let box = 0;
            if (results === undefined || results.length == 0) {
                message = "Task not found";
                data = {};
            } else {


                message = "Successfully retrieved task data";
                //data = results[0];
                for (i = 0; i < results.length; i++) {
                    let order_id_for = results[i].PageOrder_id
                        .trim()
                        .substr(1, results[i].PageOrder_id.length - 2)
                        .split(',')
                        .map(e => e.trim());
                    let order_User_id_for = results[i].PageOrderUser_id
                        .trim()
                        .substr(1, results[i].PageOrderUser_id.length - 2)
                        .split(',')
                        .map(e => e.trim());

                    let task_order_status_for = results[i].Task_PageOrder_status
                        .trim()
                        .substr(1, results[i].Task_PageOrder_status.length - 2)
                        .split(',')
                        .map(e => e.trim());
                    let order_start_for = results[i].Stamp_start
                        .trim()
                        .substr(1, results[i].Stamp_start.length - 2)
                        .split(',')
                        .map(e => e.trim());
                    let order_end_for = results[i].Stamp_end
                        .trim()
                        .substr(1, results[i].Stamp_end.length - 2)
                        .split(',')
                        .map(e => e.trim());


                    for (j = 0; j < order_id_for.length; j++) {
                        if (id == order_User_id_for[j]) {
                            user_id=(order_User_id_for[j]);
                            order_id=(order_id_for[j]);
                            status=(task_order_status_for[j]);

                            start=(order_start_for[j]);
                            end=(order_end_for[j]);
                            index = i;
                            box = j;
                        }




                    }

                   


                }



            }

            data={"user_id": parseInt(user_id),"box":box+1,"order_id":parseInt(order_id),"status":status,"start":start,"end":end,"robot":{"robot_id":results[index].Robot_id,"data":{"data_id":results[index].Robot_data_id,"latitude":results[index].Robot_latitude,"longitude":results[index].Robot_longitude}}} ;
            return res.send({ error: false, data: data, message: message })
        })
    }
})

app.get('/basket/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide basket id" });
    } else {
        dbcon.query("SELECT * FROM basket WHERE User_id = ? AND Basket_status= 'unsuccess'", id, (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";

            if (results === undefined || results.length == 0) {
                message = "Basket not found";
                data = {};
            } else {
                message = "Successfully retrieved basket data";
                data = results[0];
                let Item_id = data.Item_id
                    .trim()
                    .substr(1, data.Item_id.length - 2)
                    .split(',')
                    .map(e => e.trim())
                let Item_unit = data.Item_unit
                    .trim()
                    .substr(1, data.Item_unit.length - 2)
                    .split(',')
                    .map(e => e.trim())
                data.Items = [];
                request("http://127.0.0.1:8083/items", { json: true, "rejectUnauthorized": false }, (function (error, response, body) {
                    Item_name = body;
                }));
                for (i = 0; i < Item_id.length; i++) {

                    let Item_n = "None"

                    try {
                        Item_n = Item_name.data.filter((item) => {
                            return item.Item_id == Item_id[i];
                        });
                        data.Items.push({ item_id: parseInt(Item_id[i]), item_name: Item_n[0].Item_name, item_qty: parseInt(Item_unit[i]), item_price: parseInt(Item_n[0].Item_price) });
                    } catch {
                        data.Items.push({ item_id: parseInt(Item_id[i]), item_name: "None", item_qty: parseInt(Item_unit[i]), item_price: 0 });
                    }







                }






            }


            return res.send({ error: false, data: data, message: message })
        })
    }
})


app.get('/item/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide item id" });
    } else {
        dbcon.query("SELECT Item_id, Item_name, Item_price, Item_stock, Item_des, Category_id FROM item WHERE Item_id = ?", id, (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            if (results === undefined || results.length == 0) {
                message = "Item not found";
                data = {};
            } else {
                message = "Successfully retrieved item data";
                data = results[0];
            }


            return res.send({ error: false, data: data, message: message })
        })
    }
})

app.get('/login', (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;

    if (!phone || !password) {
        return res.status(400).send({ error: true, message: "Please provide login phone and password" });
    } else {
        dbcon.query("SELECT * FROM user WHERE User_phone_num = ? AND User_password = ?", [phone, password], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";

            if (results === undefined || results.length == 0) {
                message = "Login not found";
                data = [];
            } else {
                message = "Successfully retrieved login data";
                data = results[0];

            }

            return res.send({ error: false, data: data, message: message })
        })
    }
});


app.get('/loginUser', (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;

    if (!phone || !password) {
        return res.status(400).send({ error: true, message: "Please provide login phone and password" });
    } else {
        dbcon.query("SELECT * FROM user WHERE User_phone_num = ? AND User_password = ? AND User_status= 'User'", [phone, password], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            if (results === undefined || results.length == 0) {
                message = "Login not found";
                data = [];
            } else {
                message = "Successfully retrieved login data";
                data = results[0];
            }

            return res.send({ error: false, data: data, message: message })
        })
    }
});

app.get('/loginAdmin', (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;

    if (!phone || !password) {
        return res.status(400).send({ error: true, message: "Please provide login phone and password" });
    } else {
        dbcon.query("SELECT * FROM user WHERE User_phone_num = ? AND User_password = ? AND User_status= 'Admin'", [phone, password], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            let data = "";
            if (results === undefined || results.length == 0) {
                message = "Login not found";
                data = [];
            } else {
                message = "Successfully retrieved login data";
                data = results[0];
            }

            return res.send({ error: false, data: data, message: message })
        })
    }
});

app.post('/user', (req, res) => {
    let phone = req.body.phone;
    let password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;



    if (!phone || !password || !fname || !lname) {
        return res.status(400).send({ error: true, message: "Please provide user phone, password, fname and lname." });
    } else {
        dbcon.query('INSERT INTO user (User_phone_num, User_password, User_fname, User_lname, User_status) VALUES(?, ?, ?, ?, ?)', [phone, password, fname, lname, "User"], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };

            return res.send({ error: false, data: results, message: "User successfully added" })
        })
    }
});

app.post('/basket', (req, res) => {
    let id = req.body.id;
    let item_id = [];
    let item_unit = [];

    for (i = 0; i < req.body.items.length; i++) {
        item_id.push(req.body.items[i].item_id);
        item_unit.push(req.body.items[i].item_qty);
    }





    if (!id || item_id.length == 0 || item_unit.length == 0) {
        return res.status(400).send({ error: true, message: "Please provide basket id, item_id and item_unit." });
    } else {

        dbcon.query('INSERT INTO basket (User_id, Item_id, Item_unit, Basket_status) VALUES(?, ?, ?, ?)', [id, '[' + item_id.toString() + ']', '[' + item_unit.toString() + ']', "unsuccess"], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };
            return res.send({ error: false, data: results, message: "Basket successfully added" })
        })
    }
});


app.post('/task', (req, res) => {
    let id = req.body.id;
    let Robot_id = req.body.robot_id;
    let order_id = [];
    let user_id = [];
    let order_status = [];

    for (i = 0; i < req.body.order_ids.length; i++) {
        order_id.push(req.body.order_ids[i]);
        user_id.push(req.body.user_ids[i]);
        order_status.push("confirm");
    }





    if (!id || !Robot_id || order_id.length == 0 || order_status.length == 0 || user_id.length == 0) {
        return res.status(400).send({ error: true, message: "Please provide task order_id, robot_id, user_id and order_status." });
    } else {

        dbcon.query('INSERT INTO task (User_id, PageOrder_count, PageOrder_id, Task_PageOrder_status, Stamp_start, Stamp_end, Robot_id, PageOrderUser_id,Task_status) VALUES(?, ?, ?, ?, ?, ?, ?, ?,"unsuccess")', [id, order_id.length, '[' + order_id.toString() + ']', '[' + order_status.toString() + ']', "[0,0]", "[0,0]", Robot_id,'[' + user_id.toString() + ']'], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };
            return res.send({ error: false, data: results, message: "task successfully added" })
        })
    }
});

app.post('/order', (req, res) => {
    let id = req.body.id;
    let basket_id = req.body.basket_id;
    let location_id = req.body.location_id;
    let payment_id = req.body.payment_id;



    if (!id || !basket_id || !location_id || !payment_id) {
        return res.status(400).send({ error: true, message: "Please provide basket id, item_id and item_unit." });
    } else {
        dbcon.query('INSERT INTO pageorder (Basket_id, Location_id, Payment_id, User_id, PageOrder_status) VALUES(?, ?, ?, ?, ?)', [basket_id, location_id, payment_id, id, "unsuccess"], (error, results, fields) => {
            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };
            return res.send({ error: false, data: results, message: "Order successfully added" })
        })
    }
});

app.put('/user', (req, res) => {
    let id = req.body.id;
    let phone = req.body.phone;
    let password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;

    // validation
    if (!id || !phone || !password || !fname || !lname) {
        return res.status(400).send({ error: true, message: 'Please provide user id, phone, password, fname and lname.' });
    } else {
        dbcon.query('UPDATE user SET User_phone_num = ?, User_password = ?, User_fname = ?, User_lname = ? WHERE User_id = ?', [phone, password, fname, lname, id], (error, results, fields) => {
            if (error) {
                return res.send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            if (results.changedRows === 0) {
                message = "User not found or data are same";
            } else {
                message = "User successfully updated";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})


app.put('/order', (req, res) => {
    let id = req.body.id;
    let status = req.body.status;
    // validation
    if (!id || !status) {
        return res.status(400).send({ error: true, message: 'Please provide order id, status.' });
    } else {
        dbcon.query('UPDATE pageorder SET PageOrder_status = ? WHERE PageOrder_id  = ?', [status, id], (error, results, fields) => {
            if (error) {
                return res.send({ error: true, data: results, message: "Database not available!" });
            };

            let message = "";
            if (results.changedRows === 0) {
                message = "User not found or data are same";
            } else {
                message = "User successfully updated";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})




app.put('/basket', (req, res) => {
    let id = req.body.id;
    let item_id = [];
    let item_unit = [];

    for (i = 0; i < req.body.items.length; i++) {
        item_id.push(req.body.items[i].item_id);
        item_unit.push(req.body.items[i].item_qty);
    }




    if (!id || !item_id || !item_unit) {
        return res.status(400).send({ error: true, message: "Please provide basket id, item_id and item_unit." });
    } else {
        dbcon.query('UPDATE basket SET Item_id = ?, Item_unit = ? WHERE User_id = ? and Basket_status = "unsuccess"', ['[' + item_id.toString() + ']', '[' + item_unit.toString() + ']', id], (error, results, fields) => {


            if (error) {
                return res.status(400).send({ error: true, data: results, message: "Database not available!" });
            };
            return res.send({ error: false, data: results, message: "Basket successfully updated" })
        })
    }
});




// port check api
app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;