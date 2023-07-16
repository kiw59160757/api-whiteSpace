const line = require("@line/bot-sdk");

let line1 = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN1,
    channelSecret: process.env.LINE_SERCRET1,
  });


  webhook = async (req, res, next) => {
    try {
      const events = req.body.events;
      return events.length > 0
        ? await events.map((x) => handleEvent(x))
        : res.status(200).send("ok");
    } catch (error) {
      console.log("error", error);
      res.status(500).end();
    }
  };
  const handleEvent = async (events) => {
    try {
      let profile = undefined;
      let user = undefined;
  
      if (events.source.type === "user") {
        profile = await getProfile(events.source.userId);
      } else {
        profile = await getProfileGroup(events.source);
      }
      if (profile && profile.status !== 200) throw profile;
      const checkProfile = await modelCustomer.countDocuments({
        customerId: profile.data.userId,
      });
  
      if (checkProfile === 0) {
        const conutProfile = await modelCustomer.countDocuments();
        const newCustomer = new modelCustomer({
          serialId: `C-${await ChangeNumberToCode(conutProfile)}`,
          customerId: profile.data.userId,
          displayName: profile.data.displayName,
        });
        user = await newCustomer.save();
      } else {
        user = await modelCustomer.findOneAndUpdate(
          { customerId: profile.data.userId },
          { displayName: profile.data.displayName },
          { new: true }
        );
      }
      if (
        events.message.type === "text" &&
        events.message.text === "เริ่ม" &&
        user.role === "S" &&
        events.source.type !== "user"
      ) {
        await modelConfig.findOneAndUpdate(
          { name: "lineGroupIdLatest" },
          { value: events.source.groupId }
        );
        return line1.replyMessage(events.replyToken, {
          type: "text",
          text: "บันทึกกลุ่มไลน์เรียบร้อย",
        });
      }
  
      const lineGroupIdLatest = await modelConfig.findOne({
        name: "lineGroupIdLatest",
      });
  
      if (events.message.type === "text") {
        if (events.message.text.split("/").length > 1) {
          if (
            lineGroupIdLatest.value === "" ||
            events.source.type === "user" ||
            lineGroupIdLatest.value !== events.source.groupId
          )
            throw { status: 305, replyToken: events.replyToken };
          await replyBet(events, user);
        }
        if (
          events.message.text.split("ถอน").length > 1 &&
          events.message.text.replace(/[^0-9]/g, "")
        ) {
          if (
            lineGroupIdLatest.value === "" ||
            events.source.type === "user" ||
            lineGroupIdLatest.value !== events.source.groupId
          )
            throw { status: 305, replyToken: events.replyToken };
          await replyWitdraw(events, user);
        }
        if (events.message.text === "X") {
          if (lineGroupIdLatest.value === "")
            throw { status: 305, replyToken: events.replyToken };
          await replyCancenTransection({ replyToken: events.replyToken, user });
        }
        if (events.message.text === "C" || events.message.text === "c") {
          await replyCreadit({ replyToken: events.replyToken, user });
        }
        if (events.message.text === "กต") {
          await replyRules({ replyToken: events.replyToken, user, events });
        }
        if (events.message.text === "ว") {
          await replyHowToPlay({ replyToken: events.replyToken, user, events });
        }
      } else if (events.message.type === "image") {
        if (
          lineGroupIdLatest.value === "" ||
          events.source.type === "user" ||
          lineGroupIdLatest.value !== events.source.groupId
        )
          throw { status: 305, replyToken: events.replyToken };
        const image = `${events.message.id}.png`;
        await downloadFile(
          events.message.id,
          path.join(__dirname, `../upload/private/`),
          image
        );
        const saveSlip = new modelPreTransection({
          type: "D",
          status: "W",
          deposit: {
            img: image,
          },
          customerId: user._id,
        });
        await saveSlip.save();
        const io = require("../helpers/socket").io();
        setTimeout(function () {
          io.emit(`credit`, {
            event: "update",
          });
        }, 1000);
      }
    } catch (error) {
      console.log("error", error);
      if (error.status === 305) {
        return line1.replyMessage(error.replyToken, {
          type: "text",
          text: "ไม่สามารถทำรายการได้โปรดติดต่อแอดมิน",
        });
      }
    }
  };