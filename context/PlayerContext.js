/**
 * Player Context for VEYNOVA Music Player
 * Manages global music player state using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePlayerStore = create(
  persist(
    (set, get) => ({
      // Current track and playback state
      current: null,
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      
      // Player settings
      volume: 0.8,
      repeatMode: 'off', // 'off', 'one', 'all'
      shuffle: false,
      autoplay: true,
      
      // Playback position (in seconds)
      currentTime: 0,
      duration: 0,
      
      // Audio element ref
      audioRef: null,
      
      // Actions
      setAudioRef: (ref) => set({ audioRef: ref }),
      
      setCurrent: (track) => set({ 
        current: track, 
        isLoading: false,
        currentTime: 0 
      }),
      
      setQueue: (tracks, startIndex = 0) => set({ 
        queue: tracks, 
        currentIndex: startIndex >= 0 ? startIndex : 0,
        current: tracks[startIndex] || null 
      }),
      
      addToQueue: (track, position = 'end') => {
        const { queue, currentIndex } = get();
        let newQueue, newIndex;
        
        if (position === 'next') {
          newQueue = [
            ...queue.slice(0, currentIndex + 1),
            track,
            ...queue.slice(currentIndex + 1)
          ];
          newIndex = currentIndex;
        } else {
          newQueue = [...queue, track];
          newIndex = queue.length === 0 ? 0 : currentIndex;
        }
        
        set({ 
          queue: newQueue, 
          currentIndex: newIndex,
          current: newIndex >= 0 ? newQueue[newIndex] : null
        });
      },
      
      removeFromQueue: (index) => {
        const { queue, currentIndex } = get();
        const newQueue = queue.filter((_, i) => i !== index);
        let newIndex = currentIndex;
        
        if (index < currentIndex) {
          newIndex = currentIndex - 1;
        } else if (index === currentIndex) {
          // If removing current track, stay at same index (next track)
          newIndex = Math.min(currentIndex, newQueue.length - 1);
        }
        
        set({ 
          queue: newQueue, 
          currentIndex: newIndex >= 0 ? newIndex : -1,
          current: newIndex >= 0 ? newQueue[newIndex] : null
        });
      },
      
      clearQueue: () => set({ 
        queue: [], 
        currentIndex: -1, 
        current: null, 
        isPlaying: false 
      }),
      
      setCurrentIndex: (index) => {
        const { queue } = get();
        const validIndex = Math.max(0, Math.min(index, queue.length - 1));
        set({ 
          currentIndex: validIndex, 
          current: queue[validIndex] || null,
          currentTime: 0
        });
      },
      
      togglePlay: () => {
        const { isPlaying, audioRef } = get();
        if (audioRef?.current) {
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
        }
        set({ isPlaying: !isPlaying });
      },
      
      play: () => {
        const { audioRef } = get();
        if (audioRef?.current) {
          audioRef.current.play();
        }
        set({ isPlaying: true, isPaused: false });
      },
      
      pause: () => {
        const { audioRef } = get();
        if (audioRef?.current) {
          audioRef.current.pause();
        }
        set({ isPlaying: false, isPaused: true });
      },
      
      stop: () => {
        const { audioRef } = get();
        if (audioRef?.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        set({ isPlaying: false, isPaused: false, currentTime: 0 });
      },
      
      setVolume: (volume) => {
        const { audioRef } = get();
        const clampedVolume = Math.max(0, Math.min(1, volume));
        if (audioRef?.current) {
          audioRef.current.volume = clampedVolume;
        }
        set({ volume: clampedVolume });
      },
      
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setShuffle: (enabled) => set({ shuffle: enabled }),
      setAutoplay: (enabled) => set({ autoplay: enabled }),
      
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      seek: (time) => {
        const { audioRef, duration } = get();
        const clampedTime = Math.max(0, Math.min(time, duration));
        if (audioRef?.current) {
          audioRef.current.currentTime = clampedTime;
        }
        set({ currentTime: clampedTime });
      },
      
      // Navigation
      next: () => {
        const { queue, currentIndex, repeatMode, shuffle } = get();
        
        if (queue.length === 0) return;
        
        let nextIndex;
        
        if (repeatMode === 'one') {
          nextIndex = currentIndex;
        } else if (shuffle) {
          // Random next track (avoid current)
          const availableIndexes = queue
            .map((_, i) => i)
            .filter(i => i !== currentIndex);
          nextIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)] || 0;
        } else {
          nextIndex = currentIndex + 1;
          if (nextIndex >= queue.length) {
            if (repeatMode === 'all') {
              nextIndex = 0;
            } else {
              return; // End of queue
            }
          }
        }
        
        get().setCurrentIndex(nextIndex);
      },
      
      previous: () => {
        const { queue, currentIndex, shuffle } = get();
        
        if (queue.length === 0) return;
        
        let prevIndex;
        
        if (shuffle) {
          // Random previous track (avoid current)
          const availableIndexes = queue
            .map((_, i) => i)
            .filter(i => i !== currentIndex);
          prevIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)] || 0;
        } else {
          prevIndex = currentIndex - 1;
          if (prevIndex < 0) {
            prevIndex = queue.length - 1; // Loop to end
          }
        }
        
        get().setCurrentIndex(prevIndex);
      },
      
      // Shuffle queue
      shuffleQueue: () => {
        const { queue, currentIndex, current } = get();
        if (queue.length <= 1) return;
        
        // Create shuffled array excluding current track
        const otherTracks = queue.filter((_, i) => i !== currentIndex);
        const shuffled = [...otherTracks].sort(() => Math.random() - 0.5);
        
        // Place current track at beginning
        const newQueue = current ? [current, ...shuffled] : shuffled;
        
        set({ queue: newQueue, currentIndex: 0 });
      },
    }),
    {
      name: 'veynova-player',
      partialize: (state) => ({
        volume: state.volume,
        repeatMode: state.repeatMode,
        shuffle: state.shuffle,
        autoplay: state.autoplay,
      }),
    }
  )
);

export default usePlayerStore;