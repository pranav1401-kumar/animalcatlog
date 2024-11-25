import { Animal } from '../models/Animal';
import { TableConfig } from '../models/TableConfig';
import { ImageHover } from './ImageHover';

export interface AnimalData extends Animal {
    species: string;
    name: string;
    size: number;
    location: string;
    image: string;
}

export class AnimalTable {
    private data: AnimalData[];
    private config: TableConfig;
    private tableElement: HTMLElement;
    private currentSort: { field: string; ascending: boolean } | null = null;
    private bootstrap: any;

    constructor(
        containerId: string,
        initialData: AnimalData[],
        config: TableConfig
    ) {
        this.data = [...initialData];
        this.config = config;
        const element = document.getElementById(containerId);
        if (!element) {
            throw new Error(`Container with ID ${containerId} not found`);
        }
        this.tableElement = element;
        this.initialize();
    }

    private async initialize(): Promise<void> {
        try {
            this.bootstrap = await import('bootstrap');
        } catch (error) {
            console.error('Failed to load Bootstrap:', error);
        }
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners(): void {
        this.tableElement.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.matches('.sortable')) {
                const field = target.getAttribute('data-field');
                if (field) {
                    this.sortBy(field);
                }
            }
        });
    }

    private render(): void {
        const table = document.createElement('table');
        table.className = 'table table-bordered table-hover';
        
        // Add table header and body
        table.appendChild(this.createHeader());
        table.appendChild(this.createBody());

        // Clear and rebuild table content
        this.tableElement.innerHTML = '';
        this.tableElement.appendChild(this.createControls());
        this.tableElement.appendChild(table);
    }

    private createHeader(): HTMLElement {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');

        const headers = ['Species', 'Name', 'Size', 'Location', 'Image', 'Actions'];
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            
            const field = header.toLowerCase();
            if (this.config.sortableFields.includes(field)) {
                th.className = 'sortable';
                th.setAttribute('data-field', field);
                
                // Add sort indicator if this field is currently sorted
                if (this.currentSort?.field === field) {
                    th.className += this.currentSort.ascending ? ' sort-asc' : ' sort-desc';
                }
            }
            
            tr.appendChild(th);
        });

        thead.appendChild(tr);
        return thead;
    }

    private createBody(): HTMLElement {
        const tbody = document.createElement('tbody');
        
        this.data.forEach((animal, index) => {
            const tr = document.createElement('tr');
            
            // Add data cells
            tr.appendChild(this.createCell(animal.species));
            tr.appendChild(this.createNameCell(animal.name));
            tr.appendChild(this.createCell(`${animal.size} ft`));
            tr.appendChild(this.createCell(animal.location));
            tr.appendChild(this.createImageCell(animal.image, animal.name));
            tr.appendChild(this.createActionCell(index));
            
            tbody.appendChild(tr);
        });

        return tbody;
    }

    private createCell(content: string): HTMLElement {
        const td = document.createElement('td');
        td.textContent = content;
        return td;
    }

    private createNameCell(name: string): HTMLElement {
        const td = document.createElement('td');
        const span = document.createElement('span');
        span.textContent = name;
        
        switch (this.config.nameStyle) {
            case 'bold':
                span.style.fontWeight = 'bold';
                break;
            case 'bold-italic-blue':
                span.style.fontWeight = 'bold';
                span.style.fontStyle = 'italic';
                span.style.color = 'blue';
                break;
        }
        
        td.appendChild(span);
        return td;
    }

    private createImageCell(src: string, alt: string): HTMLElement {
        const td = document.createElement('td');
        const container = document.createElement('div');
        container.className = 'image-hover-container';
        
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.className = 'thumbnail';
        
        container.addEventListener('mouseenter', () => {
            ImageHover.show(src, alt);
        });
        
        container.addEventListener('mouseleave', () => {
            ImageHover.hide();
        });
        
        container.appendChild(img);
        td.appendChild(container);
        return td;
    }

    private createActionCell(index: number): HTMLElement {
        const td = document.createElement('td');
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary me-1';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => this.editAnimal(index));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => this.deleteAnimal(index));

        btnGroup.appendChild(editBtn);
        btnGroup.appendChild(deleteBtn);
        td.appendChild(btnGroup);
        return td;
    }

    private createControls(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'd-flex justify-content-between align-items-center mb-3';

        // Add button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-success';
        addBtn.textContent = 'Add New';
        addBtn.addEventListener('click', () => this.showAddForm());

        // Search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control w-25';
        searchInput.placeholder = 'Search...';
        searchInput.addEventListener('input', (e) => this.handleSearch(e));

        container.appendChild(addBtn);
        container.appendChild(searchInput);
        return container;
    }

    private handleSearch(event: Event): void {
        const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
        this.filterData(searchTerm);
    }

    private filterData(searchTerm: string): void {
        if (!searchTerm) {
            this.render();
            return;
        }

        this.data = this.data.filter(animal => 
            animal.name.toLowerCase().includes(searchTerm) ||
            animal.species.toLowerCase().includes(searchTerm) ||
            animal.location.toLowerCase().includes(searchTerm)
        );
        this.render();
    }

    private sortBy(field: string): void {
        if (!this.config.sortableFields.includes(field)) return;

        const ascending = this.currentSort?.field === field ? !this.currentSort.ascending : true;

        this.data.sort((a: AnimalData, b: AnimalData) => {
            const aVal = a[field as keyof AnimalData];
            const bVal = b[field as keyof AnimalData];
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return ascending ? aVal - bVal : bVal - aVal;
            }
            
            return ascending 
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });

        this.currentSort = { field, ascending };
        this.render();
    }

    private showAddForm(): void {
        if (!this.bootstrap?.Modal) {
            console.error('Bootstrap Modal is not available');
            return;
        }

        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal fade';
        modalDiv.id = 'addAnimalModal';
        
        modalDiv.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add New Animal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addAnimalForm">
                            <div class="mb-3">
                                <label class="form-label">Species</label>
                                <input type="text" class="form-control" name="species" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" name="name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Size (ft)</label>
                                <input type="number" class="form-control" name="size" required min="0" step="0.1">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Location</label>
                                <input type="text" class="form-control" name="location" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveNewAnimal">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);
        
        const modal = new this.bootstrap.Modal(modalDiv);
        modal.show();

        const saveButton = document.getElementById('saveNewAnimal');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const form = document.getElementById('addAnimalForm') as HTMLFormElement;
                if (form) {
                    const formData = new FormData(form);
                    const newAnimal: AnimalData = {
                        species: formData.get('species') as string,
                        name: formData.get('name') as string,
                        size: Number(formData.get('size')),
                        location: formData.get('location') as string,
                        image: 'public\images\raja.jpg'
                    };

                    if (this.validateAnimal(newAnimal)) {
                        this.addAnimal(newAnimal);
                        modal.hide();
                        modalDiv.remove();
                    }
                }
            });
        }

        modalDiv.addEventListener('hidden.bs.modal', () => {
            modalDiv.remove();
        });
    }
    addAnimal(newAnimal: AnimalData) {
        throw new Error('Method not implemented.');
    }

    private editAnimal(index: number): void {
        if (!this.bootstrap?.Modal) {
            console.error('Bootstrap Modal is not available');
            return;
        }

        const animal = this.data[index];
        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal fade';
        modalDiv.id = 'editAnimalModal';
        
        modalDiv.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Animal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editAnimalForm">
                            <div class="mb-3">
                                <label class="form-label">Species</label>
                                <input type="text" class="form-control" name="species" value="${animal.species}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" name="name" value="${animal.name}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Size (ft)</label>
                                <input type="number" class="form-control" name="size" value="${animal.size}" required min="0" step="0.1">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Location</label>
                                <input type="text" class="form-control" name="location" value="${animal.location}" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveEditedAnimal">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);
        
        const modal = new this.bootstrap.Modal(modalDiv);
        modal.show();

        const saveButton = document.getElementById('saveEditedAnimal');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const form = document.getElementById('editAnimalForm') as HTMLFormElement;
                if (form) {
                    const formData = new FormData(form);
                    const updatedAnimal: AnimalData = {
                        species: formData.get('species') as string,
                        name: formData.get('name') as string,
                        size: Number(formData.get('size')),
                        location: formData.get('location') as string,
                        image: animal.image
                    };

                    if (this.validateEdit(updatedAnimal, index)) {
                        this.data[index] = updatedAnimal;
                        this.render();
                        modal.hide();
                        modalDiv.remove();
                    }
                }
            });
        }

        modalDiv.addEventListener('hidden.bs.modal', () => {
            modalDiv.remove();
        });
    }

    private deleteAnimal(index: number): void {
        if (confirm('Are you sure you want to delete this animal?')) {
            this.data.splice(index, 1);
            this.render();
        }
    }

    private validateAnimal(animal: AnimalData): boolean {
        if (this.data.some(a => a.name.toLowerCase() === animal.name.toLowerCase())) {
            alert('An animal with this name already exists!');
            return false;
        }

        if (animal.size <= 0) {
            alert('Size must be greater than 0!');
            return false;
        }

        return true;
    }

    private validateEdit(animal: AnimalData, currentIndex: number): boolean {
        if (this.data.some((a, index) => 
            index !== currentIndex && 
            a.name.toLowerCase() === animal.name.toLowerCase()
        )) {
            alert('An animal with this name already exists!');
            return false;
        }

        if (animal.size <= 0) {
            alert('Size must be greater than 0!');
            return false;
        }

        return true;
    }
    
}