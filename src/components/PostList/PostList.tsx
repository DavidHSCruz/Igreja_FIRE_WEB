import { FaRegClock } from "react-icons/fa";
import { BsChatSquareQuoteFill } from "react-icons/bs";
import { UserAvatar } from "../UserAvatar/UserAvatar";

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    avatarUrl?: string;
    membro?: {
      nome: string;
    }
  }
}

interface PostListProps {
  posts: Post[];
  emptyMessage?: string;
  className?: string;
}

export const PostList = ({ posts, emptyMessage = "Nenhum post disponível no momento.", className = "" }: PostListProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {posts.map(post => (
        <div key={post.id} className="bg-[#161616] rounded-xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <UserAvatar 
                user={post.author} 
                size="w-10 h-10" 
                iconSize="text-xl" 
                hasBorder={false}
              />
              <div>
                <h4 className="font-bold text-white text-sm">{post.title}</h4>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <FaRegClock className="text-[10px]" /> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              {post.content}
            </p>
          </div>
          
          <div className="w-full h-px bg-white/10 mt-auto mb-4"></div>
          
          <div className="flex gap-6 text-xs text-gray-500">
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <BsChatSquareQuoteFill className="text-sm" /> Comentarios
            </button>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div className="bg-[#161616] rounded-xl p-6 border border-white/5 text-center text-gray-500 min-h-[100px] flex items-center justify-center">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};
