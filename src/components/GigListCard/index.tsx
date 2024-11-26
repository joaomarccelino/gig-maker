import React, { useState } from "react";
import { handleDeleteBand } from '../../services/band';
import './style.css';
import ConfirmDeleteModal from "../ConfirmDeleteModal";

type GigListCardProps = {
  id: string;
  bandName: string;
  location: string;
  image: string;
};

const GigListCard = ({ id, image, bandName, location }: GigListCardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const openModal = () => setIsModalVisible(true);

  const closeModal = () => setIsModalVisible(false);

  const handleDelete = async () => {
    try {
      await handleDeleteBand(id, image);
      alert("Banda excluída com sucesso!");
      closeModal(); 
    } catch (error) {
      alert("Erro ao excluir banda.");
    }
  };

  return (
    <div className='gig-list-card'>
      <img src={image} className='gig-list-image' />
      <p className='band-name'>{bandName}</p>
      <p className="band-location">{location}</p>
      <a href={`/banda/${id}`}>Acessar Perfil</a>
      <a href={`page/banda/${id}`}>Acessar Landing Page</a>
      <a href={`editar/banda/${id}`}>Editar Informações</a>
      <button className="unregister-btn" onClick={openModal}>
        Excluir Banda
      </button>

      <ConfirmDeleteModal 
        isVisible={isModalVisible} 
        onClose={closeModal} 
        onConfirm={handleDelete} 
      />
    </div>
  );
}

export default GigListCard;
