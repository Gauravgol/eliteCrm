require('dotenv').config();
const amqp = require("amqplib");
const { info_mqLogger } = require("../logger/winston");
const { sendEmail } = require("../service/email.service");
const { staticData } = require('../commonUtils/apiStaticData');

const EXCHANGE = staticData.exchange;
const QUEUE = staticData.queue;
const ROUTING_KEY = staticData.routingKey;

async function startWorker() {
  try {
    info_mqLogger("Starting Notification Worker...");
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      info_mqLogger(`RabbitMQ connection error: ${err.message}`);
    });

    connection.on("close", () => {
      info_mqLogger(" RabbitMQ connection closed. Worker stopped.");
      process.exit(1); // let PM2 restart it
    });

    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, "direct", { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });
    await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

    info_mqLogger(
      ` Worker connected. Listening on queue="${QUEUE}" routingKey="${ROUTING_KEY}"`
    );

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;

      let payload;

      try {
        console.log("IN mail send")
        payload = JSON.parse(msg.content.toString());

        info_mqLogger(
          ` Message received | type=${payload.type} | to=${payload.to}`
        );

        await sendEmail(payload);

        channel.ack(msg);

        info_mqLogger(
          ` Email sent successfully | type=${payload.type} | to=${payload.to}`
        );
      } catch (err) {
        info_mqLogger(` Processing failed | error=${err.message} | payload=${JSON.stringify( payload)}`);
        channel.nack(msg, false, true); 
      }
    });
  } catch (err) {
    info_mqLogger(`Worker startup failed: ${err}`);
    process.exit(1);
  }
}

startWorker();
