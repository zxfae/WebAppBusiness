import React from 'react';

const FootUser: React.FC = () => {
    return (
        <div className="relative overflow-hidden rounded-lg shadow-xl h-24">
            <div className="overflow-hidden absolute inset-0 z-10" />
            <div className="relative z-20 flex flex-col justify-center h-full px-8">
                <h1 className="text-right text-xl font-bold text-black mb-2 ml-auto">
                    Developped By ZxFae33
                </h1>
            </div>
            <div className="bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-tl-full" />
        </div>
    );
};

export default FootUser;