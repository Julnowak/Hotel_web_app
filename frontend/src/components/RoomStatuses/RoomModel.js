import React, {useState} from "react";
import "./RoomStatuses.css"

const RoomModal = ({room, closeModal, updateRoomStatus}) => {
    const [newStatus, setNewStatus] = useState(room.status);

    const handleSave = () => {
        updateRoomStatus(room.room_number, newStatus, room.room_id);
        closeModal();
    };

    return (
        <div className="modal-backdrop">
            <div className="modall">
                <h2 className="modal-title">Status pokoju</h2>
                <p className="modal-text">Pokój numer: {room.room_number}</p>
                <p className="modal-text">Piętro: {room.floor}</p>
                <p className="modal-text">Aktualny status: {room.status}</p>
                <select
                    className="modal-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                >
                    <option value="Zajęty">Zajęty</option>
                    <option value="Wolny">Wolny</option>
                    <option value="Do sprzątania">Do sprzątania</option>
                    <option value="Do naprawy">Do naprawy</option>
                </select>
                <div className="modal-buttons">
                    <button className="modal-button cancel-button-modal" onClick={closeModal}>
                        Anuluj
                    </button>
                    <button className="modal-button save-button-modal" onClick={handleSave}>
                        Zapisz
                    </button>
                </div>
            </div>
        </div>

    );
};

export default RoomModal;
