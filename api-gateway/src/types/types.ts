
export interface Promotion {
    id: number;
    name: string;
    startYear: Date;
    endYear: Date;
}

export interface CreatePromotion {
    name: string;
    startYear: Date;
    endYear: Date;
}