require('dotenv').config();

const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');
const ProjectImage = require('../models/projectimage');
const Tecnologia = require('../models/tecnologia');

const isApplyMode = process.argv.includes('--apply');
const isCheckMode = process.argv.includes('--check');
const SAMPLE_SIZE = 5;

const createOptimizedUrl = (publicId) => cloudinary.url(publicId, {
    secure: true,
    fetch_format: 'auto',
    quality: 'auto'
});

const migrateCollection = async ({ Model, urlField, label }) => {
    const total = await Model.countDocuments();
    const documents = await Model.find({
        publicId: { $type: 'string', $regex: /\S/ }
    })
        .select(`_id publicId ${urlField}`)
        .lean();

    const changes = documents.reduce((pendingChanges, document) => {
        const optimizedUrl = createOptimizedUrl(document.publicId.trim());

        if (document[urlField] !== optimizedUrl) {
            pendingChanges.push({
                id: document._id,
                publicId: document.publicId,
                previousUrl: document[urlField],
                optimizedUrl
            });
        }

        return pendingChanges;
    }, []);

    console.log(`\n${label}`);
    console.log(`- Registros totales: ${total}`);
    console.log(`- Con publicId: ${documents.length}`);
    console.log(`- Omitidos sin publicId: ${total - documents.length}`);
    console.log(`- Cambios pendientes: ${changes.length}`);

    if (changes.length > 0) {
        console.log(`- Muestra (máximo ${SAMPLE_SIZE}):`);
        changes.slice(0, SAMPLE_SIZE).forEach((change) => {
            console.log(`  ${change.id}`);
            console.log(`    Antes: ${change.previousUrl}`);
            console.log(`    Después: ${change.optimizedUrl}`);
        });
    }

    if (!isApplyMode || changes.length === 0) {
        return { pending: changes.length, modified: 0 };
    }

    const result = await Model.bulkWrite(
        changes.map((change) => ({
            updateOne: {
                filter: {
                    _id: change.id,
                    [urlField]: change.previousUrl
                },
                update: {
                    $set: { [urlField]: change.optimizedUrl }
                }
            }
        })),
        { ordered: false }
    );

    console.log(`- Registros actualizados: ${result.modifiedCount}`);

    return { pending: changes.length, modified: result.modifiedCount };
};

const run = async () => {
    if (isApplyMode === isCheckMode) {
        throw new Error('Usá exactamente uno de estos argumentos: --check o --apply');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('La variable de entorno MONGO_URI es obligatoria');
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        throw new Error('La variable de entorno CLOUDINARY_CLOUD_NAME es obligatoria');
    }

    console.log(isApplyMode
        ? 'Modo aplicación: se actualizarán las URLs pendientes.'
        : 'Modo comprobación: no se realizarán cambios.');

    await mongoose.connect(process.env.MONGO_URI);

    const projectImages = await migrateCollection({
        Model: ProjectImage,
        urlField: 'url',
        label: 'Imágenes de proyectos'
    });

    const technologies = await migrateCollection({
        Model: Tecnologia,
        urlField: 'icono',
        label: 'Iconos de tecnologías'
    });

    const totalPending = projectImages.pending + technologies.pending;
    const totalModified = projectImages.modified + technologies.modified;

    console.log('\nResumen');
    console.log(`- Cambios detectados: ${totalPending}`);
    console.log(`- Registros actualizados: ${totalModified}`);

    if (isCheckMode && totalPending > 0) {
        console.log('- Ejecutá npm run migrate:cloudinary después de revisar la muestra y crear el backup.');
    }
};

run()
    .catch((error) => {
        console.error('\nLa migración falló:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
