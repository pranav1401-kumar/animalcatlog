export class ImageHover {
    private static overlay: HTMLElement;
    private static image: HTMLImageElement;
    private static caption: HTMLElement;

    static initialize(): void {
        // Create overlay elements
        this.overlay = document.createElement('div');
        this.overlay.className = 'image-hover-overlay';
        
        this.image = document.createElement('img');
        this.image.className = 'image-hover-enlarged';
        
        this.caption = document.createElement('div');
        this.caption.className = 'image-hover-caption';
        
        this.overlay.appendChild(this.image);
        this.overlay.appendChild(this.caption);
        document.body.appendChild(this.overlay);
    }

    static show(src: string, caption: string): void {
        this.image.src = src;
        this.caption.textContent = caption;
        this.overlay.style.display = 'flex';
    }

    static hide(): void {
        this.overlay.style.display = 'none';
    }
}