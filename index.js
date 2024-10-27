const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require("fs");
const url = require("url");

const PORT = process.env.PORT || 3000;
app.listen(PORT);

const ROOT_DIR = "html"; // Directory for your HTML files

const MIME_TYPES = {
    css: "text/css",
    gif: "image/gif",
    htm: "text/html",
    html: "text/html",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    svg: "image/svg+xml",
    txt: "text/plain"
};

function get_mime(filename) {
    const ext = filename.split('.').pop();
    return MIME_TYPES[ext] || MIME_TYPES["txt"];
}

let users = {};

function handler(request, response) {
    let urlObj = url.parse(request.url, true, false);
    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    let filePath = ROOT_DIR + urlObj.pathname;
    if (urlObj.pathname === '/') filePath = ROOT_DIR + '/calendarClient.html'; // Change this to your HTML file name

    fs.readFile(filePath, function(err, data) {
        if (err) {
            console.log("ERROR: " + JSON.stringify(err));
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
        }
        response.writeHead(200, {
            "Content-Type": get_mime(filePath)
        });
        response.end(data);
    });
}

io.on('connection', function(socket) {
    console.log('Client Connected: ' + socket.id);

    socket.on('joinCalendar', function(calendarName) {
        console.log('User joined calendar: ' + calendarName);
        // You can manage calendars here, perhaps using a data structure to hold events
    });

    // Additional socket event handlers can go here...

    socket.on('disconnect', function () {
        console.log('Client Disconnected');
        // Handle user disconnect logic...
    });
});

console.log("Server Running at PORT: " + PORT + "  CNTL-C to quit");
console.log("To Test:");
console.log("Open several browsers at: http://localhost:3000/");
