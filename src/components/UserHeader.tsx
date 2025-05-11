
import React from 'react';
import { UserInfo } from '@/types/calendar';
import { Clock, MapPin, Building, ExternalLink, Linkedin, Globe, Calendar, Mail, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserHeaderProps {
  user: UserInfo;
  timezone: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user, timezone }) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 relative z-10">
      {/* Profile Image with enhanced appearance */}
      <div className="relative flex-shrink-0">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-full blur-md opacity-70"></div>
        <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg relative">
          {user.profile_pic ? (
            <AvatarImage src={user.profile_pic} alt={user.username} />
          ) : (
            <AvatarFallback className="text-5xl bg-gradient-to-br from-primary/20 to-blue-600/20 text-primary font-medium">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        {user.user_type === 'premium' && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
      
      {/* User Info Section */}
      <div className="flex flex-col text-center md:text-left">
        {/* Premium badge for mobile view */}
        {user.user_type === 'premium' && (
          <div className="md:hidden flex justify-center mb-1">
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Premium
            </Badge>
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {user.username}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
          {user.user_type === 'premium' && (
            <Badge variant="outline" className="hidden md:flex text-xs bg-primary/10 text-primary border-primary/30 items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Premium
            </Badge>
          )}
          
          {user.organisation_name && (
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Building className="h-4 w-4 mr-1.5 text-primary" />
              <p className="text-base">
                {user.organisation_name}
              </p>
            </div>
          )}
          
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Mail className="h-4 w-4 mr-1.5 text-primary" />
            <p className="text-base">
              {user.email}
            </p>
          </div>
        </div>
        
        {/* External Links */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-5">
          {user.organisation_url && (
            <a 
              href={user.organisation_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-white/90 dark:bg-gray-700/90 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary rounded-full border border-gray-200 dark:border-gray-600 transition-colors shadow-sm hover:shadow-md"
            >
              <Globe className="h-3.5 w-3.5 mr-2 text-primary" />
              Website
              <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
            </a>
          )}
          
          {user.linkedin_url && (
            <a 
              href={user.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-white/90 dark:bg-gray-700/90 text-sm text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary rounded-full border border-gray-200 dark:border-gray-600 transition-colors shadow-sm hover:shadow-md"
            >
              <Linkedin className="h-3.5 w-3.5 mr-2 text-primary" />
              LinkedIn
              <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
            </a>
          )}
          
          {user.platforms && user.platforms.includes("zoom") && (
            <span className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-sm text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800/30">
              <Calendar className="h-3.5 w-3.5 mr-2" />
              Zoom Available
            </span>
          )}
        </div>
        
        {/* Timezone display */}
        <div className="flex items-center justify-center md:justify-start mt-1">
          <div className="text-sm text-gray-700 dark:text-gray-300 flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-100 dark:border-gray-600 shadow-sm">
            <Clock className="h-3.5 w-3.5 mr-2 stroke-primary" />
            <span>Your timezone: <span className="font-medium">{timezone}</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
