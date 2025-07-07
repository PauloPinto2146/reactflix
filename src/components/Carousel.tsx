import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState, type FC } from "react"
import Card from "./Card"

interface CarouselProps {
    title: string
    items: Movie[]

}

const Carousel: FC<CarouselProps> = ({ items, title }) => {

    const carouselContainer = useRef<HTMLDivElement | null>(null);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
    const scrollAmmount: number = 320;

    useEffect(() => {
        const updateCanScrollRight = () => {
            if (carouselContainer.current) {
                const container = carouselContainer.current;
                setCanScrollRight(container.scrollLeft + container.clientWidth < container.scrollWidth);
            }
        };

        updateCanScrollRight();

        const resizeObserver = new ResizeObserver(updateCanScrollRight);

        if (carouselContainer.current) {
            resizeObserver.observe(carouselContainer.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);


    console.log(items)

    const scrollLeft = () => {
        if (carouselContainer.current) {
            const newPosition = Math.max(0, scrollPosition - scrollAmmount);
            setScrollPosition(newPosition);
            carouselContainer.current.scrollTo({
                left: newPosition,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (carouselContainer.current) {
            const newPosition = scrollPosition + scrollAmmount;
            setScrollPosition(newPosition);
            carouselContainer.current.scrollTo({
                left: newPosition,
                behavior: "smooth",
            });
        }
    };

    const handleSroll = () => {
        if (carouselContainer.current) {
            setScrollPosition(carouselContainer.current.scrollLeft)
        }
    }

    return (
        <div className="relative">
            <h1 className="mt-4 mb-2 text-white text-2xl font-semibold">
                {title}
            </h1>
            <div className="relative" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {scrollPosition > 0 && <button onClick={scrollLeft} className="absolute top-1/2 transform -translate-y-1/2
                bg-gradient-to-r from-[rgba(100,0,0,1)] bg-transparent opacity-95
                bg-opacity-50 text-white border-none p-4 cursor-pointer z-10 duration-300 
                ease-in-out hover:from-[rgba(100,0,0,0.9)] hover:bg-black transition-colors h-full left-0">
                    <ChevronLeft />
                </button>}
                {canScrollRight && (
                    <button onClick={scrollRight}
                        className="absolute top-1/2 transform -translate-y-1/2 
                    bg-gradient-to-l from-[rgba(100,0,0,1)] bg-transparent opacity-95
                    bg-opacity-50 text-white border-none p-4 cursor-pointer z-10 duration-300 
                    ease-in-out hover:from-[rgba(100,0,0,0.9)] hover:bg-black transition-colors h-full right-0">
                        <ChevronRight />
                    </button>)}
                <div ref={carouselContainer}
                    onScroll={handleSroll}
                    className="overflow-x-auto flex scroll-snap-x-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {items.filter(item=>item.backdrop_path).map((item) => (
                        <div className="scroll-snap-center flex-none mr-4">
                            <Card item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Carousel