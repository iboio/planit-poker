import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {CreateRoomRequest} from "@/interfaces/room.ts";
import {createRoom} from "@/services/api.ts";

const CreatePlanit = () => {
    const navigate = useNavigate();
    const [roomRule, setRoomRule] = React.useState("");
    const [roomName, setRoomName] = React.useState("");
    const [newTask, setNewTask] = React.useState("");
    const [error, setError] = React.useState("");
    const [tasks, setTasks] = React.useState<string[]>([]);
    const [incAmount, setIncAmount] = React.useState("");
    const [wantTasks, setWantTasks] = React.useState(false);

    const handleCreateRoom = async () => {
        const roomData: CreateRoomRequest = {
            roomName,
            roomRule,
            tasks: wantTasks ? tasks : [],
            incAmount: incAmount,
            showTask: wantTasks
        };

        try {
            const response = await createRoom(roomData);
            localStorage.setItem('key', response.key);
            localStorage.setItem('sessionId', response.sessionId);
            navigate(`/${response.sessionId}`);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    const validateForm = () => {
        if (roomName.trim() === "") {
            setError("Room name cannot be empty.");
            return;
        }
        if (roomName.length > 50) {
            setError("Room name cannot exceed 50 characters.");
            return;
        }
        if (roomRule.trim() === "") {
            setError("You must select a room rule.");
            return;
        }
        if (roomRule === "arithmetic" && (incAmount.trim() === "" || isNaN(Number(incAmount)))) {
            setError("You must enter a valid number for increase amount.");
            return;
        }
        if (wantTasks && tasks.length === 0) {
            setError("You must add at least one task.");
            return;
        }

        setError(""); // temizle
        handleCreateRoom();
    };

    const handleAddTask = () => {
        const trimmedTask = newTask.trim();
        if (trimmedTask) {
            setTasks(prev => [...prev, trimmedTask]);
            setNewTask("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTask();
        }
    };
    return (
        <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900">Create Planit Poker Room</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 text-base">
                    {error && (
                        <p className="text-red-500 text-base mb-2">{error}</p>
                    )}
                    <div>
                        <Label className="p-2 text-gray-700" htmlFor="roomname">Room Name</Label>
                        <Input
                            id="roomname"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Name of your room"
                        />
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id="wantTasks"
                            checked={wantTasks}
                            onCheckedChange={() => setWantTasks(!wantTasks)}
                        />
                        <Label htmlFor="wantTasks" className="text-gray-700">I want to add tasks</Label>
                    </div>

                    {wantTasks && (
                        <div className="space-y-3">
                            <div>
                                <Label className="p-1 text-gray-700" htmlFor="newtask">Add Task</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="newtask"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter a task and press Enter"
                                    />
                                    <Button onClick={handleAddTask} variant="outline">Add</Button>
                                </div>
                            </div>
                            {tasks.length > 0 && (
                                <div className="bg-gray-100 rounded-md p-3 space-y-2">
                                    {tasks.map((task, index) => (
                                        <div key={index} className="text-sm text-gray-700">
                                            • {task}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <Label className="p-1 text-gray-700" htmlFor="roomrule">Room Rule</Label>
                        <Select onValueChange={(value) => setRoomRule(value)}>
                            <SelectTrigger
                                id="roomrule"
                                className="w-full h-10 px-3 text-sm border rounded-md">
                                <SelectValue placeholder="Select rule type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="fibonacci">Fibonacci</SelectItem>
                                <SelectItem value="arithmetic">Arithmetic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {roomRule === "arithmetic" && (
                        <div>
                            <Label htmlFor="incamount" className="text-gray-700">Increase Amount</Label>
                            <Input
                                id="incamount"
                                value={incAmount}
                                onChange={(e) => setIncAmount(e.target.value)}
                                placeholder="e.g. 3"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="pt-6">
                <Button className="w-full text-base py-4 rounded-lg" onClick={validateForm}>
                    Create Room
                </Button>
            </CardFooter>
        </Card>
    );
}
export default CreatePlanit