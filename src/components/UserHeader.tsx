
import React from 'react';
import { UserInfo } from '@/types/calendar';
import { Clock, MapPin, Building, ExternalLink, Linkedin, Globe, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface UserHeaderProps {
  user: UserInfo;
  timezone: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, timezone }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      {/* Profile Image with glow effect */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur-sm opacity-70"></div>
        <Avatar className="w-28 h-28 border-4 border-white dark:border-gray-800 shadow-xl relative">
          {user.profile_pic ? (
            <AvatarImage src={user.profile_pic} alt={user.username} />
          ) : (
            <AvatarFallback className="text-4xl bg-gradient-to-br from-primary/20 to-blue-600/20 text-primary font-medium">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </div>
      
      {/* User Info */}
      <h1 className="text-3xl font-bold mt-6 mb-2 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
        {user.username}
      </h1>
      
      {user.organisation_name && (
        <div className="flex items-center mb-3 text-gray-700 dark:text-gray-300">
          <Building className="h-4 w-4 mr-1.5 text-primary" />
          <p className="text-lg">
            {user.organisation_name}
          </p>
        </div>
      )}
      
      {/* External Links */}
      <div className="flex gap-4 mb-5">
        {user.organisation_url && (
          <a 
            href={user.organisation_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary rounded-full border border-gray-200 dark:border-gray-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Globe className="h-3.5 w-3.5 mr-1.5 text-primary" />
            Website
          </a>
        )}
        
        {user.linkedin_url && (
          <a 
            href={user.linkedin_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary rounded-full border border-gray-200 dark:border-gray-600 transition-colors shadow-sm hover:shadow-md"
          >
            <Linkedin className="h-3.5 w-3.5 mr-1.5 text-primary" />
            LinkedIn
          </a>
        )}
      </div>
      
      {/* Timezone display */}
      <div className="flex items-center justify-center mt-1">
        <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-100 dark:border-gray-600 shadow-sm">
          <Clock className="h-3.5 w-3.5 mr-2 stroke-primary" />
          <span>Your timezone: <span className="font-medium">{timezone}</span></span>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
