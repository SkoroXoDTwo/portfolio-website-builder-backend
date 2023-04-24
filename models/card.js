const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    imgLink: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Ссылка некорректная',
      },
      required: true,
    },
    link: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Ссылка некорректная',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
