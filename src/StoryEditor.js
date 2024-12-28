import React, { useState } from 'react';
import { Smile } from 'lucide-react';

const themes = {
    default: {
        name: 'Default',
        background: 'bg-gray-900',
        text: 'text-white',
        textBox: 'bg-white/10 backdrop-blur-sm border border-white/20',
        button: 'bg-gradient-to-r from-purple-500 to-pink-500',
        toolbarBg: 'bg-black/30'
    },
    light: {
        name: 'Light',
        background: 'bg-gray-100',
        text: 'text-gray-900',
        textBox: 'bg-white border border-gray-200 shadow-lg',
        button: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        toolbarBg: 'bg-white/70'
    },
    sunset: {
        name: 'Sunset',
        background: 'bg-gradient-to-br from-orange-400 to-rose-400',
        text: 'text-white',
        textBox: 'bg-white/20 backdrop-blur-sm border border-white/30',
        button: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        toolbarBg: 'bg-black/20'
    },
    nature: {
        name: 'Nature',
        background: 'bg-gradient-to-br from-green-400 to-emerald-500',
        text: 'text-white',
        textBox: 'bg-white/20 backdrop-blur-sm border border-white/30',
        button: 'bg-gradient-to-r from-emerald-400 to-green-500',
        toolbarBg: 'bg-black/20'
    }
};

const commonEmojis = ['❤️', '😊', '🔥', '✨', '💫', '💕', '👋', '🎉', '🌟', '💯'];

const StoryEditor = () => {
    const [elements, setElements] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [activeElement, setActiveElement] = useState(null);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [textStyle, setTextStyle] = useState('normal');
    const [textSize, setTextSize] = useState('medium');

    const textStyles = {
        normal: '',
        bold: 'font-bold',
        italic: 'italic',
        fancy: 'font-serif',
        typewriter: 'font-mono'
    };

    const textSizes = {
        small: 'text-lg',
        medium: 'text-2xl',
        large: 'text-4xl',
        huge: 'text-6xl'
    };

    const handleMouseDown = (e, id) => {
        setIsDragging(true);
        setActiveElement(id);
        setStartPos({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !activeElement) return;

        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        setElements(prevElements =>
            prevElements.map(el =>
                el.id === activeElement
                    ? {
                        ...el,
                        position: {
                            x: el.position.x + deltaX,
                            y: el.position.y + deltaY
                        },
                        zIndex: Math.max(...prevElements.map(e => e.zIndex)) + 1
                    }
                    : el
            )
        );

        setStartPos({
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setActiveElement(null);
    };

    const handleAddElement = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newElement = {
            id: Date.now(),
            type: 'text',
            content: inputText,
            position: { x: window.innerWidth / 2 - 50, y: window.innerHeight / 2 - 50 },
            scale: 1,
            rotation: 0,
            zIndex: elements.length + 1,
            style: textStyle,
            size: textSize
        };

        setElements([...elements, newElement]);
        setInputText('');
    };

    const addEmoji = (emoji) => {
        setInputText(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div
            className={`relative h-screen w-full ${themes[currentTheme].background}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Theme Selector */}
            <div className={`absolute top-4 left-4 flex gap-2 p-2 rounded-lg ${themes[currentTheme].toolbarBg} backdrop-blur-sm`}>
                {Object.entries(themes).map(([key, theme]) => (
                    <button
                        key={key}
                        onClick={() => setCurrentTheme(key)}
                        className={`px-3 py-1 rounded-full text-sm ${currentTheme === key
                                ? 'bg-white text-black shadow-lg'
                                : 'bg-black/20 text-white hover:bg-black/30'
                            }`}
                    >
                        {theme.name}
                    </button>
                ))}
            </div>

            {/* Draggable Elements */}
            {elements.map((element) => (
                <div
                    key={element.id}
                    className={`absolute cursor-move select-none ${themes[currentTheme].text}
            ${textStyles[element.style]} ${textSizes[element.size]}`}
                    style={{
                        left: element.position.x,
                        top: element.position.y,
                        transform: `scale(${element.scale}) rotate(${element.rotation}deg)`,
                        zIndex: element.zIndex,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                >
                    {element.content}
                </div>
            ))}

            {/* Bottom Toolbar */}
            <div className={`absolute bottom-4 left-4 right-4 flex flex-col gap-2 max-w-2xl mx-auto`}>
                {/* Text Controls */}
                <div className={`flex gap-2 p-2 rounded-lg ${themes[currentTheme].toolbarBg} backdrop-blur-sm`}>
                    <select
                        onChange={(e) => setTextStyle(e.target.value)}
                        className="px-2 py-1 rounded bg-black/20 text-white"
                    >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="italic">Italic</option>
                        <option value="fancy">Fancy</option>
                        <option value="typewriter">Typewriter</option>
                    </select>
                    <select
                        onChange={(e) => setTextSize(e.target.value)}
                        className="px-2 py-1 rounded bg-black/20 text-white"
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="huge">Huge</option>
                    </select>
                    <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded hover:bg-black/20"
                    >
                        <Smile className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className={`p-2 rounded-lg ${themes[currentTheme].toolbarBg} backdrop-blur-sm flex gap-2 flex-wrap`}>
                        {commonEmojis.map(emoji => (
                            <button
                                key={emoji}
                                onClick={() => addEmoji(emoji)}
                                className="text-2xl hover:scale-125 transition-transform"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Form */}
                <form
                    onSubmit={handleAddElement}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className={`flex-1 ${themes[currentTheme].textBox} rounded-full px-6 py-3 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${themes[currentTheme].text} placeholder-gray-400`}
                        placeholder="Type text or emoji..."
                    />
                    <button
                        type="submit"
                        className={`px-6 py-3 ${themes[currentTheme].button} text-white rounded-full 
              hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StoryEditor;