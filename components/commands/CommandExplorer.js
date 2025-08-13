// components/commands/CommandExplorer.js

import { useState, useMemo } from 'react';
import { devCommandData, userCommandData } from './CommandData'; 
import CommandCard from './CommandCard';
import { motion } from 'framer-motion';
// Naye icons import kiye hain
import { FaLock, FaMusic, FaCog, FaStar, FaListUl } from 'react-icons/fa';

// Har category ke liye special color
const categoryColors = {
  'Music': '#3b82f6',
  'Settings': '#8b5cf6',
  'Miscellaneous': '#10b981',
  'Developer': '#ef4444',
  'All': '#ffffff',
};

export default function CommandExplorer() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [showDevCommands, setShowDevCommands] = useState(false);

    const handleDevAccess = () => {
        if (showDevCommands) return;
        const pass = prompt("Enter Developer Access Password:");
        if (pass === "NICKFURY_ADMIN") { 
            setShowDevCommands(true);
        } else if (pass !== null) {
            alert("Access Denied! Incorrect password.");
        }
    };

    const filteredUserData = useMemo(() => {
        if (!Array.isArray(userCommandData)) return [];
        let categoriesToFilter = activeCategory === 'All' || activeCategory === 'Developer'
            ? userCommandData
            : userCommandData.filter(cat => cat.category === activeCategory);
        const lowercasedFilter = searchTerm.toLowerCase();
        return categoriesToFilter.map(category => {
            const filteredCommands = category.commands.filter(command =>
                command.cmd.toLowerCase().includes(lowercasedFilter) ||
                command.desc.toLowerCase().includes(lowercasedFilter)
            );
            return { ...category, commands: filteredCommands };
        }).filter(category => category.commands.length > 0);
    }, [searchTerm, activeCategory]);

    // --- NEW: Har button ke liye naam aur icon set kiya hai ---
    const filterButtons = [
        { name: 'All', icon: <FaListUl /> },
        { name: 'Music', icon: <FaMusic /> },
        { name: 'Settings', icon: <FaCog /> },
        { name: 'Miscellaneous', icon: <FaStar /> },
        { name: 'Developer', icon: <FaLock /> }
    ];

    return (
        <div>
            <div className="mb-8 sticky top-24 z-20 glass-card p-4">
                <input
                    type="text"
                    placeholder="🔍 Search for a command..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 rounded-xl bg-light-bg dark:bg-dark-bg border-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:outline-none transition-all"
                />
                 <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                    {filterButtons.map(button => {
                        const isActive = activeCategory === button.name;
                        const color = categoryColors[button.name];
                        
                        return (
                            <button 
                                key={button.name} 
                                onClick={() => setActiveCategory(button.name)} 
                                // 'flex' aur 'items-center' add kiya hai icon ko align karne ke liye
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out border`}
                                style={{
                                    backgroundColor: isActive ? color : 'rgba(255, 255, 255, 0.1)',
                                    borderColor: isActive ? color : 'rgba(255, 255, 255, 0.2)',
                                    color: isActive ? (button.name === 'All' || button.name === 'Developer' ? '#000' : '#fff') : color,
                                }}
                            >
                                {button.icon} {/* Icon yahan render hoga */}
                                {button.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* (Baki ka code same rahega) */}
            <div className="space-y-16">
                {activeCategory !== 'Developer' && filteredUserData.map(category => (
                    <motion.div 
                        key={category.category}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <h2 className="text-3xl font-bold mb-6" style={{ color: categoryColors[category.category] || '#FFFFFF' }}>{category.category} ({category.commands.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                            {category.commands.map((command) => (
                                <CommandCard 
                                    key={command.cmd} 
                                    command={command.cmd} 
                                    description={command.desc}
                                    usage={command.usage}
                                    color={categoryColors[category.category]}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
                {activeCategory === 'Developer' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        {!showDevCommands ? (
                            <div className="text-center p-10 glass-card max-w-md mx-auto">
                                <FaLock className="mx-auto text-4xl mb-4 text-secondary-dark"/>
                                <h2 className="text-2xl font-bold mb-2">Developer Access Required</h2>
                                <p className="text-gray-400 mb-6">To view these commands, please enter the password.</p>
                                <button onClick={handleDevAccess} className="bubble-btn invite">
                                    Enter Password
                                </button>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-3xl font-bold mb-6" style={{ color: categoryColors['Developer'] }}>Developer Commands ({devCommandData.length})</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                                    {devCommandData.map((command) => (
                                        <CommandCard 
                                            key={command.cmd} 
                                            command={command.cmd} 
                                            description={command.desc} 
                                            usage={command.cmd}
                                            color={categoryColors['Developer']}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
                {activeCategory !== 'Developer' && filteredUserData.length === 0 && (
                    <p className="text-center text-xl text-gray-500 mt-16">No commands found for this filter.</p>
                )}
            </div>
        </div>
    );
}