const amqp = require("amqplib");
const { info_mqLogger } = require("../logger/winston");

let connection = null;
let channel = null;
let isConnecting = false;

const EXCHANGE = "notification_exchange";

async function connectRabbitMQ() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    info_mqLogger("Connecting to RabbitMQ...");

    connection = await amqp.connect(process.env.RABBITMQ_URL);

    connection.on("error", (err) => {
      info_mqLogger(`RabbitMQ connection error: ${err.message}`);
    });

    connection.on("close", () => {
      info_mqLogger("RabbitMQ connection closed. Reconnecting...");
      channel = null;
      connection = null;
      setTimeout(connectRabbitMQ, 5000);
    });

    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, "direct", { durable: true });

    info_mqLogger("RabbitMQ connected (API)");
  } catch (err) {
    info_mqLogger(`RabbitMQ connect failed: ${err.message}`);
    setTimeout(connectRabbitMQ, 5000);
  } finally {
    isConnecting = false;
  }
}

function publishEvent(routingKey, payload) {
  if (!channel) {
    info_mqLogger("RabbitMQ channel not ready. Event skipped.");
    return;
  }

  try {
    channel.publish(
      EXCHANGE,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );
  } catch (err) {
    info_mqLogger(`Publish failed: ${err.message}`);
  }
}

module.exports = {
  connectRabbitMQ,
  publishEvent,
};
