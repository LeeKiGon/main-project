// const express = require('express')
// const router = express.Router()
// const { Server } = require('socket.io')


// //채팅클라이언트에 연결
// io.on("connection", (socket) => {
//     // console.log(socket,new Date().toLocaleTimeString())
//     console.log(`User Connected: ${socket.id}`)//연결된 유저의 소켓아이디

//     //whereRoom에 참가하기
//     socket.on("join-room", (whereRoom) => {
//         socket.join(whereRoom)
//         console.log(`User ID ${socket.id} 가 ${whereRoom} 에 입장`)
//     })

//     //whereRoom 내에서의 채팅로그
//     socket.on("send_message", (chatLog) => {
//         socket.to(chatLog.room).emit("receive_message", chatLog)
//         console.log('채팅로그:',chatLog)
//     })

//     //클라이언트와 연결 종료
//     socket.on("disconnect", () => {
//         console.log(socket.id,"의 연결이 끊어짐" )
//     })
// })

// module.exports = router;
