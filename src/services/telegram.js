function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function sendTelegramMessage({ text }) {
  const TELEGRAM_BOT_TOKEN = requireEnv("TELEGRAM_BOT_TOKEN");
  const TELEGRAM_CHAT_ID = requireEnv("TELEGRAM_CHAT_ID");
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }),
  });

  const data = await resp.json().catch(() => null);
  if (!resp.ok || !data?.ok) {
    const desc = data?.description || resp.statusText || "Unknown error";
    throw new Error(`Telegram send failed: ${resp.status} ${desc}`);
  }

  return {
    ok: true,
    messageId: data.result?.message_id ?? null,
  };
}

module.exports = { sendTelegramMessage };

