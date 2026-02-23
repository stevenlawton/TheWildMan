export default function Pill({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
                active
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-steel border-black/10 hover:border-accent/40 hover:text-ink"
            }`}
        >
            {label}
        </button>
    );
}
