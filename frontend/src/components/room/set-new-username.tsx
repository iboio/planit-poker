import * as React from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import {getUserField} from "@/services/helper.ts";
import {editUser} from "@/services/api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface SetNewUsernameProps {
    onClose: (onClose: boolean) => void;
}

export default function NewUsername({onClose}: SetNewUsernameProps) {
    const [newUsername, setNewUsername] = React.useState("");
    const [newRole, setNewRole] = React.useState("");
    const [newCustomRoleState, setNewCustomRoleState] = React.useState(false);
    const [error, setError] = React.useState("");

    const  handleSetUsername = async () => {
        if (newRole.trim() == "" && newUsername.trim() == "") {
            setError('Please select a role or set new username');
            return;
        }

        if(newCustomRoleState && !newRole.trim()) {
            setError('Custom role cannot be empty');
            return;
        }

        const user = getUserField();
        const response = await editUser({
            ...user,
            newUsername: newUsername.trim() || user.username,
            newRole: newRole.trim() || (localStorage.getItem("role") ?? ""),
        });
        if (response.status === 'USERNAME_EXIST') {
            setError("Username already exists in this room");
            return;
        }
        if (newRole.trim() !== "") {
            localStorage.setItem("role", newRole);

        }
        if (newUsername.trim() !== "") {
            localStorage.setItem("username", newUsername);
        }
        onClose(false);
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex-row">
                <div className="relative flex mb-8">
                    <Button onClick={() => onClose(false)} variant="ghost" size="icon" className="absolute right-0">
                        <X className="h-5 w-5"/>
                    </Button>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="p-1">
                            <Label htmlFor="addtask">Username</Label>
                            <Input
                                className="w-full mt-1 p-2"
                                id="addtask"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="Enter your new username"
                            />
                        </div>
                        <div className="p-1">
                            <Label className="w-full mt-1 p-1" htmlFor="addtask">Role</Label>
                            <Select
                                onValueChange={(value) => {
                                    setNewCustomRoleState(value === "Custom");
                                    setNewRole(value === "Custom" ? "" : value);
                                }}>
                                <SelectTrigger
                                    id="role"
                                    className="w-full h-10 px-3 text-sm border rounded-md">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="QA">QA</SelectItem>
                                    <SelectItem value="Developer">Developer</SelectItem>
                                    <SelectItem value="Designer">Designer</SelectItem>
                                    <SelectItem value="PM">PM</SelectItem>
                                    <SelectItem value="Guest">Guest</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={handleSetUsername}>Set New User Settings</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}