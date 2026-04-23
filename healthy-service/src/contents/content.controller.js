import { createContentRecord, updateContentRecord, softDeleteContent, listEducationalContentRecord, getContentByIdRecord, filterContentByCategoryRecord } from './content.services.js';

export const createContent = async (req, res) => {
    try {
        const content = await createContentRecord({
            contentData: req.body,
            file: req.file
        });
        return res.status(201).json({
            success: true,
            message: 'Contenido creado exitosamente',
            data: content
        });
    } catch (e) {
        console.error('[createContent]', e);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

export const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await updateContentRecord(id, req.body, req.file);
        return res.status(200).json({
            success: true,
            message: 'Contenido actualizado exitosamente',
            data: content
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Contenido no encontrado' });
        }
        console.error('[updateContent]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await softDeleteContent(id);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (e) {
        if (e.message.includes('no encontrado') || e.message.includes('not found')) {
            return res.status(404).json({ success: false, message: 'Contenido no encontrado' });
        }
        console.error('[deleteContent]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const listEducationalContent = async (req, res) => {
    try {
        const contents = await listEducationalContentRecord();
        return res.status(200).json({
            success: true,
            message: 'Contenido educativo obtenido exitosamente',
            total: contents.length,
            data: contents
        });
    } catch (e) {
        console.error('[listEducationalContent]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await getContentByIdRecord(id);
        return res.status(200).json({
            success: true,
            message: 'Contenido obtenido exitosamente',
            data: content
        });
    } catch (e) {
        if (e.message === 'Contenido no encontrado') {
            return res.status(404).json({ success: false, message: e.message });
        }
        console.error('[getContentById]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

export const filterContentByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const contents = await filterContentByCategoryRecord(category);
        if (!contents || contents.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No hay contenido para la categoría "${category}"`
            });
        }
        return res.status(200).json({
            success: true,
            message: `Contenido filtrado por categoría "${category}" obtenido exitosamente`,
            total: contents.length,
            data: contents
        });
    } catch (e) {
        console.error('[filterContentByCategory]', e);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};