interface ReadingPlanCardProps {
  title: string;
  subtitle: string;
  progress: number;
  currentDay: number;
  totalDays: number;
  barColorClass?: string;
  circleColorClass?: string;
}

export const ReadingPlanCard = ({
  title,
  subtitle,
  progress,
  currentDay,
  totalDays,
  barColorClass = "bg-secondary",
  circleColorClass = "bg-secondary/10 group-hover:bg-secondary/20"
}: ReadingPlanCardProps) => {
  return (
    <div className="bg-[#252525] p-5 rounded-lg border border-white/5 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -mr-4 -mt-4 transition-all ${circleColorClass}`}></div>
      <h3 className="font-bold text-white relative z-10">
        {title}
      </h3>
      <p className="text-xs text-gray-400 mb-4 relative z-10">
        {subtitle}
      </p>

      <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-2 relative z-10">
        <div className={`${barColorClass} h-full`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase relative z-10">
        <span>{progress}% Concluído</span>
        <span>Dia {currentDay}/{totalDays}</span>
      </div>
    </div>
  );
};
