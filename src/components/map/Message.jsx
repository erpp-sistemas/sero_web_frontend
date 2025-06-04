
const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-400 text-black',
    default: 'bg-gray-700 text-white'
};

const Message = ({ title, text, type = 'default' }) => {

    return (
        <div
            className={`fixed top-2 right-4 px-6 py-4 rounded shadow-lg z-50 transition-all ${typeStyles[type] || typeStyles.default}`}
            style={{ minWidth: '200px', maxWidth: '350px' }}
        >
            <p className='text-lg font-semibold upper'> {title} </p>
            <p className='text-sm'>{text}</p>
        </div>
    );
};

export default Message