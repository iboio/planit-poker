import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Users} from "lucide-react";
import {Message, RoomUser} from "@/interfaces/room.ts";


interface ChatComponentProps {
    users: RoomUser[];
    messages: Message[];
    onSendMessage: (message: string) => void;
}

export default function ChatComponent({ messages, onSendMessage, users }: ChatComponentProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState("");
    const [unreadCount, setUnreadCount] = React.useState(2);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    React.useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            // Chat açıldığında en son mesaja scroll et
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [isOpen]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage?.(newMessage);
            setNewMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const timeFormater = (rawDate: Date) => {
        const date = new Date(rawDate);
        return new Intl.DateTimeFormat('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Europe/Istanbul', // Local timezone
        }).format(date);
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <Card className="absolute bottom-16 right-0 w-96 h-[500px] shadow-2xl border bg-white">
                    <CardHeader className="pb-3 bg-gray-900 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Team Chat
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleToggle}
                                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {users.length} User
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Online
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 flex flex-col h-[400px]">
                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4 min-h-0">
                            <div className="space-y-3">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center py-12">
                                        <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-500 mb-2">No message yet</h3>
                                        <p className="text-sm text-gray-400">Start the conversation by sending the first message!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`flex gap-3 ${msg.type === 'system' ? 'justify-center' : ''}`}>
                                            {msg.type === 'system' ? (
                                                <div className="bg-gray-100 text-gray-600 text-xs px-3 py-2 rounded-full">
                                                    {msg.message}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                        {msg.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-sm text-gray-900">{msg.username + " / " + msg.role}</span>
                                                            <span className="text-xs text-gray-500">{timeFormater(msg.timestamp)}</span>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 break-words">
                                                            {msg.message}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="border-t p-4 bg-gray-50 flex-shrink-0">
                            <div className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Mesajınızı yazın..."
                                    className="flex-1 border-gray-300 focus:border-gray-500"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    size="sm"
                                    className="bg-gray-800 hover:bg-gray-700 text-white flex-shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Chat Toggle Button */}
            <Button
                onClick={handleToggle}
                className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 relative"
            >
                <MessageCircle className="w-6 h-6 text-white" />
                {unreadCount > 0 && !isOpen && (
                    <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-500 text-white text-xs p-0 flex items-center justify-center">
                        {unreadCount}
                    </Badge>
                )}
            </Button>
        </div>
    );
}