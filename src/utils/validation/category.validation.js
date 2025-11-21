const Joi = require("joi");

const categoryValidation = Joi.string()
  .trim()
  .pattern(/^[A-ZА-ЯЁЎҚҒҲ].*$/u)
  .required()
  .messages({
    "string.base": "Kategoriya matn bo‘lishi kerak.",
    "string.empty": "Kategoriya bo‘sh bo‘lishi mumkin emas.",
    "string.pattern.base":
      "Kategoriya nomi katta harf bilan boshlanishi kerak. Masalan: Shirinliklar yoki Lavashlar",
    "any.required": "Kategoriya kiritilishi shart.",
  });

module.exports = { categoryValidation };
