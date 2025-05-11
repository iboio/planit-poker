import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";
import { Task } from "@/interfaces/room.ts";

interface TaskTableProps {
    tasks: Task[];
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
    const votingTask = tasks.filter(task => task.taskStatus === "VOTING");
    const waitingTask = tasks.filter(task => task.taskStatus === "WAITING");
    const completedTask = tasks.filter(task => task.taskStatus === "COMPLETED");
    const taskStatus = (status: string) => {
        switch (status)
        {
            case "WAITING":
                return <span className="inline-flex justify-center w-20 items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Waiting</span>
            case "VOTING":
                return <span className="inline-flex justify-center w-20 items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Voting</span>
            case "COMPLETED":
                return <span className="inline-flex justify-center w-20 items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Completed</span>
        }
    }
    return (
        <div className="rounded-md border overflow-auto">
            <Table className={"table-fixed w-full"}>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="col-span-2 py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Description</TableHead>
                        <TableHead className="col-span-2 py-3 px-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {votingTask.map((task, index) => (
                        <TableRow key={index}>
                            <TableCell className="col-span-6 py-3 px-2 text-sm font-medium">{task.task}</TableCell>
                            <TableCell className="col-span-2 py-3 px-2">{taskStatus(task.taskStatus)}</TableCell>
                        </TableRow>
                    ))}
                    {waitingTask.map((task, index) => (
                        <TableRow key={index}>
                            <TableCell className="col-span-6 py-3 px-2 text-sm font-medium">{task.task}</TableCell>
                            <TableCell className="col-span-2 py-3 px-2">{taskStatus(task.taskStatus)}</TableCell>
                        </TableRow>
                    ))}
                    {completedTask.map((task, index) => (
                        <TableRow key={index}>
                            <TableCell className="col-span-6 py-3 px-2 text-sm font-medium">{task.task}</TableCell>
                            <TableCell className="col-span-2 py-3 px-2">{taskStatus(task.taskStatus)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableBody>
                    {tasks.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="py-6 text-center text-gray-500">
                                No tasks available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TaskTable;