import React from 'react';
import { Coffee, HelpCircle } from 'lucide-react'; // Lucide iconları

interface Card {
    key: string;
    value: string;
}

interface CardBoxProps {
    card: Card;
    onCardClick: (key: string, value: string) => void;
    isActive: boolean;
    show: boolean;
}

const CardBox: React.FC<CardBoxProps> = ({ card, onCardClick, isActive, show }) => {
    let activeStatus = isActive;
    const cardKeyInStorage = localStorage.getItem('cardKey');

    if (cardKeyInStorage === card.key) {
        activeStatus = true;
    }

    const handleClick = () => {
        if (!show) {
            onCardClick(card.key, card.value);
            sessionStorage.setItem('cardKey', card.key);
        }
    };

    const renderContent = () => {
        if (card.value.toLowerCase() === 'coffee') {
            return <Coffee className="w-10 h-10" />;
        }
        if (card.value.toLowerCase() === 'unknown') {
            return <HelpCircle className="w-10 h-10" />;
        }
        return (
            <p className={`text-3xl font-bold ${activeStatus ? 'text-white' : 'text-gray-800'}`}>
                {card.value}
            </p>
        );
    };

    return (
        <div
            className={`border-2 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 w-1/5 h-64
        ${activeStatus ? 'bg-blue-500 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-300'}
        ${show ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-xl'}`}
            onClick={handleClick}
        >
            {renderContent()}
        </div>
    );
};

export default CardBox;
