var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
server.listen(3000, () => {
    console.log('3000')
})
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chat.html')
})

var clients = []
io.on('connection', socket => {

    // console.log(socket.room)

    // console.log('看看socket长啥样：\n')
    // console.log(socket)
    // console.log('room信息打印：'+socket.adapter.rooms)
    // 开始处理连接和离开两个基本业务
    console.log('新用户连接：' + socket.id)
    clients.push(socket.id)

    socket.on('disconnect', () => {
        console.log('有用户离开，用户ID是：' + socket.id)
        var index = clients.indexOf(socket.id)
        console.log(index)
        if (index >= 0) {
            clients.splice(index, 1)
        }
    })
    console.log('当前用户数是：' + clients.length)
    // 处理连接和离开两个基本业务结束

    // 开始处理房间业务
    socket.on('submit', data => {
        socket.nickname = data.username
        console.log('当前用户的昵称是：' + socket.nickname)
    })

    socket.on('roomJoin', data => {
        socket.room = data
        socket.join(data)
        console.log(socket.id + '的room是：' + socket.room)
    })

    socket.on('roomListRoomNames', () => {
        // var rooms=io.sockets.adapter.rooms
        // console.log(rooms)
        console.log(socket.rooms)
    })

    socket.on('roomLeave', () => {
        console.log(socket.rooms)
        for (var room of socket.rooms.values()) {
            console.log(room)
        }
    })

    socket.on('roomListUserNames', roomnum => {
        // 此处很复杂，版本变化太乱了，参考：https://www.itranslater.com/qa/details/2129693002137338880
        // 此处已经发生变更，最新版本（"socket.io": "^3.1.1"）更新参考：https://socket.io/docs/v3/migrating-from-2-x-to-3-0/index.html#Socket-rooms-is-now-a-Set
        io.of("/").in(roomnum).allSockets().then(items => {
            console.log(items.forEach(item => {
                console.log('看看这是啥：' + item)
            }))
        })
    })
})