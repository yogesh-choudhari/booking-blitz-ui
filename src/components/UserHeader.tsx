
import React from 'react';
import { UserInfo } from '@/types/calendar';

interface UserHeaderProps {
  user: UserInfo;
  timezone: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, timezone }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Profile Image */}
      <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
        {user.profile_pic ? (
          <img 
            src={user.profile_pic} 
            alt={user.username} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-semibold text-gray-500">
            {user.username.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {/* User Info */}
      <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
      
      {user.organisation_name && (
        <p className="text-gray-600 mb-1">
          {user.organisation_name}
        </p>
      )}
      
      {/* Timezone */}
      <div className="text-sm text-gray-500 flex items-center mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{timezone}</span>
      </div>
    </div>
  );
};

export default UserHeader;
