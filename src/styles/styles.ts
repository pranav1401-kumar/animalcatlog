export const styles = `
.image-hover-container {
    position: relative;
    display: inline-block;
}

.thumbnail {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 2px solid #ddd;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.thumbnail:hover {
    border-color: #007bff;
}

.image-hover-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    z-index: 1000;
    flex-direction: column;
}

.image-hover-enlarged {
    max-width: 80%;
    max-height: 80vh;
    border: 3px solid white;
    border-radius: 8px;
}

.image-hover-caption {
    color: white;
    margin-top: 1rem;
    font-size: 1.2rem;
}

.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable:hover {
    background-color: #f8f9fa;
}

.table th {
    position: relative;
}

.controls {
    margin-bottom: 1rem;
}

.btn-group {
    gap: 0.5rem;
}
`;