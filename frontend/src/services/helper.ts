import {User} from "@/interfaces/room.ts";

export const getUserField = () => {
    return {
        username: localStorage.getItem('username') || '',
        sessionId: localStorage.getItem('sessionId') || '',
        userId: localStorage.getItem('userId') || '',
        role: localStorage.getItem('role') || 'GUEST',
    } as User;
}

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}