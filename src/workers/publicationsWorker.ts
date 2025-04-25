import 'dotenv/config';
import amqp from 'amqplib';
import { insertRecord } from '../services/publicationsService';
import { validateFields } from '../validators/publicationsValidator';

const QUEUE_NAME = process.env.PUBLICATIONS_QUEUE || 'publications_queue';

const startWorker = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`[*] Aguardando mensagens na fila "${QUEUE_NAME}".`);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          console.log(`[!] Mensagem recebida: ${messageContent}`);

          try {
            const data = JSON.parse(messageContent);

            //Insere o registro na tabela
            const { ...fields } = data;
            const result = await insertRecord(fields);

            if (result.rowCount && result.rowCount > 0) {
              console.log(`[✓] Registro inserido com sucesso`);
            }

            channel.ack(msg);
          } catch (error: unknown) {
            if (error instanceof Error) {
              console.error(`[x] Erro ao processar a mensagem: ${error.message}`);
            } else {
              console.error('[x] Erro ao processar a mensagem: Erro desconhecido');
            }
            channel.nack(msg, false, false);
          }
        }
      },
      { noAck: false }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[x] Erro ao iniciar o worker: ${error.message}`);
    } else {
      console.error('[x] Erro ao iniciar o worker: Erro desconhecido');
    }
    process.exit(1);
  }
};

startWorker();
