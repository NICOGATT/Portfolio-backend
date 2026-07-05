const mongoose = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const proyectoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    descripcion: {
      type: String,
      required: [true, 'La descripcion es obligatoria'],
      trim: true
    },
    urlRepo: {
      type: String,
      required: [true, 'La url del repositorio es obligatoria'],
      trim: true
    },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio']
    },
    tecnologias: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tecnologia'
    }],
    images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProjectImage'
    }]
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

const Proyecto = mongoose.model('Proyecto', proyectoSchema);

module.exports = Proyecto;
