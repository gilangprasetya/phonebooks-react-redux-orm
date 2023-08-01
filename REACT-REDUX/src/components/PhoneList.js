import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateContact, deleteContact } from '../actions/phonebooks';

export default function PhoneList({ id, name, phone, avatar, data, setData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedPhone, setEditedPhone] = useState(phone);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const dispatch = useDispatch();

    const updateAvatar = (contactId, newAvatar) => {
        const updatedData = data.map((contact) => {
            if (contact.id === contactId) {
                return {
                    ...contact,
                    avatar: newAvatar,
                };
            }
            return contact;
        });

        setData(updatedData);
    };

    const handleImageClick = () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("avatar", file);

            axios
                .put(`http://localhost:3001/api/phonebooks/${id}/avatar`, formData)
                .then((response) => {
                    // Call the function to update the editedAvatar state and the data array
                    updateAvatar(id, response.data.data.avatar);
                })
                .catch((error) => {
                    console.error("Error updating avatar:", error);
                    // Handle the error, show an error message, or implement proper error handling
                });
            window.location.reload()
        });
        fileInput.click();
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async (event) => {
        event.preventDefault();

        try {
            await dispatch(updateContact(id, editedName, editedPhone));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating contact:', error);
        }
    };

    const handleDelete = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        dispatch(deleteContact(id));
        setShowConfirmModal(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
    };

    return (
        <li className="card">
            <div className="image">
                <img
                    src={avatar ? `http://localhost:3001/images/${avatar}` : '/user.png'}
                    className="img-fluid"
                    width="90px"
                    height="90px"
                    alt="User"
                    onClick={handleImageClick}
                />
            </div>
            <div className="info">
                {isEditing ? (
                    // Show input fields during edit mode
                    <form onSubmit={handleSaveClick}>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                        <br />
                        <input
                            type="text"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                        />
                        <br />
                    </form>
                ) : (
                    // Show contact details in non-edit mode
                    <>
                        <span className="name">{editedName}</span>
                        <br />
                        <span className="phone">{editedPhone}</span>
                        <br />
                    </>
                )}
                <br />
                <div className="btn-pd">
                    {isEditing ? (
                        <>
                            <button
                                type="submit"
                                className="btn"
                                onClick={handleSaveClick}
                                onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
                                onMouseOut={(e) => (e.target.style.cursor = 'auto')}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn"
                                onClick={handleEditClick}
                                onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
                                onMouseOut={(e) => (e.target.style.cursor = 'auto')}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn"
                                onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
                                onMouseOut={(e) => (e.target.style.cursor = 'auto')}
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>

                            {showConfirmModal && (
                                <div className="confirm-modal">
                                    <div className="modal-content">
                                        <p>Are you sure you want to delete this contact?</p>
                                        <div className="modal-buttons">
                                            <button onClick={handleConfirmDelete} className="confirm-button">
                                                Yes, Delete
                                            </button>
                                            <button onClick={handleCancelDelete} className="cancel-button">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}
