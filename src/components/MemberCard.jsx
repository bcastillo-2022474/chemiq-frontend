import React from 'react';

const Card = ({ imageUrl, hoverText, cargo }) => (
    <div className="relative overflow-hidden rounded-lg shadow-lg group aspect-w-3 aspect-h-4">
        <img
            src={imageUrl}
            alt="Card"
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-30"
        />
        <div className="absolute inset-0 bg-accent bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
            <div className="flex flex-col items-center space-y-4">
                <p className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl text-center mb-8 text-white">
                    {hoverText}
                </p>

                <p className="text-1xl font-bold tracking-tighter sm:text-2xl md:text-2xl text-center mb-8 text-white">
                    {cargo}
                </p>
            </div>
        </div>

    </div>
);

const MemberCard = ({ cards }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <Card key={index} imageUrl={card.imageUrl} hoverText={card.hoverText} cargo={card.cargo} />
                ))}
            </div>
        </div>
    );
};

export default MemberCard;

