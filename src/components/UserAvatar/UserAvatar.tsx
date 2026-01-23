import React, { useRef, useState } from 'react';
import { FaUser, FaCamera, FaSpinner } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface UserAvatarProps {
  user?: {
    avatarUrl?: string;
    membro?: {
      nome: string;
    };
  } | null;
  size?: string; // Tailwind classes for width/height, e.g. "w-20 h-20"
  iconSize?: string; // Tailwind class for icon size, e.g. "text-4xl"
  className?: string;
  editable?: boolean;
  hasBorder?: boolean;
  onUploadSuccess?: (newUrl: string) => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "w-20 h-20",
  iconSize = "text-4xl",
  className = "",
  editable = false,
  hasBorder = true,
  onUploadSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const [imageError, setImageError] = useState(false);

  // Reset error when avatarUrl changes
  React.useEffect(() => {
    setImageError(false);
  }, [user?.avatarUrl]);

  const handleClick = () => {
    if (editable && fileInputRef.current && !loading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      alert("Por favor, selecione uma imagem válida (jpg, jpeg, png, webp).");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newAvatarUrl = response.data.avatarUrl;
      
      if (onUploadSuccess) {
        onUploadSuccess(newAvatarUrl);
      }
      
      // Also refresh global user context
      if (refreshUser) {
        await refreshUser();
      }

    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Erro ao fazer upload da imagem. Tente novamente.");
    } finally {
      setLoading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div 
      className={`relative rounded-full bg-white flex items-center justify-center ${hasBorder ? 'border-4 border-[#161616]' : ''} overflow-hidden ${size} ${className} ${editable ? 'cursor-pointer group' : ''}`}
      onClick={handleClick}
    >
      {loading ? (
        <FaSpinner className={`animate-spin text-black ${iconSize.replace('text-', 'text-base')}`} />
      ) : user?.avatarUrl && !imageError ? (
        <img 
          src={user.avatarUrl} 
          alt={user.membro?.nome || "Avatar"} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <FaUser className={`text-black ${iconSize}`} />
      )}

      {editable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <FaCamera className="text-white text-lg" />
          </div>
        </>
      )}
    </div>
  );
};
