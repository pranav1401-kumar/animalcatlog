import { Animal } from './models/Animal';
import { TableConfig } from './models/TableConfig';
import { AnimalTable } from './components/AnimalTable';
import { ImageHover } from './components/ImageHover';
import { bigCatsData } from './data/bigCats';
import { dogsData } from './data/dogs';
import { bigFishData } from './data/bigFish';
import { styles } from './styles/styles';

// Initialize styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize ImageHover
ImageHover.initialize();

// Table configurations
const bigCatsConfig: TableConfig = {
    title: 'Big Cats',
    sortableFields: ['species', 'name', 'size', 'location'],
    nameStyle: 'normal'
};

const dogsConfig: TableConfig = {
    title: 'Dogs',
    sortableFields: ['name', 'location'],
    nameStyle: 'bold'
};

const bigFishConfig: TableConfig = {
    title: 'Big Fish',
    sortableFields: ['size'],
    nameStyle: 'bold-italic-blue'
};

// Initialize tables
const bigCatsTable = new AnimalTable('bigCatsTable', bigCatsData, bigCatsConfig);
const dogsTable = new AnimalTable('dogsTable', dogsData, dogsConfig);
const bigFishTable = new AnimalTable('bigFishTable', bigFishData, bigFishConfig);