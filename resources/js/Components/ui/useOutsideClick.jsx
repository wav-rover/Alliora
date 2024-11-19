import { useEffect } from 'react';

/**
 * A custom React hook that handles clicks outside of a specified element.
 * @param {React.RefObject} ref - A React ref object pointing to the element to monitor for outside clicks.
 * @param {Function} callback - The function to be called when a click outside the element is detected.
 * @returns {void} This hook does not return anything, but sets up and cleans up event listeners.
 */
const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
};

export default useOutsideClick;