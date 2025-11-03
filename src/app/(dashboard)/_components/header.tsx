'use client';

import { Button } from '@/components/ui/button';
import { Bell, Mail, ChevronRight, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'payment' | 'alert';
  read: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  read: boolean;
  avatar: string;
}

const ThemeToggle = dynamic(() => import("@/components/ui/theme-toggle").then(mod => mod.ThemeToggle), { ssr: false });
import { CommandMenu } from '@/components/command-menu';

export const Header = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean).slice(1);
    
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: '1', title: 'New order received', message: 'Order #1234 from John Doe', time: '2 minutes ago', type: 'order', read: false },
        { id: '2', title: 'Payment processed', message: 'NPR 2,500 received', time: '5 minutes ago', type: 'payment', read: false },
        { id: '3', title: 'Low stock alert', message: 'Product ABC running low', time: '1 hour ago', type: 'alert', read: false },
    ]);
    
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'Sarah Wilson', content: 'Question about product delivery...', time: '10 minutes ago', read: false, avatar: 'SW' },
        { id: '2', sender: 'Mike Johnson', content: 'Thanks for the quick response!', time: '1 hour ago', read: false, avatar: 'MJ' },
    ]);
    
    const unreadNotifications = notifications.filter(n => !n.read).length;
    const unreadMessages = messages.filter(m => !m.read).length;
    
    const formatSegment = (segment: string) => {
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    };
    
    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const markMessageAsRead = (id: string) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };
    
    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };
    
    const markAllMessagesAsRead = () => {
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                    Dashboard
                </Link>
                {pathSegments.map((segment, index) => {
                    const href = `/dashboard/${pathSegments.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathSegments.length - 1;
                    return (
                        <div key={segment} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <Link 
                                href={href} 
                                className={`text-sm ${isLast ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {formatSegment(segment)}
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div className="flex-1 flex justify-center px-4">
                <CommandMenu />
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                            <Bell className="h-4 w-4" />
                            {unreadNotifications > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-500">
                                    {unreadNotifications}
                                </Badge>
                            )}
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="p-3 border-b">
                            <div className="flex items-center justify-between">
                                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                                {unreadNotifications > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={markAllNotificationsAsRead}>
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No notifications</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <DropdownMenuItem 
                                        key={notification.id}
                                        className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-accent/20' : ''}`}
                                        onClick={() => markNotificationAsRead(notification.id)}
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <div className="flex-1 space-y-1">
                                            <div className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</div>
                                            <div className="text-sm text-muted-foreground">{notification.message}</div>
                                            <div className="text-xs text-muted-foreground">{notification.time}</div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeNotification(notification.id);
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                        <div className="p-3 border-t">
                            <Button variant="ghost" className="w-full text-sm">
                                View all notifications
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                            <Mail className="h-4 w-4" />
                            {unreadMessages > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-blue-500 hover:bg-blue-500">
                                    {unreadMessages}
                                </Badge>
                            )}
                            <span className="sr-only">Messages</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="p-3 border-b">
                            <div className="flex items-center justify-between">
                                <DropdownMenuLabel className="p-0">Messages</DropdownMenuLabel>
                                {unreadMessages > 0 && (
                                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={markAllMessagesAsRead}>
                                        Mark all read
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No messages</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <DropdownMenuItem 
                                        key={message.id}
                                        className={`flex items-start gap-3 p-3 ${!message.read ? 'bg-accent/20' : ''}`}
                                        onClick={() => markMessageAsRead(message.id)}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                            {message.avatar}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className={`font-medium text-sm ${!message.read ? 'text-foreground' : 'text-muted-foreground'}`}>{message.sender}</div>
                                            <div className="text-sm text-muted-foreground">{message.content}</div>
                                            <div className="text-xs text-muted-foreground">{message.time}</div>
                                        </div>
                                        {!message.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </div>
                        <div className="p-3 border-t">
                            <Button variant="ghost" className="w-full text-sm">
                                View all messages
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <ThemeToggle />
            </div>
        </header>
    )
}