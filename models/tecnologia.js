const mongoose = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const tecnologiaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      unique: true
    },
    icono: {
      type: String,
      required: [true, 'El icono es obligatorio'],
      trim: true
    },
    publicId: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

const Tecnologia = mongoose.model('Tecnologia', tecnologiaSchema);

module.exports = Tecnologia;
