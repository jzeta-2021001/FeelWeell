import { useState } from 'react';
import { useMotivational } from '../../auth/hooks/useMotivational.js';
import { MotivationalHeader } from '../../auth/components/MotivationalHeader.jsx';
import { MotivationalTable } from '../../auth/components/MotivationalTable.jsx';
import { MotivationalModal } from '../../auth/components/MotivationalModal.jsx';
import { ConfirmationModal } from '../../auth/components/ConfirmationModal.jsx';

export const MotivationalPage = () => {
    // Estados para el control visual del modal de confirmación
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [messageToDeleteId, setMessageToDeleteId] = useState(null);

    // Consumimos la lógica depurada del hook
    const {
        messages, loading, isModalOpen, editingId, formData,
        setFormData, handleOpenModal, handleCloseModal, handleSubmit, executeDelete
    } = useMotivational();

    // Orquestación del flujo de eliminación
    const handleStartDelete = (id) => {
        setMessageToDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleCancelDelete = () => {
        setIsConfirmOpen(false);
        setMessageToDeleteId(null);
    };

    const handleConfirmDelete = async () => {
        if (messageToDeleteId) {
            await executeDelete(messageToDeleteId);
            handleCancelDelete();
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6 relative">
            <MotivationalHeader 
                totalMessages={messages.length} 
                onOpenModal={() => handleOpenModal()} 
            />

            <MotivationalTable 
                messages={messages} 
                loading={loading} 
                onEdit={handleOpenModal} 
                onDelete={handleStartDelete} // <- Aquí conectamos el botón de la tabla con el modal
            />

            <MotivationalModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isEditing={!!editingId}
            />

            <ConfirmationModal 
                isOpen={isConfirmOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="¿Excluir Mensaje?"
                message="¿Estás seguro de que deseas desactivar este mensaje motivacional? No volverá a aparecer en la rotación diaria de los usuarios."
                confirmText="Sí, desactivar"
                cancelText="No, cancelar"
            />
        </div>
    );
};