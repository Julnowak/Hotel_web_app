interface Reservation {
    reservation_id : number;
    price: number;
    status: string
    check_in : string;
    check_out: string;
    is_paid: boolean;
    room_floor: number
    room: number;
    user: string;
    people_number: number;
}