import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";
import {RoomUser, Vote} from "@/interfaces/room.ts";

interface UserTableProps {
    votes: Vote[];
    votedUsers: string[];
    show: boolean;
    activeUsers: RoomUser[];
    allUsers: RoomUser[];
}

const UserTable: React.FC<UserTableProps> = ({allUsers, activeUsers, votes, votedUsers, show}) => {
    // Function to get a user's vote value
    function getUserVote(username: string) {
        const userVote = votes.find(vote => vote.username === username);
        return userVote ? userVote.card.value : "not voted";
    }

    const tableCellValue = (user: string) => {
        if (!activeUsers.some((activeUser) => activeUser.username === user)) {
            return (
                <span className="inline-flex justify-center w-20 items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Disconnect</span>
            )
        }
        if (votedUsers.includes(user)) {
            return (
                <span className="inline-flex justify-center w-20 items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Voted</span>
            )
        }
        return (
            <span className="inline-flex justify-center w-20 items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Thinking...</span>
        )
    }

    return (
        <div className="rounded-md border overflow-auto">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead
                            className="col-span-6 py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User</TableHead>
                        <TableHead
                            className="col-span-2 py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                        <TableHead
                            className="col-span-2 py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</TableHead>
                        {show && <TableHead
                            className="col-span-2 py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vote</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allUsers.map((user, index) => (
                        <TableRow key={index} className="bg-blue-50">
                            <TableCell className="col-span-6 py-3 px-2 text-sm font-medium">{user.username}</TableCell>
                            <TableCell className="col-span-2 py-3 px-2">
                                {tableCellValue(user.username)}
                            </TableCell>
                            <TableCell className="col-span-2 py-3 px-2 text-sm">
                                {user.role}
                            </TableCell>
                            {show && (
                                <TableCell className="col-span-2 py-3 px-2 text-sm">
                                    {getUserVote(user.username)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}

                    {/* Show empty state if no users */}
                    {allUsers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={show ? 12 : 10} className="py-6 text-center text-gray-500">
                                No users available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default UserTable;