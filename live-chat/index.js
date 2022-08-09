const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const mongoose = require("mongoose");
require("dotenv").config();
const Model = require("./model");
const Client = require("./client");

const nodeMailer = require("nodemailer");

const sendEmail = (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "diveboatemployment@gmail.com",
      pass: "bwldeqdvqfmbjmuh",
    },
  });
  return transporter
    .sendMail(emailData)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};

// datebase
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DataBase Connected"));

mongoose.connection.on("error", (err) => {
  console.log(`DataBase connection error: ${err.message}`);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    const room = data.room;

    socket.to(room).emit("message", data);

    // pushing messages to all models
    Model.updateMany(
      { "bookings.roomId": data.room },
      {
        $push: {
          "bookings.$.messageList": data,
        },
      }
    )
      .then((result) => {
        // pushing messages to client
        Client.updateOne(
          { "bookings.roomId": data.room },
          {
            $push: {
              "bookings.$.messageList": data,
            },
          }
        )

          .then((result) => {
            const name = data.author.split(".")[0];
            const last = data.author.split(".")[1];

            // email client but first check if they are the author if they are dont send if they are not email
            Client.findOne({ "bookings.roomId": data.room })
              .then(async (result) => {
                const firstName = result.fName;
                const lastName = result.lName;

                if (name === firstName && last === lastName) {
                  console.log("this is the author");
                } else {
                  const emailData = {
                    from: "diveboatemployment@gmail.com",
                    to: result.email,
                    subject: "New Messages",
                    text: `${data.message} from ${name} ${last} `,
                    html: ``,
                  };

                  var itemObject = result.bookings
                    .find((bookings) => bookings.roomId === data.room)
                    .toObject();

                  if (itemObject.notifications) {
                    await sendEmail(emailData);
                  } else {
                    console.log("do nothing");
                  }
                }
                // email models but first check if they are the author if they are dont send if they are not email
                Model.find({ "bookings.roomId": data.room })
                  .then(async (result) => {
                    result.map(async (model) => {
                      if (name === model.fName && last === model.lName) {
                        console.log("this is the author");
                      } else {
                        const emailData = {
                          from: "diveboatemployment@gmail.com",
                          to: model.email,
                          subject: "New Messages",
                          text: `${data.message} from ${name} ${last} `,
                          html: ``,
                        };

                        var itemObject = model.bookings
                          .find((bookings) => bookings.roomId === data.room)
                          .toObject();

                        if (itemObject.notifications) {
                          await sendEmail(emailData);
                        } else {
                          console.log("do nothing");
                        }
                      }
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          })

          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("disconnect", (data) => {
    console.log("User Disconnected", socket.id);

    console.log("User Disconnected Time", socket.handshake.time);
    // console.log("User Disconnected Time", socket);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
