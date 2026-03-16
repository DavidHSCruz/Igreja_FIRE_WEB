import { useRef, useState, MouseEvent } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus } from "react-icons/fa";
import { ScaleCard, ScaleGroup } from "../ScaleCard/ScaleCard";
import { useAppSelector } from "../../store/hooks";

interface ScalesCarouselProps {
  scales: ScaleGroup[];
  titulo?: string;
  onJoin?: (scaleId: string) => void;
  onConfirm?: (scaleId: string, membroId: string) => void;
  onCreateScale?: () => void;
  onEditScale?: (scale: ScaleGroup) => void;
}

export const ScalesCarousel = ({
  scales,
  titulo = "Escalas",
  onJoin,
  onConfirm,
  onCreateScale,
  onEditScale,
}: ScalesCarouselProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const allowedRoles = ["ADMIN", "PASTOR", "LIDER"];
  const canCreateScale =
    user?.systemRole && allowedRoles.includes(user.systemRole);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef;
      const scrollAmount = current.clientWidth / 2; // Scroll half view width
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="space-y-6">
      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="w-full flex items-center gap-3 pb-2 border-b border-white/10">
          <h3 className="text-sm text-gray-300">{titulo}</h3>
          {canCreateScale && (
            <button
              onClick={
                onCreateScale ||
                (() =>
                  alert("Funcionalidade de criar escala em desenvolvimento"))
              }
              className="flex items-center gap-1 text-[10px] bg-green-600/20 hover:bg-green-600/30 text-green-500 hover:text-green-400 px-2 py-0.5 rounded-full transition-colors border border-green-600/20"
              title="Criar nova escala"
            >
              <FaPlus size={8} />
              <span>Nova</span>
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="bg-[#202020] hover:bg-[#303030] p-2 rounded-full text-white transition-colors border border-white/10"
          >
            <FaChevronLeft size={10} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-[#202020] hover:bg-[#303030] p-2 rounded-full text-white transition-colors border border-white/10"
          >
            <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
        `}</style>
        {scales.length > 0 ? (
          scales.map((scaleGroup) => (
            <ScaleCard
              key={scaleGroup.id}
              scale={scaleGroup}
              className="min-w-[90%] md:min-w-[calc(50%-0.75rem)] shrink-0 select-none"
              onJoin={onJoin}
              onConfirm={onConfirm}
              onEdit={onEditScale}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            Nenhuma escala programada.
          </p>
        )}
      </div>
    </section>
  );
};
