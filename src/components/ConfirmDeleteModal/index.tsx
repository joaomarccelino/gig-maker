import React, { useState } from "react";
import "./style.css";

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmationModal = ({ isVisible, onClose, onConfirm }: ModalProps) => {
  return (
    <div className={`modal-overlay ${isVisible ? "show" : ""}`}>
      <div className="modal-container">
        <h3 className="confirm-modal-title">Tem certeza que deseja excluir esta banda?</h3>
        <div className="modal-buttons">
          <button className="delete-modal-cancel-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-modal-btn " onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
