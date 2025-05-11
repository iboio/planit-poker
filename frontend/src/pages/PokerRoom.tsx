import * as React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    securityCheck,
    getRoomData,
    sendVote,
    showVotes,
    nextTask,
} from "../services/api.ts";
import {Button} from "@/components/ui/button";
import {useSocket} from "@/context/SocketContext";
import CardList from "@/components/cards/card-list";
import TaskTable from "@/components/tables/task-table";
import UserTable from "@/components/tables/user-table.tsx";
import VoteTable from "@/components/tables/vote-table";
import {RoomData, RoomUser, Task, Vote} from "@/interfaces/room.ts";
import NewUsername from "@/components/room/set-new-username.tsx";
import SetUsername from "@/components/room/set-username.tsx";
import {getUserField} from "@/services/helper.ts";
import Header from "@/components/room/header.tsx";

export default function PokerRoom() {

    const navigate = useNavigate();
    const {sessionId} = useParams();
    const socket = useSocket();

    const [isInitialLoading, setIsInitialLoading] = React.useState(true);
    const [isRoomDataLoading, setIsRoomDataLoading] = React.useState(false);

    const [showRoom, setShowRoom] = React.useState(false);
    const [error, setError] = React.useState("");
    const [resetKeySignal, setResetKeySignal] = React.useState(0);
    const [showNewUsername, setShowNewUsername] = React.useState(false);

    const [roomState, setRoomState] = React.useState<RoomData>({
        room: {
            roomRule: "",
            roomName: "",
            tasks: [],
            showTask: false,
            cards: [],
            show: false,
            activeUsers: [],
            allUsers: [],
            createdAt: new Date(),
            voteStatus: ""
        },
        userType: "",
        votes: [],
        votedUsers: []
    });

    // Initial security check
    React.useEffect(() => {
        if (!sessionId) {
            return;
        }
        localStorage.setItem('sessionId', sessionId);
        if (!socket.isConnected) {
            socket.connect();
        }
        const check = async () => {
            try {
                if (!sessionId) {
                    navigate('/');
                    return;
                }

                const user = getUserField();
                const response = await securityCheck(user);

                if (response.status === 'ROOM_NOT_FOUND') {
                    navigate('/');
                } else if (response.status === 'RECONNECTED') {
                    await fetchRoomData();
                } else if (response.status === 'NEW_USER') {
                    localStorage.removeItem('cardKey');
                    setShowRoom(true);
                }
            } catch (error) {
                console.error('Security check failed:', error);
                setError('Failed to connect to room');
            } finally {
                setIsInitialLoading(false);
            }
        };

        check().then();
    }, [navigate, sessionId, socket.connectionState]);

    // Socket event handlers for vote updates
    React.useEffect(() => {
        if (!socket) return;

        socket.on('newVote', (data: { votedUsers: string[] }) => {
            setRoomState(prev => ({
                ...prev,
                votedUsers: data.votedUsers
            }));
        });

        socket.on('newUser', (data: { activeUsers: RoomUser[], allUsers: RoomUser[] }) => {
            setRoomState(prev => ({
                ...prev,
                room: {
                    ...prev.room,
                    allUsers: data.allUsers,
                    activeUsers: data.activeUsers
                }
            }));
        });

        socket.on('showVotes', (data: { votes: Vote[] }) => {
            setRoomState(prev => ({
                ...prev,
                votes: data.votes,
                room: {
                    ...prev.room,
                    show: true
                }
            }));
        });


        socket.on('nextTask', (data: { tasks: Task[] }) => {
            setRoomState(prev => ({
                ...prev,
                votes: [],
                votedUsers: [],
                room: {
                    ...prev.room,
                    show: false,
                    tasks: data.tasks,
                }
            }));
            deleteClickedCard();
        });

        return () => {
            socket.off('newVote');
            socket.off('newUser');
            socket.off('showVotes');
            socket.off('nextTask');
        };
    }, [socket, roomState.userType]);

    // Fetch room data
    const fetchRoomData = async () => {
        try {
            setIsRoomDataLoading(true);
            const headers = {
                'x-userId': localStorage.getItem('userId') || '',
                'x-key': localStorage.getItem('key') || '',
            };
            const response = await getRoomData(sessionId || '', headers);

            setRoomState({
                room: {
                    ...response.room,
                },
                userType: response.userType,
                votedUsers: response.votedUsers,
                votes: response.votes
            });
        } catch (error) {
            console.error('Failed to fetch room data:', error);
            setError('Failed to load room data');
        } finally {
            setIsRoomDataLoading(false);
        }
    };

    const deleteClickedCard = () => {
        localStorage.removeItem('cardKey');
        setResetKeySignal(prev => prev + 1);
    };

    const handleCardClick = async (key: string, value: string) => {
        try {
            const user = getUserField();

            const voteData = {
                ...user,
                card: {
                    key,
                    value
                }
            };

            await sendVote(voteData);
        } catch (error) {
            console.error('Failed to send vote:', error);
            setError('Failed to send vote');
        }
    };

    const handleEndVote = async () => {
        try {
            const user = getUserField();
            await showVotes(user);
        } catch (error) {
            console.error('Failed to show votes:', error);
            setError('Failed to show votes');
        }
    };

    const handleNextTask = async () => {
        try {
            const user = getUserField();
            await nextTask({
                ...user,
                votingTask: roomState.room.tasks.find((t) => t.taskStatus === "voting") as Task,
                type: roomState.room.showTask ? "nextTask" : "reset"
            });
        } catch (error) {
            console.error('Failed to proceed to next task:', error);
            setError('Failed to proceed to next task');
        }
    };

    const showRoomHandler = async (showRoom: boolean) => {
        setShowRoom(showRoom);
        await fetchRoomData()
    }

    const handleShowUsernameChange = (onClose: boolean) => {
        console.log(onClose)
        setShowNewUsername(onClose);
    }

    if (isInitialLoading || isRoomDataLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (showRoom) {
        return (
            <SetUsername showRoom={showRoomHandler}></SetUsername>
        );
    }



    return (
        <div className="w-full min-h-screen box-border px-4">
            {!socket.isConnected && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                </div>
            )}
                <Header changeUsername={(change) => {
                    setShowNewUsername(change)
                }} roomName={roomState.room.roomName}/>

            {showNewUsername && <NewUsername onClose={handleShowUsernameChange}></NewUsername>}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {isRoomDataLoading ? (
                <div className="text-center py-8">
                    <div className="animate-pulse text-lg font-medium">Loading room data...</div>
                </div>
            ) : (
                <>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cards */}
                        <div className="flex-[1.5] bg-white rounded-lg shadow-md p-6">
                            <CardList
                                show={roomState.room.show}
                                cards={roomState.room.cards}
                                onCardClick={handleCardClick}
                                resetSignal={resetKeySignal}
                            />
                        </div>

                        {/* Tables */}
                        <div className="flex-1 flex flex-col gap-6 h-full">
                            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col basis-[16.6667%]"> {/* 2/12 = 16.666% */}
                                <h3 className="text-lg font-semibold mb-3">Session Controls</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={handleEndVote}
                                        disabled={roomState.room.show}
                                        className="flex-1"
                                    >
                                        Show Vote
                                    </Button>
                                    {roomState.room.show && (
                                        <Button onClick={handleNextTask} className="flex-1">
                                            {roomState.room.showTask ? "Next Task" : "Reset Voting"}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {roomState.room.showTask && (
                                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col basis-[25%]"> {/* 3/12 = 25% */}
                                    <h3 className="text-lg font-semibold mb-3">Tasks</h3>
                                    <TaskTable tasks={roomState.room.tasks || []} />
                                </div>
                            )}

                            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col basis-[25%]"> {/* 3/12 = 25% */}
                                <h3 className="text-lg font-semibold mb-3">Participants</h3>
                                <UserTable
                                    activeUsers={roomState.room.activeUsers || []}
                                    allUsers={roomState.room.allUsers || []}
                                    votedUsers={roomState.votedUsers || []}
                                    votes={roomState.votes || []}
                                    show={roomState.room.show || false}
                                />
                            </div>

                            {roomState.room.show && (
                                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col basis-[33.3333%]"> {/* 4/12 = 33.333% */}
                                    <h3 className="text-lg font-semibold mb-3">Vote Results</h3>
                                    <VoteTable votes={roomState.votes?.map((v) => ({value: v.card.value, role: v.role})) || []}/>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}