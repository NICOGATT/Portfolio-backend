const mongoose = require('mongoose');

const CANALES = ['whatsapp', 'instagram', 'web'];
const ESTADOS = ['nuevo', 'soporte', 'atendido'];

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const leadSchema = new mongoose.Schema(
  {
    canal: {
      type: String,
      enum: CANALES,
      required: [true, 'El canal es obligatorio']
    },
    // Cómo identifica el canal a la persona: el número en WhatsApp, el ID de usuario en Instagram, etc.
    identificador: {
      type: String,
      required: [true, 'El identificador es obligatorio'],
      trim: true
    },
    nombre: {
      type: String,
      trim: true,
      default: ''
    },
    telefono: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    estado: {
      type: String,
      enum: ESTADOS,
      default: 'nuevo'
    },
    ultimoMensaje: {
      type: String,
      trim: true,
      default: ''
    },
    ultimoContacto: {
      type: Date,
      default: Date.now
    },
    cantidadMensajes: {
      type: Number,
      min: 0,
      default: 0
    },
    notas: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

leadSchema.index({ canal: 1, identificador: 1 }, { unique: true });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
module.exports.CANALES = CANALES;
module.exports.ESTADOS = ESTADOS;
