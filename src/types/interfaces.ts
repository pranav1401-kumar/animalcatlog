export interface BaseAnimal {
    name: string;
    size: number;
    type: string;
    age: number;
}

export interface Animal extends BaseAnimal {
    id: string;
    [key: string]: string | number;
}

export interface TableConfig {
    nameStyle: Record<string, string>;  // e.g., { header: 'font-bold', cell: 'text-blue-500' }
    sortableFields: Array<keyof Animal>;
}