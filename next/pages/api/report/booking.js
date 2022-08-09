import sendEmail from "../../../lib/mailer";
import moment from "moment";

import withProtect from "../../../middleware/withProtect";

const handler = async (req, res) => {
  const {
    nameMain,
    bookerId,
    mobileMain,
    nameSec,
    mobileSec,
    emailSec,
    emailMain,
    description,
    paxs,
    gender,
    vessel,
    wharfPickUp,
    wharfDropOff,
    address,
    start,
    finish,
    bookedGirls,
    messageList,
  } = req.body.booking;

  const userInit = req.body.user;

  try {
    const emailData = {
      from: "diveboatemployment@gmail.com",
      to: process.env.NEXT_PUBLIC_REACT_APP_EMAIL,
      subject: `${userInit} has reported a booking`,
      html: `<h1>Booking Details:</h1><br/>

          <hr/>
          <h4>Contact</h4><br/>
          <ul>
          <li>Main Name: ${nameMain} - ${bookerId}</li>
          <li>Main Mobile: ${mobileMain}</li>
          <li>Main Email: ${emailMain}</li>
          <li>Secondary Name: ${nameSec}</li>
          <li>Secondary Mobile: ${mobileSec}</li>
          <li>Secondary Email: ${emailSec}</li>
          </ul>

          <hr/>
          <h4>Event</h4><br/>
          <ul>
          <li>Paxs: ${paxs}</li>
          <li>Genders: ${gender}</li>
          <li>Description: ${description}</li>
          </ul>

          <hr/>
          <h4>Location<h4/><br/>
          <ul>
          <li>Address: ${address ? address.description : null}</li>
          <li>Wharf Pick Up: ${wharfPickUp}</li>
          <li>Wharf Drop Off: ${wharfDropOff}</li>
          <li>Vessel: ${vessel}</li>

          </ul>

    <hr/>
          <h4>Time</h4><br/>
          <ul>
          <li>Start: ${moment(start).format("dddd MMM Do YYYY HH:mm")}</li>
          <li>Finish: ${moment(finish).format("dddd MMM Do YYYY HH:mm")}</li>
          </ul>

          <hr/>
          <h4>Booked Girls</h4><br/>
          <ul>
          ${bookedGirls.map((girl) => girl.fName + " " + girl.lName)}
          </ul>

          <hr/>
          <h4>Chat Transcript</h4><br/>
          <ul>
          ${messageList.map((chat) => chat)}
          </ul>
          `,
    };

    await sendEmail(emailData);

    res.status(200).json({ message: "Report sent" });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default withProtect(handler);
