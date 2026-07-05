const mongoose = require('mongoose');

const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  }
};

const projectImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'La url de la imagen es obligatoria'],
      trim: true
    },
    publicId: {
      type: String,
      trim: true,
      default: null
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proyecto',
      required: [true, 'El proyecto es obligatorio']
    }
  },
  {
    timestamps: true,
    toJSON: toJSONOptions,
    toObject: toJSONOptions
  }
);

const ProjectImage = mongoose.model('ProjectImage', projectImageSchema);

module.exports = ProjectImage;
