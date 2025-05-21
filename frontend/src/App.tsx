import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Home from './pages/home.tsx';
import PokerRoom from './pages/pokerRoom.tsx';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import {feedBack} from "@/services/api.ts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Window arayüzünü genişletme
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

function App() {
    const [email, setEmail] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [open, setOpen] = useState(false);

    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        feedBack({ message: feedbackText, email: email });
        setEmail('');
        setFeedbackText('');
        setOpen(false);
    };

    return (
        <SocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/:sessionId" element={<PokerRoom />} />
                </Routes>

                {/* Sağ altta Feedback butonu */}
                <div className="fixed bottom-6 right-6 z-50">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">Feedback</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>FeedBack</DialogTitle>
                                <DialogDescription>
                                    Share your feedback with us. We appreciate your input!
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <Input
                                    type="email"
                                    placeholder="Email (optional)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Textarea
                                    placeholder="Your feedback"
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    rows={4}
                                    className="max-h-[20vh] overflow-auto"
                                />
                                <DialogFooter>
                                    <Button type="submit">Send</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </Router>
        </SocketProvider>
    );
}


export default App;
