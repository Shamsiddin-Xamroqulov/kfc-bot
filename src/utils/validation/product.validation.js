const Joi = require("joi");

const price = Joi.string()
  .min(4)
  .pattern(/^\d{1,3}(?:\s?\d{3})*$/)
  .trim()
  .required()
  .messages({
    "number.base": "Narx raqam bo'lishi kerak",
    "number.min": "Narx kamida 1000 bo'lishi kerak",
    "any.required": "Narx majburiy maydon",
  });

const weightValidation = Joi.string()
  .trim()
  .pattern(/^\s*(\d+([,.]\d+)?)\s*(kg|g|gr|ml|l|dona|porsiya)\s*$/i)
  .required()
  .messages({
    "any.required": "Og'irlik (weight) maydoni majburiy.",
    "string.base": "Og'irlik qiymati matn (string) formatida bo'lishi kerak.",
    "string.pattern.base":
      "Og'irlik formati noto'g'ri. Misol: '500 gr', '1.5 kg', '12 dona'. Faqat raqam va ruxsat berilgan birliklar ishlatilsin.",
    "string.empty": "Og'irlik qiymati bo'sh bo'lishi mumkin emas.",
  });

const kcalValidation = Joi.string()
  .trim()
  .pattern(/^\s*\d+(\.\d+)?\s*(kcal|kkal)\s*$/i)
  .required()
  .messages({
    "string.base": "⚠️ Kkal qiymati matn ko‘rinishida bo‘lishi kerak.",
    "string.empty": "⚠️ Kkal qiymatini kiritish majburiy.",
    "string.pattern.base":
      "⚠️ Noto‘g‘ri format! Masalan: `250 kcal` yoki `1.5kkal` tarzida yozing.",
    "any.required": "⚠️ Kkal qiymatini kiritish talab qilinadi.",
  });

const priceValidation = Joi.string()
  .trim()
  .pattern(/^\d{1,3}(?:\s?\d{3})*$/)
  .required()
  .messages({
    "string.base": "❌ Narx matn formatida bo‘lishi kerak.",
    "string.empty": "❌ Narx maydoni bo‘sh bo‘lishi mumkin emas.",
    "string.pattern.base":
      "❌ Narx noto‘g‘ri formatda. Masalan: 60000 yoki 60 000",
    "any.required": "❌ Narx kiritilishi shart.",
  });

const categoryValidation = Joi.string()
  .trim()
  .pattern(/^[\p{Extended_Pictographic}]\s+\p{Lu}.*$/u)
  .required()
  .messages({
    "string.base": "Kategoriya matn bo‘lishi kerak.",
    "string.empty": "Kategoriya bo‘sh bo‘lishi mumkin emas.",
    "string.pattern.base":
      "Kategoriya emoji bilan boshlanishi va nomining bosh harfi katta bo‘lishi kerak. Masalan: 🌯 Lavash",
    "any.required": "Kategoriya kiritilishi shart.",
  });

module.exports = { price, weightValidation, kcalValidation, priceValidation, categoryValidation };
