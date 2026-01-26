import { FaUser, FaChevronLeft, FaChevronRight, FaPen } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth, User } from "../../contexts/AuthContext";
import { UserAvatar } from "../UserAvatar/UserAvatar";

import { ActivityItem } from "./ActivityItem";
import { api } from "../../services/api";

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

  const { user: loggedUser, updateLocalUser } = useAuth();

  const [currentView, setCurrentView] = useState<"Áreas" | "Ministérios" | "Cursos">("Áreas");
  const [headerColor, setHeaderColor] = useState(user?.membro?.color || "#D63031"); // Default red if no color

  useEffect(() => {
    setHeaderColor(user?.membro?.color || "#D63031");
  }, [user]);

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHeaderColor(newColor);

    if (user?.membro?.id && loggedUser) {
        // Atualização otimista local para refletir a mudança imediatamente
        if (updateLocalUser) {
             const updatedUser = {
                 ...loggedUser,
                 membro: {
                     ...loggedUser.membro!,
                     color: newColor
                 }
             };
             updateLocalUser(updatedUser);
        }

        try {
            await api.patch(`/membros/${user.membro.id}`, { color: newColor });
        } catch (error) {
            console.error("Failed to update color", error);
        }
    }
  };

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
      {/* Cabeçalho com cor dinâmica */}
      <div 
        className="w-full h-24 relative transition-colors duration-300"
        style={{ backgroundColor: headerColor }}
      >
        {isProfilePage && isMember && loggedUser?.id === user?.id && (
            <div className="absolute top-2 right-2 z-10">
                <label className="cursor-pointer bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors flex items-center justify-center backdrop-blur-sm group">
                    <FaPen className="text-white/80 group-hover:text-white text-xs" />
                    <input 
                        type="color" 
                        value={headerColor}
                        onChange={handleColorChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </label>
            </div>
        )}

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <UserAvatar 
            user={user} 
            size="w-20 h-20" 
            iconSize="text-4xl"
            editable={!!(isProfilePage && isMember && loggedUser?.id === user?.id)}
            onUploadSuccess={(newUrl) => {
                if (loggedUser && loggedUser.id === user?.id && updateLocalUser) {
                    updateLocalUser({ ...loggedUser, avatarUrl: newUrl });
                }
            }}
          />
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
