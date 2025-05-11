import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as React from "react";
import {registerRoom} from "@/services/api.ts";
import {getUserField} from "@/services/helper.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useEffect} from "react";

interface SetUsernameProps {
    showRoom: (showRoom: boolean) => void;
}

export default function SetUsername({showRoom}: SetUsernameProps) {
    const [username, setUsername] = React.useState("");
    const [isUsernameLoading, setIsUsernameLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [userRole, setUserRole] = React.useState("");
    const [customRoleState, setCustomRoleState] = React.useState(false);

    useEffect(() => {
        if (userRole === 'Custom') {
            setUserRole("");
            setCustomRoleState(true);
        }
    }, [userRole]);

    const handleSetUsername = async () => {
        try {
            if (!username.trim()) {
                setError('Username cannot be empty');
                return;
            }

            if (!userRole) {
                setError('Please select a role');
                return;
            }

            if(customRoleState && !userRole.trim()) {
                setError('Custom role cannot be empty');
                return;
            }
            setIsUsernameLoading(true);
            const user = getUserField();
            const response = await registerRoom({...user,username: username, role: userRole});
            if (response.status === 'USERNAME_EXIST') {
                setError('Username already exists in this room');
            } else {
                localStorage.setItem('username', username);
                localStorage.setItem('role', userRole);
                showRoom(false);
            }
        } catch (error) {
            console.error('Set username failed:', error);
            setError('Failed to set username');
        } finally {
            setIsUsernameLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4">
            <div className="w-[400px] space-y-4">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isUsernameLoading}
                />
                <Select onValueChange={(value) => {
                    setCustomRoleState(value === "Custom");
                    setUserRole(value === "Custom" ? "" : value);
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
                {customRoleState && (
                    <Input
                        id="customRole"
                        placeholder="Enter your custom role"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                        disabled={isUsernameLoading}
                    />
                )}
                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}
                <Button
                    onClick={handleSetUsername}
                    className="w-full"
                    disabled={isUsernameLoading}
                >
                    {isUsernameLoading ? 'Joining...' : 'Join Room'}
                </Button>
            </div>
        </div>
    )
}