import { createContentRecord, updateContentRecord, softDeleteContent, listEducationalContentRecord, getContentByIdRecord, filterContentByCategoryRecord } from './content.services.js';

export const createContent = async (req, res) => {
    try {
        const content = await createContentRecord({
            contentData: req.body,
            file: req.file
        })

        res.status(201).json({
            success: true,
            message: 'Contenido creado exitosamente',
            data: content
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el contenido',
            error: e.message
        });
    }
};

export const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await updateContentRecord(id, req.body, req.file);

        res.status(200).json({
            success: true,
            message: 'Contenido actualizado exitosamente',
            data: content
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el contenido',
            error: e.message
        });
    }
};

export const deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await softDeleteContent(id);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el contenido',
            error: e.message
        });
    }
};

export const listEducationalContent = async (req, res) => {
    try {
        const contents = await listEducationalContentRecord();

        res.status(200).json({
            success: true,
            message: 'Contenido educativo obtenido exitosamente',
            total: contents.length,
            data: contents
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el contenido educativo',
            error: e.message
        });
    }
};

export const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await getContentByIdRecord(id);

        res.status(200).json({
            success: true,
            message: 'Contenido obtenido exitosamente',
            data: content
        });
    } catch (e) {
        if (e.message === 'Contenido no encontrado') {
            return res.status(404).json({ 
                success: false, 
                message: e.message });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Error interno del servidor' });
    }
};

export const filterContentByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const contents = await filterContentByCategoryRecord(category);

        res.status(200).json({
            success: true,
            message: `Contenido filtrado por categoría "${category}" obtenido exitosamente`,
            total: contents.length,
            data: contents
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error al filtrar el contenido',
            error: e.message
        });
    }
};
