export enum Role {
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    DRIVER = 'DRIVER',
    USER = 'USER',
}

export enum ReservationStatus {
    NEW = 'NEW',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERING = 'DELIVERING',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}
