import Content from './content.model.js';
import {deleteCloudinaryImage} from '../../middlewares/file-uploader.js';

const CLOUDINARY_BASE_URL= `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

//Crear la URL de la foto 
const buildPhotoData = (file)=>{
    if(!file) return{photo: 'uploads/contents/FeelWell_logo_gbgakn', photoUrl: null};
    const publicId = file.filename;
    const photoUrl = `${CLOUDINARY_BASE_URL}/${publicId}`;

    return{
        photo: publicId,
        photoUrl
    };
};
//Admin: gestión de contenido

export const createContentRecord = async ({contentData, file}) => {
    const data ={...contentData, ...buildPhotoData(file)}
    const content = new Content(data);
    await content.save();
    return content;
};

export const updateContentRecord = async (id, contentData, file) => {
    const data ={...contentData}

    if(file){
        const existingImage = await Content.findById(id);
        if(existingImage?.photo){
            //Borra la antigua foto
            await deleteCloudinaryImage(existingImage.photo)
        }
        const publicId = file.filename;
        data.photo = publicId;
        data.photoUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
    }
    
    const content = await Content.findByIdAndUpdate(
        id,
        { ...data },
        { new: true, runValidators: true }
    );

    if (!content) {
        throw new Error('Contenido no encontrado');
    }

    return content;
};

export const softDeleteContent = async (id) => {
    const content = await Content.findById(id);

    if (!content) {
        throw new Error('Contenido no encontrado');
    }
    await deleteCloudinaryImage(content.photo);
    content.isDeleted = true;
    content.deletedAt = new Date();
    await content.save();

    return { message: 'Contenido eliminado correctamente' };
};

//Usuario y Admin: consulta de contenido

export const listEducationalContentRecord = async () => {
    const contents = await Content.find().sort({ createdAt: -1 });
    return contents;
};

export const getContentByIdRecord = async (id) => {
    const content = await Content.findById(id);

    if (!content) {
        throw new Error('Contenido no encontrado');
    }

    return content;
};

export const filterContentByCategoryRecord = async (category) => {
    const contents = await Content.find({ category }).sort({ createdAt: -1 });
    return contents;
};
