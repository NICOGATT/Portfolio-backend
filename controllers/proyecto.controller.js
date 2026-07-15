const mongoose = require('mongoose');
const Proyecto = require('../models/proyecto');
const ProjectImage = require('../models/projectimage');
const Tecnologia = require('../models/tecnologia');
const { cloudinary, uploadBufferToCloudinary } = require('../config/cloudinary');

const populateProyecto = [
    { path: 'images' },
    { path: 'tecnologias', select: 'nombre icono' }
];

const idsValidos = (ids) => Array.isArray(ids) && ids.every((id) => mongoose.Types.ObjectId.isValid(id));

const tecnologiasExistentes = async (ids) => {
    const tecnologiasUnicas = [...new Set(ids)];
    const total = await Tecnologia.countDocuments({ _id: { $in: tecnologiasUnicas } });
    return total === tecnologiasUnicas.length;
};

const deleteCloudinaryImages = async (images) => {
    const publicIds = images
        .map((image) => image.publicId)
        .filter(Boolean);

    if (publicIds.length === 0) {
        return;
    }

    await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
};

const crearProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, img = [], urlRepo, usuarioId } = req.body;
        const newProject = await Proyecto.create({ nombre, descripcion, urlRepo, usuarioId });

        if (img.length > 0) {
            const imageData = img.map((url) => ({
                url,
                projectId: newProject.id
            }));
            const images = await ProjectImage.insertMany(imageData);
            newProject.images = images.map((image) => image._id);
            await newProject.save();
        }

        const projectComplete = await Proyecto.findById(newProject.id).populate(populateProyecto);

        res.status(201).json({
            message: 'El projecto ha sido creado con exito',
            data: projectComplete
        });
    } catch (error) {
        res.status(500).json({
            error: 'El project no se pudo crear con exito',
            message: error.message
        });
    }
};

const getProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find().populate(populateProyecto);
        res.json(proyectos);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener proyectos',
            error: error.message
        });
    }
};

const getProyectoById = async (req, res) => {
    res.json(req.proyecto);
};

const updateProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, urlRepo, usuarioId } = req.body;
        const proyecto = await Proyecto.findByIdAndUpdate(
            req.proyecto.id,
            { nombre, descripcion, urlRepo, usuarioId },
            { new: true, runValidators: true }
        ).populate(populateProyecto);

        res.status(200).json({
            message: 'El proyecto ha sido actualizado con exito',
            data: proyecto
        });
    } catch (error) {
        res.status(500).json({
            error: 'No se pudo actaualizar el producto',
            message: error.message
        });
    }
};

const deleteProyecto = async (req, res) => {
    try {
        const images = await ProjectImage.find({ projectId: req.proyecto.id });
        await deleteCloudinaryImages(images);
        await ProjectImage.deleteMany({ projectId: req.proyecto.id });
        await Proyecto.findByIdAndDelete(req.proyecto.id);
        res.json({ message: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({
            message: 'Error al eliminar proyecto',
            error: error.message
        });
    }
};

const addImage = async (req, res) => {
    try {
        const proyecto = req.proyecto;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se recibieron imagenes' });
        }

        const uploads = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(
            file.buffer,
            {
                folder: 'portfolio/projects',
                resource_type: 'image'
            }
        )));

        const imagesData = uploads.map((upload) => ({
            url: cloudinary.url(upload.public_id, {
                secure: true,
                fetch_format: 'auto',
                quality: 'auto'
            }),
            publicId: upload.public_id,
            projectId: proyecto.id
        }));

        const images = await ProjectImage.insertMany(imagesData);
        await Proyecto.findByIdAndUpdate(proyecto.id, {
            $push: { images: { $each: images.map((image) => image._id) } }
        });

        res.status(201).json({
            message: 'La imagenes han sido creada con exito',
            data: images
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al agregar las imagenes',
            error: error.message
        });
    }
};

const getImageByProyecto = async (req, res) => {
    try {
        const projectComplete = await Proyecto.findById(req.proyecto.id).populate('images');
        res.status(200).json({
            message: 'Imagenes del proyecto',
            data: projectComplete.images
        });
    } catch (error) {
        res.status(500).json({
            message: 'No se pudo obtener las imagenes',
            error: error.message
        });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = req.image;

        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await ProjectImage.findByIdAndDelete(image.id);
        await Proyecto.findByIdAndUpdate(image.projectId, {
            $pull: { images: image._id }
        });

        res.status(200).json({
            message: 'La imagen ha sido eliminada con exito'
        });
    } catch (error) {
        res.status(500).json({
            message: 'No se pudo eliminar la imagen',
            error: error.message
        });
    }
};

const addTecnologiasProyecto = async (req, res) => {
    try {
        const proyecto = req.proyecto;
        const { tecnologias } = req.body;

        if (!idsValidos(tecnologias)) {
            return res.status(400).json({ message: 'Las tecnologias deben ser IDs validos' });
        }

        if (!(await tecnologiasExistentes(tecnologias))) {
            return res.status(404).json({ message: 'Una o mas tecnologias no fueron encontradas' });
        }

        await Proyecto.findByIdAndUpdate(proyecto.id, {
            $addToSet: { tecnologias: { $each: tecnologias } }
        });

        return res.status(201).json({
            message: 'Tecnologias agregadas al proyecto con exito'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al agregar las tecnologias al proyecto',
            error: error.message
        });
    }
};

const getTecnologiasProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.proyecto.id).populate({
            path: 'tecnologias',
            select: 'nombre icono'
        });

        return res.status(200).json({
            message: 'Tecnologias del proyecto',
            data: proyecto.tecnologias
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error al obtener las tecnologias del proyecto',
            error: error.message
        });
    }
};

const setTecnologiasDeProyecto = async (req, res) => {
    try {
        const proyecto = req.proyecto;
        const { tecnologias } = req.body;

        if (!idsValidos(tecnologias)) {
            return res.status(400).json({ message: 'Las tecnologias deben ser IDs validos' });
        }

        if (!(await tecnologiasExistentes(tecnologias))) {
            return res.status(404).json({ message: 'Una o mas tecnologias no fueron encontradas' });
        }

        await Proyecto.findByIdAndUpdate(
            proyecto.id,
            { tecnologias },
            { runValidators: true }
        );

        return res.status(200).json({
            message: 'Tecnologias actualizadas en el proyecto'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'error al actualizar el proyecto',
            error: error.message
        });
    }
};

module.exports = {
    crearProyecto,
    getProyectos,
    getProyectoById,
    updateProyecto,
    deleteProyecto,
    getImageByProyecto,
    addImage,
    deleteImage,
    addTecnologiasProyecto,
    getTecnologiasProyecto,
    setTecnologiasDeProyecto
};
