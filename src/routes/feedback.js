const express = require("express");
const { z } = require("zod");
const { createFeedbackAndNotify } = require("../services/feedbackService");

const router = express.Router();

const FeedbackInputSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

router.post("/feedback", async (req, res) => {
  const parsed = FeedbackInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: "Validation error",
      details: parsed.error.flatten(),
    });
  }

  const { name, email, message } = parsed.data;

  const result = await createFeedbackAndNotify({ name, email, message });

  return res.status(201).json({
    ok: true,
    feedbackId: result.feedbackId,
    telegramSent: result.telegramSent,
    ...(result.telegramError ? { telegramError: result.telegramError } : null),
  });
});

module.exports = router;

