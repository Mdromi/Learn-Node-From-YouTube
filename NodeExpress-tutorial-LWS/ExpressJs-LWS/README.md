# [ExpressJs-LWS](https://www.youtube.com/playlist?list=PLHiZ4m8vCp9PHnOIT7gd30PCBoYCpGoQM)

This Series Talking about fundamental of express js, File Upload multer, MongoDB, Mongoose and authentication with json token

### <a id="table-of-contents">Table Of Contents</a>
- <a href="#1"> Express </a>
- <a href="#2"> Request </a>
- <a href="#3"> Response </a>
- <a href="#4"> Middleware </a>
- <a href="#5"> Error Handling </a>
- <a href="#6"> File Upload </a> 
- <a href="#7"> MongoDB </a>
- <a href="#8"> Mongoose </a>


<h3 id="1"> Express </h3>

__Introduction Express__ 
- Better Developer Experience
- Better Code Readability
- Better Application Management
- Great Documentation and High Performance

__Express Syllabus__ 
- express()
- Application
- Request
- Response
- Router

<a href="#table-of-contents">[↑] Back to top</a>

<h3 id="2"> Request </h3>

__Request Object__ 
| M/P | M/P |   
| --- | --- |
| req.baseurl    | req.body |
| req.originalUrl| req.cookies |
| req.path       | req.signedCokkies |
| req.hostname   | req.secure |
| req.ip         | req.route |
| req.method     | req.app |
| req.protocol   | req.accepts() |
| req.params     | req.get() |
| req.query      | req.fresh |

<a href="#table-of-contents">[↑] Back to top</a>

<h3 id="3"> Response </h3>

__Response Object__ 
| M/P | Details |   
| --- | --- |
| Res | Represent the HTTP Response |
| res.app           | Reference to the app instance |
| res.headersSent   | Boolean if the app sent HTTP headers for the response |
| res.locals        | Local variable scoped to the repose |
| res.cookie()      | Sets Cookie name to value |
| res.clearCookie() | Clears Cookie by name |
| res.end()         | Ends the response process |
| res.send()        | Sends the HTTP response |
| res.json()        | Send JSON response  |
| res.status()      | Sets the HTTP status for the response |
| res.sendStatus()  | Sets the response HTTP status code |
| res.render()      | Render a view |
| res.format()      | Performs content-negotiation on the Accept HTTP header on Request object |
| res.location()    | Sets the Response Location HTTP header |
| res.redirect()    | Redirect to the URL derived from the specified path |
| res.get()         | Returns the HTTP Response headers |
| res.set()         | Sets Response HTTP header to a value |

<h3 id="4"> Middleware </h3>

<p>Middleware is a function that have to req res object and next function</p>

| Middleware Can | Middleware Types |   
| --- | --- |
| Executes any code              | Application level middleware |
| Can change req and res object | Router level middleware |
| Can end request/response Cycle | Error-handling middleware |
| Call next middleware by next() | Built-in middleware |
| Throw & catch errors           | Third-party middleware |

__Request - Response Cycle:__ 

```mermaid
graph TD;
    A[HTTP] -- client ----> B[App];
    B -- request --> C{M1 is errors?};
    C -- Yes --> A;
    C -- No -- next --> D[M2];
    D -- next & response --> A;
```

<a href="#table-of-contents">[↑] Back to top</a>

<h3 id="5"> Error Handling </h3>

- 404 Errors Handler
```js
app.use((req, res, next) => {
    next('Requested url was not found')
})
```

- Server Errors Handler
```js
app.use((err, req, res, next) => {
    if (res.headersSent) {
        next('There was an problem')
    } else {
        if(err.message) {
            res.status(500).send(err.message)
        } else {
            res.send('There was an error')
        }
    }
});
```

- Error Handling For Asynchronous Code

```js
app.get('/', (req, res, next) => {
    setTimeout(() => {
        try {
           console.log(a)
        } catch (err) {
            next(err)
        }
    }, 2000)
});
```

<a href="#table-of-contents">[↑] Back to top</a>


<h3 id="6"> File Upload </h3>

- Middleware
```js
const multer  = require('multer');
const path = require('path');

// file upload folder
const UPLOAD_FOLDERS = 'public/uploads';

// define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDERS)
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
});

// prepare the final multer upload object
const upload = multer({
    storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        const types = /jpeg|jpg|png|gif/
        const extName = types.test(path.extname(file.originalname).toLowerCase())
        const mineType = types.test(file.mimetype)

        if(extName && mineType) {
            cb(null, true)
        } else {
            cb(new Error('Only Support Images'))
        }
    }
});

module.exports = upload;
```

- Controllers
```js
exports.uploadController = (req, res, next) => {
    if(req.file) {
        console.log(req.file);
        res.send('File uploaded')
    } else {
        throw new Error(`File Required`);
    }
}
```

- `app.js`
```js
const filePath = path.resolve(__dirname, 'public/index.html');

// File upload route
app.get("/file-upload", (req, res) => {
    res.sendFile(filePath);
})

app.post("/file-upload", upload.single('up-file'), uploadController)
```

<a href="#table-of-contents">[↑] Back to top</a>

<h3 id="7">MongoDB</h3>

__Start MongoDB Commands__
| Command | Detail |   
| ------- | ----- |
| `mongodb-compass` | Start MongoDB Compass |
| `sudo service mongod start` |  Start MongoDB|
| `sudo service mongod status` | Verify that MongoDB |
| `sudo service mongod stop` | Stop MongoDB |
| `sudo service mongod restart` | Restart MongoDB |
| `sudo service mongod stop` | Stop MongoDB |
| const uri = `mongodb://localhost:27017/test-db` | Connect DB |

__MongoDB Basic Commands__
| Command | Detail |   
| ------- | ----- |
| `show dbs` | Show all DataBase |
| `use DB Name` | Switch DB |
| `db.createCollection('videos')` | Create DB Collection |
| `show collections`  | Show collections of current DB |
| `db.videos.drop()` | Delete collection |
| `db.dropDatabase()` | Delete current DB |
| `db` | Show current DataBase |

__MongoDB Basic CRUD Commands__
| Command | Detail |   
| ------- | ----- |
| `db.product.insertOne({name: 'm 40', brand: 'Samsung', price: 250, category: 'mobile'})` | Create one item |
| `db.product.insertMany([array of object])` | Create one item |
| `db.product.find()` | Find all items on this collection |
| `db.product.find().pretty()` | Show database pretty |
| `db.product.updateOne({name: 'u10'}, {$set: {brand: 'oppo'}})` | Update collection item |
| `db.product.deleteOne({brand: 'Apple'})` | Delete collection item |

<a href="#table-of-contents">[↑] Back to top</a>

<h3 id="8"> Mongoose </h3>
Elegant Object Data Modeling For Node.js (ODM)

__Benefits of using mongoose__
- Abstraction from raw low level MongoDB
- Relationship between NoSQL Data
- Provides Schema Validation
- Object - Data Mapping - translation of data into object that our code understands and vice versa
- ~ 40 - 60% less code compared to raw mongodb package 

<a href="#table-of-contents">[↑] Back to top</a>







