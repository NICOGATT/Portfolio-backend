const mongoose = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Email invalido'
      ]
    },
    password: {
      type: String,
      required: [true, 'The password is required'],
      trim: true
    },
    numero: {
      type: String,
      required: [true, 'El numero es obligatorio'],
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
