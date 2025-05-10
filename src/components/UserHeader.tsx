
import React from 'react';
import { UserInfo } from '@/types/calendar';
import { Clock } from 'lucide-react';

interface UserHeaderProps {
  user: UserInfo;
  timezone: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, timezone }) => {
  return (
    <div className="flex flex-col items-center mb-10">
      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden mb-6 bg-gray-100 flex items-center justify-center shadow-sm">
        {user.profile_pic ? (
          <img 
            src={user.profile_pic} 
            alt={user.username} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-gray-400">
            {user.username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {/* User Info */}
      <h1 className="text-3xl font-bold mb-1 text-gray-800">{user.username}</h1>
      
      {user.organisation_name && (
        <p className="text-gray-600 mb-2 text-lg">
          {user.organisation_name}
        </p>
      )}
      
      {/* Timezone */}
      <div className="text-sm text-gray-500 flex items-center mt-3 bg-gray-50 px-4 py-1.5 rounded-full">
        <Clock className="h-4 w-4 mr-2 stroke-gray-500" />
        <span>{timezone}</span>
      </div>
    </div>
  );
};

export default UserHeader;
