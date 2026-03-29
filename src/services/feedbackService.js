const prisma = require("../prisma");
const { sendTelegramMessage } = require("./telegram");

function buildTelegramText({ name, email, message }) {
  return [
    "Новая заявка обратной связи",
    `Имя: ${name}`,
    `Почта: ${email}`,
    `Сообщение: ${message}`,
  ].join("\n");
}

async function createFeedbackAndNotify({ name, email, message }) {
  const created = await prisma.feedback.create({
    data: {
      name,
      email,
      message,
      telegramStatus: "PENDING",
    },
  });

  const telegramText = buildTelegramText({ name, email, message });

  try {
    const tg = await sendTelegramMessage({ text: telegramText });
    await prisma.feedback.update({
      where: { id: created.id },
      data: {
        telegramStatus: "SENT",
        telegramMessageId: tg.messageId ? String(tg.messageId) : null,
        telegramError: null,
      },
    });
    return { feedbackId: created.id, telegramSent: true };
  } catch (err) {
    const telegramError = err instanceof Error ? err.message : String(err);
    await prisma.feedback.update({
      where: { id: created.id },
      data: {
        telegramStatus: "FAILED",
        telegramError: telegramError.slice(0, 2000),
      },
    });
    return { feedbackId: created.id, telegramSent: false, telegramError };
  }
}

module.exports = { createFeedbackAndNotify };

