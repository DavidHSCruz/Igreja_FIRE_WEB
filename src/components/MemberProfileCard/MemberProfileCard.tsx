import { FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { User } from "../../contexts/AuthContext";

import { ActivityItem } from "./ActivityItem";

export interface Activity {
  name: string;
  icon: React.ReactNode;
  link?: string;
  type?: "area" | "ministerio" | "curso";
  details?: string;
}

interface MemberProfileCardProps {
  isProfilePage?: boolean;
  user: User | null;
  activities?: Activity[];
}

export const MemberProfileCard: React.FC<MemberProfileCardProps> = ({
  isProfilePage = false,
  user,
  activities: propActivities
}) => {

  const memberMinisterios = user?.membro?.ministerios || [];
  const memberAreas = user?.membro?.areas || [];

  const [currentView, setCurrentView] = useState<"Áreas" | "Ministérios" | "Cursos">("Áreas");

  const computedActivities: Activity[] = [
    ...memberMinisterios.map((m) => ({
      name: m.name,
      icon: <FaUser className="text-sm" />,
      link: `/areamembro/details/ministerio/${m.id}`,
      type: "ministerio" as const,
    })),
    ...memberAreas.map((a) => ({
      name: a.name,
      icon: <FaUser className="text-sm" />,
      link: `/areamembro/details/area/${a.id}`,
      type: "area" as const,
    })),
  ];

  // Use props activities if provided, otherwise use computed ones
  const activities = propActivities || computedActivities;

  const filteredActivities = activities.filter((activity) => {
    // If using custom activities (propActivities), show all or apply custom filtering if needed
    // For now, if propActivities is present, we ignore the view filter unless types are provided
    if (propActivities) return true;

    if (currentView === "Áreas") return activity.type === "area";
    if (currentView === "Ministérios") return activity.type === "ministerio";
    if (currentView === "Cursos") return activity.type === "curso";
    return false;
  });

  const handlePrev = () => {
    if (currentView === "Áreas") setCurrentView("Ministérios");
    else if (currentView === "Ministérios") setCurrentView("Cursos");
    else setCurrentView("Áreas");
  };

  const handleNext = () => {
    if (currentView === "Áreas") setCurrentView("Ministérios");
    else if (currentView === "Ministérios") setCurrentView("Cursos");
    else  setCurrentView("Áreas");
  };

  if (!user) {
      return (
          <div className="bg-[#161616] rounded-xl flex flex-col items-center text-center overflow-hidden border border-white/5 p-6">
              <div className="animate-pulse flex flex-col items-center w-full">
                  <div className="w-20 h-20 bg-white/10 rounded-full mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/3"></div>
              </div>
          </div>
      );
  }

  const isMember = user?.membro;

  const displayRole = user?.systemRole
    ? user.systemRole.replace(/_/g, " ")
    : "Visitante";

  return (
    <div className="bg-[#161616] rounded-xl flex flex-col items-center text-center overflow-hidden border border-white/5">
      {/* Cabeçalho Vermelho */}
      <div className="w-full h-24 bg-secondary relative">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-[#161616]">
          <FaUser className="text-4xl text-black" />
        </div>
      </div>

      <div className="pt-12 pb-6 px-6 w-full">
        <h2 className="text-lg font-bold text-white">
          {isMember
            ? (() => {
                const parts = user.membro?.nome.split(" ") || [];
                return parts.length > 1
                  ? `${parts[0]} ${parts[parts.length - 1]}`
                  : parts[0];
              })()
            : "Visitante"}
        </h2>
        <p className="text-[10px] text-gray-400 mb-4 uppercase tracking-wide">
          {displayRole}
        </p>

        <div className="w-full h-px bg-white/10 mb-4"></div>

        {isMember && (
          <>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={handlePrev}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaChevronLeft size={12} />
              </button>
              <h3 className="text-gray-300 text-sm w-24">{currentView}</h3>
              <button
                onClick={handleNext}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaChevronRight size={12} />
              </button>
            </div>

            <div className="space-y-3 mb-6 min-h-[60px]">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    name={activity.name}
                    icon={activity.icon}
                    link={activity.link}
                    details={activity.details}
                  />
                ))
              ) : (
                <p className="text-xs text-gray-500 italic py-2">
                  Nenhum item em {currentView}
                </p>
              )}
            </div>

            <div className="w-full h-px bg-white/10 mb-4"></div>
          </>
        )}

        {/* View Profile Button - Only show if NOT profile page AND NOT visitor */}
        {!isProfilePage && isMember && (
          <Link
            to="/areamembro/profile"
            className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-wider"
          >
            View Profile
          </Link>
        )}
      </div>
    </div>
  );
};
