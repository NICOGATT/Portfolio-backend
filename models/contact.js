const mongoose = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      trim: true,
      lowercase: true,
      unique: true
    },
    message: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
