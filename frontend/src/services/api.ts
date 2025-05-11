import axios from 'axios';
import {CreateRoomRequest, RoomData, Task} from "@/interfaces/room.ts";

let API_URL = 'http://192.168.1.11:3000/api';
fetch('/config.json')
    .then(res => res.json())
    .then(cfg => {
        if (cfg.API_URL) {
            API_URL = cfg.API_URL;
        }
    });

interface CreateRoomResponse {
    sessionId: string;
    key: string;
}

interface User {
    username: string;
    sessionId: string;
    userId: string;
}

interface StatusResponse {
    status: 'ROOM_NOT_FOUND' | 'NEW_USER' | 'RECONNECTED' | 'USERNAME_EXIST' | 'USERNAME_OK';
}

interface Register extends User{
    role: string;
}

interface VoteRequest {
    sessionId: string;
    userId: string;
    username: string;
    role: string;
    card: {
        key: string;
        value: string;
    };
}

interface nextTask extends User {
    type: string
    votingTask: Task;
}
interface EditUser extends User {
    newRole: string;
    newUsername: string;
}
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createRoom = async (data: CreateRoomRequest): Promise<CreateRoomResponse> => {
    const response = await api.post('/createRoom', data);
    return response.data as CreateRoomResponse;
};

export const securityCheck = async (user: User): Promise<StatusResponse> => {
    const response = await api.post('/check', user);
    return response.data as StatusResponse;
};

export const getRoomData = async (sessionId: string, headers: { [key: string]: string }): Promise<RoomData> => {
    const response = await api.get(`/room/${sessionId}`, {headers});
    return response.data as RoomData;
};

export const registerRoom = async (user: Register): Promise<StatusResponse> => {
    const response = await api.post('/registerRoom', user);
    return response.data as StatusResponse;
};

export const sendVote = async (vote: VoteRequest): Promise<{ votedUsers: string[] }> => {
    const response = await api.post('/room/vote', vote);
    return response.data as { votedUsers: string[] };
};

export const showVotes = async (user: User): Promise<void> => {
    await api.post('/room/showVotes', user);
};

export const nextTask = async (nextTask: nextTask): Promise<void> => {
    await api.post('/room/nextTask', nextTask);
};

export const editUser = async (user: EditUser): Promise<StatusResponse> => {
    const response = await api.post('/room/editUser', user);
    return response.data as StatusResponse;
}

export const feedBack = async (data: { email: string; message: string }): Promise<void> => {
    await api.post('/feedback', data);
}

export const getGaID = async (): Promise<{ GA_ID: string }> => {
    const response = await api.get(`/ga`);
    return response.data.GA_ID;
}