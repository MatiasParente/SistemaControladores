export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <div 
            {...props} 
            className={`text-4xl font-black tracking-tighter select-none ${className}`}
        >
            <span className="text-black dark:text-white">CT</span>
            <span className="text-emerald-400">RL</span>
        </div>
    );
}