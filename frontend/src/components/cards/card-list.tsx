import React from 'react';
import CardBox from "@/components/cards/card";

interface Card {
    key: string;
    value: string;
}

interface CardListProps {
    cards: Card[];
    onCardClick: (key: string, value: string) => void;
    show: boolean;
    resetSignal?: number;
}

const CardList: React.FC<CardListProps> = ({ cards, onCardClick, show, resetSignal }) => {
    const [activeCardKey, setActiveCardKey] = React.useState<string | null>(null);

    React.useEffect(() => {
        const savedCardKey = localStorage.getItem('cardKey');
        if (savedCardKey) {
            setActiveCardKey(savedCardKey);
        }
    }, []);

    React.useEffect(() => {
        setActiveCardKey(null);
    }, [resetSignal]);

    const handleCardClick = (key: string, value: string) => {
        setActiveCardKey(key);
        onCardClick(key, value);
        localStorage.setItem('cardKey', key);
    };

    return (
        <div className="flex flex-wrap justify-center gap-8">
            {cards.map((card) => (
                <CardBox
                    key={card.key}
                    card={card}
                    isActive={activeCardKey === card.key}
                    onCardClick={handleCardClick}
                    show={show}
                />
            ))}
        </div>
    );
};

export default CardList;