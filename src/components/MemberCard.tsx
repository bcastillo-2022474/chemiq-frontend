const Card = ({ imageUrl, hoverText, cargo }) => (
    <div className="relative overflow-hidden rounded-lg shadow-lg group aspect-w-3 aspect-h-4">
        <img
            src={imageUrl}
            alt="Card"
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-30"
        />
        <div className="absolute inset-0 bg-accent bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
            <div className="flex flex-col items-center space-y-4">
                <p className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl text-center mb-8 text-white">
                    {hoverText}
                </p>

                <p className="text-md font-bold tracking-tighter sm:text-xl md:text-xl text-center mb-8 text-white">
                    {cargo}
                </p>
            </div>
        </div>

    </div>
);

const MemberCard = ({ cards }) => {
    return (
        <div className="container mx-auto px-5 py-3">
            <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <Card key={index} imageUrl={card.imageUrl} hoverText={card.hoverText} cargo={card.cargo} />
                ))}
            </div>
        </div>
    );
};

export default MemberCard;

