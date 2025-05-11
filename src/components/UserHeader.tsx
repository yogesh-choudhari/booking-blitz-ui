
import React from 'react';
import { UserInfo } from '@/types/calendar';
import { Clock, MapPin, Building, ExternalLink, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface UserHeaderProps {
  user: UserInfo;
  timezone: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, timezone }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Profile Image */}
      <Avatar className="w-28 h-28 mb-6 border-4 border-white dark:border-gray-800 shadow-md">
        {user.profile_pic ? (
          <AvatarImage src={user.profile_pic} alt={user.username} />
        ) : (
          <AvatarFallback className="text-4xl bg-primary/10 dark:bg-primary/20 text-primary font-medium">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      
      {/* User Info */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">{user.username}</h1>
      
      {user.organisation_name && (
        <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
          <Building className="h-4 w-4 mr-1.5" />
          <p className="text-lg">
            {user.organisation_name}
          </p>
        </div>
      )}
      
      {/* External Links */}
      <div className="flex gap-3 mb-4">
        {user.organisation_url && (
          <a 
            href={user.organisation_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 flex items-center"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            Website
          </a>
        )}
        
        {user.linkedin_url && (
          <a 
            href={user.linkedin_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/80 flex items-center"
          >
            <Linkedin className="h-3.5 w-3.5 mr-1" />
            LinkedIn
          </a>
        )}
      </div>
      
      {/* Timezone */}
      <div className="flex items-center justify-center mt-1">
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <Clock className="h-3.5 w-3.5 mr-1.5 stroke-gray-500 dark:stroke-gray-400" />
          <span>{timezone}</span>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
