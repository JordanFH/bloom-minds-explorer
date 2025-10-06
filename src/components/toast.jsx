import { useEffect, useState } from 'react';

const Toast = ({ message, duration = 4000, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-gray-800 text-white shadow-lg
                  transition-all duration-500 ease-in-out
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
        >
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default Toast;