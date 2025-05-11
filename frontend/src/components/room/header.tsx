

interface HeaderProps {
    roomName: string;
    changeUsername: (change: boolean) => void;
}

export default function Header({roomName, changeUsername}: HeaderProps) {

    const changeUsernameHandler = () => {
        changeUsername(true);
    }

    return (
        <div className="flex justify-between items-center p-2 bg-white box-border">
            <h1 className="text-3xl font-bold">{roomName}</h1>
            <div className="bg-blue-50 text-blue-700 py-2 px-4 rounded-full font-medium flex items-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20"
                     fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"/>
                </svg>
                {localStorage.getItem('username')}
                <span
                    className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{localStorage.getItem("role") as string}</span>
                <button
                    onClick={changeUsernameHandler}
                    className="ml-3 bg-yellow-500 text-white px-2 py-1 rounded-full hover:bg-yellow-400 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.621 2.379a3 3 0 00-4.242 0L3 11.621V15h3.379L15.621 6.379a3 3 0 000-4.242z"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}