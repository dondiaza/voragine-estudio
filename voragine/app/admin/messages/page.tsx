'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, Archive, Eye, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
}

const projectTypeLabels: Record<string, string> = {
  'bodas': 'Bodas',
  'eventos': 'Eventos',
  'personal': 'Personal',
  'proyectos-creativos': 'Proyectos Creativos',
  'otro': 'Otro',
};

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      const data = await api.contact.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleView = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await api.contact.getById(msg._id);
        fetchMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };
  
  const handleArchive = async (id: string) => {
    try {
      await api.contact.archive(id);
      fetchMessages();
    } catch (error) {
      console.error('Error archiving message:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este mensaje?')) return;
    
    try {
      await api.contact.delete(id);
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  
  const filteredMessages = filter === 'unread'
    ? messages.filter(m => !m.read)
    : messages.filter(m => !m.archived);
  
  const unreadCount = messages.filter(m => !m.read).length;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-voragine-black" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-voragine-black mb-2">
            Mensajes
          </h1>
          <p className="text-voragine-gray">
            Gestiona los mensajes de contacto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm transition-colors ${
              filter === 'all' ? 'bg-voragine-black text-white' : 'bg-white text-voragine-gray'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
              filter === 'unread' ? 'bg-voragine-black text-white' : 'bg-white text-voragine-gray'
            }`}
          >
            No leídos
            {unreadCount > 0 && (
              <span className="bg-voragine-accent text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-voragine-gray">No hay mensajes</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {filteredMessages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => handleView(msg)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedMessage?._id === msg._id ? 'bg-voragine-bg' : ''
                  } ${!msg.read ? 'bg-voragine-accent/5' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-medium ${!msg.read ? 'text-voragine-black' : 'text-voragine-gray'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-voragine-gray">
                      {new Date(msg.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="text-sm text-voragine-gray truncate">
                    {msg.message}
                  </p>
                  <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded">
                    {projectTypeLabels[msg.projectType]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2 bg-white p-6">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl text-voragine-black mb-2">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-voragine-gray text-sm">
                    {selectedMessage.email}
                    {selectedMessage.phone && ` · ${selectedMessage.phone}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArchive(selectedMessage._id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Archivar"
                  >
                    <Archive size={18} className="text-voragine-gray" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <span className="inline-block bg-voragine-accent/10 text-voragine-accent text-sm px-3 py-1 rounded">
                  {projectTypeLabels[selectedMessage.projectType]}
                </span>
              </div>
              
              <div className="bg-voragine-bg p-6 rounded-lg">
                <h3 className="text-xs uppercase tracking-widest text-voragine-gray mb-3">
                  Mensaje
                </h3>
                <p className="text-voragine-black whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-sm text-voragine-gray">
                <span>
                  Recibido el {new Date(selectedMessage.createdAt).toLocaleString('es-ES')}
                </span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="btn-primary py-2 px-4"
                >
                  Responder
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-center py-12">
              <div>
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-voragine-gray">
                  Selecciona un mensaje para verlo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
