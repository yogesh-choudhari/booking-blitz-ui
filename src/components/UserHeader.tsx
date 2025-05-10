
import React from 'react';
import { UserInfo } from '@/types/calendar';
import { Clock, MapPin } from 'lucide-react';

interface UserHeaderProps {
  user: UserInfo;
  timezone: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, timezone }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Profile Image */}
      <div className="w-28 h-28 rounded-full overflow-hidden mb-6 bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200">
        {user.profile_pic ? (
          <img 
            src={user.profile_pic} 
            alt={user.username} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-gray-400">
            {user.username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {/* User Info */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{user.username}</h1>
      
      {user.organisation_name && (
        <p className="text-gray-600 mb-3 text-lg">
          {user.organisation_name}
        </p>
      )}
      
      {/* Timezone */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <div className="text-sm text-gray-600 flex items-center px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
          <Clock className="h-3.5 w-3.5 mr-1.5 stroke-gray-500" />
          <span>{timezone}</span>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
