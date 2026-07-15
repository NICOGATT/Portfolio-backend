const Tecnologia = require('../models/tecnologia');
const Proyecto = require('../models/proyecto');
const { cloudinary, uploadBufferToCloudinary } = require('../config/cloudinary');

const uploadIcono = async (file) => {
    if (!file) {
        return null;
    }

    return uploadBufferToCloudinary(file.buffer, {
        folder: 'portfolio/technologies',
        resource_type: 'image'
    });
};

const crearTecnologia = async (req, res) => {
    try {
        const { nombre } = req.body;
        const uploadedIcon = await uploadIcono(req.file);
        const icono = uploadedIcon
            ? cloudinary.url(uploadedIcon.public_id, {
                secure: true,
                fetch_format: 'auto',
                quality: 'auto'
            })
            : req.body.icono;
        const publicId = uploadedIcon ? uploadedIcon.public_id : null;

        const newTecnologia = await Tecnologia.create({ nombre, icono, publicId });
        res.status(201).json(newTecnologia);
    } catch (error) {
        res.status(500).json({
            message: 'Error al crear tecnologia',
            error: error.message
        });
    }
};

const getTecnologia = async (req, res) => {
    try {
        const tecnologias = await Tecnologia.find().select('nombre icono publicId');
        res.json(tecnologias);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener tecnologias',
            error: error.message
        });
    }
};

const getTecnolgiaId = (req, res) => {
    res.status(200).json(req.tecnologia);
};

const updateTecnologia = async (req, res) => {
    try {
        const { nombre } = req.body;
        const uploadedIcon = await uploadIcono(req.file);
        const updateData = { nombre };

        if (uploadedIcon) {
            if (req.tecnologia.publicId) {
                await cloudinary.uploader.destroy(req.tecnologia.publicId);
            }

            updateData.icono = cloudinary.url(uploadedIcon.public_id, {
                secure: true,
                fetch_format: 'auto',
                quality: 'auto'
            });
            updateData.publicId = uploadedIcon.public_id;
        } else if (req.body.icono) {
            if (req.tecnologia.publicId && req.body.icono !== req.tecnologia.icono) {
                await cloudinary.uploader.destroy(req.tecnologia.publicId);
                updateData.publicId = null;
            }

            updateData.icono = req.body.icono;
        }

        const tecnologia = await Tecnologia.findByIdAndUpdate(
            req.tecnologia.id,
            updateData,
            { new: true, runValidators: true }
        );
        res.json(tecnologia);
    } catch (error) {
        res.status(500).json({
            message: 'Error al actualizar tecnologia',
            error: error.message
        });
    }
};

const deleteTecnologia = async (req, res) => {
    try {
        if (req.tecnologia.publicId) {
            await cloudinary.uploader.destroy(req.tecnologia.publicId);
        }

        await Tecnologia.findByIdAndDelete(req.tecnologia.id);
        await Proyecto.updateMany(
            { tecnologias: req.tecnologia.id },
            { $pull: { tecnologias: req.tecnologia._id } }
        );
        res.json({ message: 'Tecnologia eliminada' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar tecnologia',
            error: error.message
        });
    }
};

module.exports = {
    crearTecnologia,
    getTecnologia,
    getTecnolgiaId,
    updateTecnologia,
    deleteTecnologia
};
