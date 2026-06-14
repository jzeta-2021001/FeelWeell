import { useContentStore } from '../store/contentStore.js';

export const useSaveContent = () => {
    const createContent = useContentStore((state) => state.createContent);
    const updateContent = useContentStore((state) => state.updateContent);

    const saveContent = async (data, contentId = null) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('type', data.type);
        formData.append('category', data.category);
        if( data.url?.trim()) {
            formData.append('url', data.url.trim());
        }

        if (data.photo?.length > 0) {
            formData.append('photo', data.photo[0]);
        }
        
        if(data.body?.trim()) {
            formData.append('body', data.body.trim());
        }

        if (contentId) {
            return await updateContent(contentId, formData);
        } else {
            return await createContent(formData);
        }
    };
    return { saveContent };
}