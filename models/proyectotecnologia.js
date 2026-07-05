const mongoose = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const proyectoTecnologiaSchema = new mongoose.Schema(
  {
    proyecto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proyecto',
      required: true
    },
    tecnologia_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tecnologia',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

const ProyectoTecnologia = mongoose.model('ProyectoTecnologia', proyectoTecnologiaSchema);

module.exports = ProyectoTecnologia;
