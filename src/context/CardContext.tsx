import { createContext, useContext, useState, type FC, type ReactNode } from "react";

interface CardState {
    item: Movie | null;
    isHovered: boolean;
    cardId: number | null;
    position?: { x: number, y: number };
}

interface CardContextType {
    cardState: CardState;
    setCardState: React.Dispatch<React.SetStateAction<CardState>>;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const CardProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [cardState, setCardState ] = useState<CardState>({
        item: null,
        isHovered: false,
        cardId: null,
        position: { x: -1000, y: 0 },
    });

    return (
        <CardContext.Provider value={{cardState, setCardState} as any}>
            {children}
        </CardContext.Provider>
    );
};

export const useCardContext = () =>{
    const context = useContext(CardContext)

    if(!context){
        throw new Error("useCardContext must be used within a CardProvider");
    }

    return context;
}